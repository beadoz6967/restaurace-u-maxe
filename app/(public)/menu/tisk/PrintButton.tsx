"use client";

import { useEffect, useRef } from "react";
import styles from "./tisk.module.css";

/**
 * Screen-only control that opens the browser print dialog. With `autoPrint`
 * (set from `?print=1`) it fires once on mount; the ref guard keeps React 19
 * StrictMode's double-invoke in dev from opening the dialog twice.
 */
export default function PrintButton({
  autoPrint = false,
}: {
  autoPrint?: boolean;
}) {
  const printed = useRef(false);

  useEffect(() => {
    if (autoPrint && !printed.current) {
      printed.current = true;
      window.print();
    }
  }, [autoPrint]);

  return (
    <button
      type="button"
      className={styles.printButton}
      onClick={() => window.print()}
    >
      Vytisknout / Uložit jako PDF
    </button>
  );
}
