"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Modal from "@/components/Modal";
import AddButton from "@/components/AddButton";
import ProgressRing from "@/components/ProgressRing";
import FinanceTrendChart from "@/components/FinanceTrendChart";
import { X } from "@phosphor-icons/react/dist/ssr";

type Entry = {
  id: string;
  kind: "income" | "expense" | "saving" | "debt" | "tuition" | "bill" | "weekly_budget";
  label: string;
  amount: number;
  month: string;
  target_amount: number | null;
};

const EMPTY: Entry = { id: "", kind: "expense", label: "", amount: 0, month: "", target_amount: null };

export default function FinanceBoard({ initialEntries, userId }: { initialEntries: Entry[]; userId: string }) {
  const supabase = createClient();
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Everything below is derived straight from `entries`, so the moment that
  // state changes (add, edit, or delete), the rings, totals, and chart all
  // re-render automatically. Nothing here depends on a page reload.
  const income = useMemo(() => entries.filter((e) => e.kind === "income").reduce((s, e) => s + Number(e.amount), 0), [entries]);
  const expenses = useMemo(() => entries.filter((e) => e.kind === "expense").reduce((s, e) => s + Number(e.amount), 0), [entries]);
  const savingsEntry = useMemo(() => entries.find((e) => e.kind === "saving"), [entries]);
  const savingsPct = savingsEntry?.target_amount ? Math.round((Number(savingsEntry.amount) / Number(savingsEntry.target_amount)) * 100) : 0;
  const budgetUsedPct = income > 0 ? Math.round((expenses / income) * 100) : 0;
  const lineItems = useMemo(() => entries.filter((e) => ["saving", "debt", "tuition", "bill"].includes(e.kind)), [entries]);
  const trend = useMemo(
    () =>
      entries
        .filter((e) => e.kind === "expense" || e.kind === "saving")
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        .map((e) => ({ month: new Date(e.month).toLocaleDateString(undefined, { month: "short" }), amount: Number(e.amount) })),
    [entries]
  );

  function openNew(kind: Entry["kind"] = "expense") {
    const month = new Date();
    month.setDate(1);
    setEditing({ ...EMPTY, kind, month: month.toISOString().slice(0, 10) });
    setIsNew(true);
  }
  function openEdit(entry: Entry) {
    setEditing({ ...entry });
    setIsNew(false);
  }

  async function handleDelete(id: string) {
    setEntries((e) => e.filter((x) => x.id !== id));
    await supabase.from("finance_entries").delete().eq("id", id);
  }

  async function handleSave() {
    if (!editing) return;
    if (isNew) {
      const { data } = await supabase
        .from("finance_entries")
        .insert({
          user_id: userId,
          kind: editing.kind,
          label: editing.label || "Untitled",
          amount: editing.amount,
          target_amount: editing.target_amount,
          month: editing.month,
        })
        .select()
        .single();
      if (data) setEntries((e) => [...e, data as Entry]);
    } else {
      await supabase
        .from("finance_entries")
        .update({ kind: editing.kind, label: editing.label, amount: editing.amount, target_amount: editing.target_amount, month: editing.month })
        .eq("id", editing.id);
      setEntries((e) => e.map((x) => (x.id === editing.id ? editing : x)));
    }
    setEditing(null);
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <AddButton label="Add entry" onClick={() => openNew("expense")} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-muted">This month</h2>
          <p className="mt-3 text-2xl font-semibold text-ink dark:text-white">₱{income.toLocaleString()}</p>
          <p className="text-xs text-muted">Income</p>
          <p className="mt-3 text-2xl font-semibold text-alc-rose">₱{expenses.toLocaleString()}</p>
          <p className="text-xs text-muted">Expenses</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => openNew("income")} className="text-xs font-medium text-alc-rose hover:underline">
              + Add income
            </button>
            <button onClick={() => openNew("expense")} className="text-xs font-medium text-alc-rose hover:underline">
              + Add expense
            </button>
          </div>
        </div>

        <div className="glass-card flex items-center justify-around p-5">
          <ProgressRing percent={budgetUsedPct} label="Budget used" gradientId="ringBudget" />
          <ProgressRing percent={savingsPct} label="Savings goal" gradientId="ringSavings" />
        </div>

        <div className="glass-card p-5">
          <h2 className="mb-3 text-sm font-semibold text-muted">Weekly budget tracker</h2>
          <div className="mt-3 flex flex-col gap-2">
            {["Week 1", "Week 2", "Week 3", "Week 4"].map((w, i) => (
              <div key={w} className="flex items-center gap-3">
                <span className="w-14 text-xs text-muted">{w}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-alc-cream">
                  <div
                    className="h-full rounded-full bg-alc-gradient"
                    style={{ width: `${Math.min(100, Math.round((expenses / 4 / Math.max(income / 4, 1)) * 100 * (0.7 + i * 0.15)))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="glass-card p-5 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-muted">Spending trend</h2>
          {trend.length ? (
            <FinanceTrendChart data={trend} />
          ) : (
            <p className="py-10 text-center text-sm text-muted">Add an expense or saving entry to see your trend here.</p>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted">Savings, debts, tuition & bills</h2>
            <AddButton label="Add" onClick={() => openNew("saving")} />
          </div>
          <ul className="flex flex-col gap-3">
            {lineItems.map((item) => (
              <li
                key={item.id}
                onClick={() => openEdit(item)}
                className="editable-card relative cursor-pointer rounded-glass-sm bg-white/50 px-3 py-2 text-sm"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="card-delete-btn"
                >
                  <X size={13} weight="bold" />
                </button>
                <div className="flex items-center justify-between">
                  <span className="text-ink">{item.label}</span>
                  <span className="font-medium text-alc-rose">
                    ₱{Number(item.amount).toLocaleString()}
                    {item.target_amount ? ` / ₱${Number(item.target_amount).toLocaleString()}` : ""}
                  </span>
                </div>
              </li>
            ))}
            {!lineItems.length && <p className="text-sm text-muted">Nothing here yet. Add a savings goal, debt, tuition, or bill.</p>}
          </ul>
        </div>
      </div>

      {/* Rendered at the top level, outside any hover-transformed card, so the
          centered modal is never confined by an ancestor's transform. */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add entry" : "Edit entry"}>
        {editing && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Type</label>
              <select
                value={editing.kind}
                onChange={(e) => setEditing({ ...editing, kind: e.target.value as Entry["kind"] })}
                className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-alc-rose"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="saving">Savings</option>
                <option value="debt">Debt</option>
                <option value="tuition">Tuition</option>
                <option value="bill">Bill</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Label</label>
              <input
                value={editing.label}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-alc-rose"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Amount</label>
                <input
                  type="number"
                  value={editing.amount}
                  onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })}
                  className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-alc-rose"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Target (optional)</label>
                <input
                  type="number"
                  value={editing.target_amount ?? ""}
                  onChange={(e) => setEditing({ ...editing, target_amount: e.target.value ? Number(e.target.value) : null })}
                  className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-alc-rose"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Month</label>
              <input
                type="date"
                value={editing.month}
                onChange={(e) => setEditing({ ...editing, month: e.target.value })}
                className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-alc-rose"
              />
            </div>
            <button onClick={handleSave} className="btn-gradient mt-2 text-sm">
              Save entry
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
