"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CartIcon } from "@/components/layout/icons";

export function CartDrawer({
  label,
  countLabel,
  count,
  closeLabel,
  children,
}: {
  label: string;
  countLabel: string;
  count: number;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="btn-icon relative"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={count ? `${label}, ${countLabel}` : label}
        onClick={() => setOpen(true)}
      >
        <CartIcon />
        {count ? (
          <span className="cart-count">{count > 99 ? "99+" : count}</span>
        ) : null}
      </button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={label}>
              <button
                type="button"
                className="cart-drawer-backdrop absolute inset-0"
                aria-label={closeLabel}
                onClick={() => setOpen(false)}
              />
              <div className="cart-drawer-panel absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-heading text-section-title text-ink">{label}</h2>
                  <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
                    {closeLabel}
                  </button>
                </div>
                {children}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
