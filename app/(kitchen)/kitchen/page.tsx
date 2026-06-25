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
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
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

  return (
    <main className="min-h-screen px-6 py-12 md:px-10">
      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#C8962A33] pb-6">
        <h1 className="font-tactical text-3xl font-extrabold uppercase tracking-[0.1em] text-cream md:text-4xl">
          Objednávky
        </h1>
        <p className="font-body text-sm uppercase tracking-[0.2em] text-beige/50">
          {todayLabel.format(new Date())}
        </p>
      </header>

      {loading ? null : orders.length === 0 ? (
        <p className="mt-32 text-center font-body text-lg text-beige/40">
          Žádné nové objednávky.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onDone={markDone} />
          ))}
        </div>
      )}
    </main>
  );
}

function OrderCard({
  order,
  onDone,
}: {
  order: KitchenOrder;
  onDone: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border border-gold/30 p-6">
      <div className="flex items-baseline justify-between gap-4">
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

      <p className="font-body text-xs tabular-nums text-beige/40">
        Přijato {receivedTime.format(new Date(order.created_at))}
      </p>
    </div>
  );
}
