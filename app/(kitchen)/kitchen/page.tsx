"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatKc } from "@/lib/format";

/** A single line within an order's items jsonb. */
interface OrderLine {
  name: string;
  quantity: number;
  price: number;
}

/** One row of the Supabase `orders` table. */
interface KitchenOrder {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  pickup_time: string;
  items: OrderLine[];
  total: number;
  status: "new" | "done";
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

const receivedTime = new Intl.DateTimeFormat("cs-CZ", {
  timeZone: "Europe/Prague",
  hour: "2-digit",
  minute: "2-digit",
});

const todayLabel = new Intl.DateTimeFormat("cs-CZ", {
  timeZone: "Europe/Prague",
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** Today's date in Europe/Prague as a YYYY-MM-DD string. */
function pragueTodayYMD(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Shift a YYYY-MM-DD string by whole days (UTC-anchored, stays calendar-safe). */
function shiftYMD(ymd: string, days: number): string {
  return new Date(Date.parse(`${ymd}T00:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

/** Human label for a YYYY-MM-DD Prague day (noon-anchored to avoid TZ edges). */
function dayLabel(ymd: string): string {
  return todayLabel.format(new Date(`${ymd}T12:00:00Z`));
}

export default function Kitchen() {
  // The PIN doubles as the X-Kitchen-Token shared secret for the order API, so
  // it is retained for the session (not just a boolean flag).
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Restore a prior session so a refresh doesn't re-prompt for the PIN.
  useEffect(() => {
    setToken(sessionStorage.getItem("kitchen_token"));
    setReady(true);
  }, []);

  const signIn = useCallback((pin: string) => {
    sessionStorage.setItem("kitchen_token", pin);
    setToken(pin);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem("kitchen_token");
    setToken(null);
  }, []);

  if (!ready) return null;
  if (!token) return <PinGate onSuccess={signIn} />;
  return <Board token={token} onUnauthorized={signOut} />;
}

function PinGate({ onSuccess }: { onSuccess: (pin: string) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/kitchen-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        onSuccess(pin);
      } else {
        setError(true);
        setPin("");
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <form onSubmit={submit} className="flex w-full max-w-xs flex-col items-center">
        <p className="font-tactical text-sm font-bold uppercase tracking-[0.3em] text-gold">
          Kuchyně
        </p>
        <label
          htmlFor="pin"
          className="mt-8 font-tactical text-xs uppercase tracking-[0.25em] text-beige/50"
        >
          Zadejte PIN
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className={`mt-4 w-full border-0 border-b border-[#C8962A44] bg-transparent pb-2 pt-2 text-center font-body text-2xl tabular-nums tracking-[0.5em] text-cream outline-none transition-colors duration-200 [color-scheme:dark] focus:border-gold ${FOCUS_RING}`}
        />
        <button
          type="submit"
          disabled={pin.length === 0 || busy}
          className={`mt-8 w-full touch-manipulation border border-gold py-4 font-tactical text-sm font-bold uppercase tracking-[0.25em] text-beige transition-colors duration-200 hover:border-rust hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
        >
          {busy ? "Ověřuji..." : "Vstoupit"}
        </button>
        {error && (
          <p className="mt-6 font-body text-sm text-rust" role="alert">
            Nesprávný PIN
          </p>
        )}
      </form>
    </main>
  );
}

function Board({
  token,
  onUnauthorized,
}: {
  token: string;
  onUnauthorized: () => void;
}) {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "done">("active");

  // Reads run through the service-role API route (no anon SELECT on `orders`,
  // so customer PII is never exposed via the public Supabase REST endpoint).
  const loadOrders = useCallback(async () => {
    const res = await fetch("/api/kitchen-orders", {
      headers: { "X-Kitchen-Token": token },
    });
    if (res.status === 401) {
      onUnauthorized();
      return;
    }
    const data: { orders?: KitchenOrder[] } = await res
      .json()
      .catch(() => ({}));
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [token, onUnauthorized]);

  useEffect(() => {
    loadOrders();

    // Poll every 15s through the secure route so the board stays current even
    // without the realtime push (which would require an anon SELECT policy we
    // intentionally don't grant — that policy is what exposed customer PII).
    const poll = setInterval(loadOrders, 15000);

    // Realtime: new orders appear, completed orders drop off, all without
    // reload. On every (re)subscribe — including reconnection after a network
    // blip — refetch so inserts missed while offline are not lost. Delivery
    // only happens if an anon SELECT policy exists; polling is the fallback.
    const channel = supabase
      .channel("orders-kitchen")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const order = payload.new as KitchenOrder;
          if (order.status !== "new") return;
          setOrders((prev) =>
            prev.some((o) => o.id === order.id) ? prev : [...prev, order]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const order = payload.new as KitchenOrder;
          setOrders((prev) =>
            order.status === "new"
              ? prev.map((o) => (o.id === order.id ? order : o))
              : prev.filter((o) => o.id !== order.id)
          );
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") loadOrders();
      });

    return () => {
      clearInterval(poll);
      supabase.removeChannel(channel);
    };
  }, [loadOrders]);

  const markDone = useCallback(
    async (id: string) => {
      // Optimistically remove; the realtime UPDATE keeps other clients in sync.
      setOrders((prev) => prev.filter((o) => o.id !== id));
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Kitchen-Token": token,
        },
        body: JSON.stringify({ status: "done" }),
      });
    },
    [token]
  );

  const tabClass = (active: boolean) =>
    `touch-manipulation border px-5 py-2 font-tactical text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-200 ${
      active
        ? "border-gold text-cream"
        : "border-[#C8962A33] text-beige/50 hover:border-gold hover:text-beige"
    } ${FOCUS_RING}`;

  return (
    <main className="min-h-[100dvh] px-6 py-12 md:px-10">
      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#C8962A33] pb-6">
        <h1 className="font-tactical text-3xl font-extrabold uppercase tracking-[0.1em] text-cream md:text-4xl">
          Objednávky
        </h1>
        <p className="font-body text-sm uppercase tracking-[0.2em] text-beige/50">
          {todayLabel.format(new Date())}
        </p>
      </header>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => setTab("active")}
          className={tabClass(tab === "active")}
        >
          Aktivní
        </button>
        <button
          type="button"
          onClick={() => setTab("done")}
          className={tabClass(tab === "done")}
        >
          Hotové
        </button>
      </div>

      {tab === "active" ? (
        loading ? null : orders.length === 0 ? (
          <p className="mt-32 text-center font-body text-lg text-beige/40">
            Žádné nové objednávky.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onDone={markDone} />
            ))}
          </div>
        )
      ) : (
        <HistoryView token={token} onUnauthorized={onUnauthorized} />
      )}
    </main>
  );
}

function HistoryView({
  token,
  onUnauthorized,
}: {
  token: string;
  onUnauthorized: () => void;
}) {
  const today = pragueTodayYMD();
  const [date, setDate] = useState(today);
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  // Reads run through the service-role API route (no anon SELECT on `orders`,
  // so customer PII is never exposed via the public Supabase REST endpoint).
  const loadHistory = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/order-history?date=${date}`, {
      headers: { "X-Kitchen-Token": token },
    });
    if (res.status === 401) {
      onUnauthorized();
      return;
    }
    const data: { orders?: KitchenOrder[] } = await res
      .json()
      .catch(() => ({}));
    setOrders(data.orders ?? []);
    setSelected(new Set());
    setLoading(false);
  }, [date, token, onUnauthorized]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Only completed orders can be cleared; active ones are never removable here.
  const clearable = orders.filter((o) => o.status === "done");

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allSelected =
    clearable.length > 0 && clearable.every((o) => selected.has(o.id));

  const toggleSelectAll = useCallback(() => {
    setSelected((prev) =>
      prev.size >= clearable.length && clearable.every((o) => prev.has(o.id))
        ? new Set()
        : new Set(clearable.map((o) => o.id))
    );
  }, [clearable]);

  const deleteSelected = useCallback(async () => {
    if (selected.size === 0 || deleting) return;
    if (
      !window.confirm(
        `Smazat ${selected.size} dokončených objednávek? Tuto akci nelze vrátit.`
      )
    )
      return;
    setDeleting(true);
    const results = await Promise.all(
      [...selected].map((id) =>
        fetch(`/api/orders/${id}`, {
          method: "DELETE",
          headers: { "X-Kitchen-Token": token },
        })
      )
    );
    setDeleting(false);
    if (results.some((r) => r.status === 401)) {
      onUnauthorized();
      return;
    }
    loadHistory();
  }, [selected, deleting, token, onUnauthorized, loadHistory]);

  const isToday = date >= today;

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C8962A22] pb-5">
        <p className="font-tactical text-sm font-bold uppercase tracking-[0.15em] text-gold">
          {dayLabel(date)}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDate((d) => shiftYMD(d, -1))}
            className={`touch-manipulation border border-[#C8962A33] px-4 py-2 font-tactical text-xs font-bold uppercase tracking-[0.2em] text-beige transition-colors duration-200 hover:border-gold hover:text-cream ${FOCUS_RING}`}
          >
            ‹ Předchozí den
          </button>
          <button
            type="button"
            onClick={() => setDate((d) => shiftYMD(d, 1))}
            disabled={isToday}
            className={`touch-manipulation border border-[#C8962A33] px-4 py-2 font-tactical text-xs font-bold uppercase tracking-[0.2em] text-beige transition-colors duration-200 hover:border-gold hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
          >
            Další den ›
          </button>
          <button
            type="button"
            onClick={loadHistory}
            className={`touch-manipulation border border-[#C8962A33] px-4 py-2 font-tactical text-xs font-bold uppercase tracking-[0.2em] text-beige transition-colors duration-200 hover:border-gold hover:text-cream ${FOCUS_RING}`}
          >
            Obnovit
          </button>
        </div>
      </div>

      {loading ? null : orders.length === 0 ? (
        <p className="mt-32 text-center font-body text-lg text-beige/40">
          Žádné objednávky pro tento den.
        </p>
      ) : (
        <>
          {clearable.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-3 font-tactical text-xs uppercase tracking-[0.2em] text-beige/60">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className={`h-5 w-5 cursor-pointer accent-rust ${FOCUS_RING}`}
                />
                Vybrat vše ({clearable.length})
              </label>
              <button
                type="button"
                onClick={deleteSelected}
                disabled={selected.size === 0 || deleting}
                className={`touch-manipulation border border-rust px-5 py-2 font-tactical text-xs font-bold uppercase tracking-[0.2em] text-rust transition-colors duration-200 hover:bg-rust hover:text-cream disabled:cursor-not-allowed disabled:border-[#C8962A33] disabled:text-beige/30 disabled:hover:bg-transparent ${FOCUS_RING}`}
              >
                {deleting
                  ? "Mažu..."
                  : `Smazat vybrané${selected.size > 0 ? ` (${selected.size})` : ""}`}
              </button>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                selected={selected.has(order.id)}
                onToggleSelect={
                  order.status === "done" ? toggleSelect : undefined
                }
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function OrderCard({
  order,
  onDone,
  selected,
  onToggleSelect,
}: {
  order: KitchenOrder;
  onDone?: (id: string) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}) {
  return (
    <div
      className={`flex flex-col gap-4 border p-6 transition-colors duration-200 ${
        selected ? "border-rust" : "border-gold/30"
      }`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={selected ?? false}
              onChange={() => onToggleSelect(order.id)}
              aria-label={`Vybrat objednávku — ${order.customer_name}`}
              className={`mt-1 h-5 w-5 shrink-0 cursor-pointer accent-rust ${FOCUS_RING}`}
            />
          )}
          <div className="min-w-0">
            <p className="truncate font-tactical text-lg font-bold uppercase tracking-[0.05em] text-cream">
              {order.customer_name}
            </p>
            <a
              href={`tel:${order.customer_phone}`}
              className="font-body text-sm text-beige/60 transition-colors duration-200 hover:text-gold"
            >
              {order.customer_phone}
            </a>
          </div>
        </div>
        <span className="shrink-0 font-tactical text-lg font-bold tabular-nums text-gold">
          {order.pickup_time}
        </span>
      </div>

      <ul className="flex flex-col gap-1 border-t border-[#C8962A22] pt-4">
        {order.items.map((line, i) => (
          <li
            key={i}
            className="flex items-baseline justify-between gap-4 font-body text-sm text-beige"
          >
            <span className="min-w-0 break-words">{line.name}</span>
            <span className="shrink-0 tabular-nums text-beige/60">
              {line.quantity} × {formatKc(line.price)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-baseline justify-between border-t border-[#C8962A22] pt-4">
        <span className="font-tactical text-xs uppercase tracking-[0.25em] text-beige/50">
          Celkem
        </span>
        <span className="font-body text-lg tabular-nums text-gold">
          {formatKc(order.total)}
        </span>
      </div>

      {onDone && (
        <button
          type="button"
          onClick={() => onDone(order.id)}
          className={`group mt-2 flex w-full touch-manipulation items-center justify-center gap-4 border border-gold py-4 transition-colors duration-200 hover:border-rust ${FOCUS_RING}`}
        >
          <span className="font-tactical text-sm font-bold uppercase tracking-[0.25em] text-beige transition-colors duration-200 group-hover:text-cream">
            Hotovo
          </span>
          <span
            aria-hidden
            className="font-tactical text-sm text-gold transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      )}

      <p className="font-body text-xs tabular-nums text-beige/40">
        Přijato {receivedTime.format(new Date(order.created_at))}
      </p>
    </div>
  );
}
