import { useState } from 'react';
import { expensesApi } from '../api.js';
import { ConfirmDelete, Empty, Field, Modal, PageHead } from '../components.jsx';
import { money, nameOf } from '../format.js';

export default function Expenses({ expenses, users, categories, reload, notify }) {
  const [editing, setEditing] = useState(null); // null | 'new' | expense
  const [deleting, setDeleting] = useState(null);
  const canCreate = users.length > 0 && categories.length > 0;
  const sorted = [...expenses].sort((a, b) => b.id - a.id);

  return (
    <>
      <PageHead
        title="Expenses"
        sub={`${expenses.length} recorded`}
        action={
          <button type="button" className="btn primary" onClick={() => setEditing('new')} disabled={!canCreate}>
            Add expense
          </button>
        }
      />
      {!canCreate && (
        <p className="notice">You need at least one user and one category before you can add an expense.</p>
      )}

      {sorted.length === 0 ? (
        <Empty title="No expenses yet">Add an expense to start tracking your spending.</Empty>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr><th>Description</th><th>Category</th><th>User</th><th className="num">Amount</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {sorted.map((e) => (
                <tr key={e.id}>
                  <td data-label="Description">{e.description || <span className="muted">No description</span>}</td>
                  <td data-label="Category">{nameOf(categories, e.categoryid, 'Unknown category')}</td>
                  <td data-label="User">{nameOf(users, e.userid, 'Unknown user')}</td>
                  <td data-label="Amount" className="num">{money(e.amount)}</td>
                  <td className="row-actions">
                    <button type="button" className="btn small" onClick={() => setEditing(e)} aria-label={`Edit ${e.description}`}>Edit</button>
                    <button type="button" className="btn small danger-outline" onClick={() => setDeleting(e)} aria-label={`Delete ${e.description}`}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ExpenseForm
          expense={editing === 'new' ? null : editing}
          users={users}
          categories={categories}
          onClose={() => setEditing(null)}
          onSubmit={async (body) => {
            if (editing === 'new') await expensesApi.create(body);
            else await expensesApi.update(editing.id, body);
            await reload();
            notify(editing === 'new' ? 'Expense added.' : 'Expense updated.');
            setEditing(null);
          }}
        />
      )}

      {deleting && (
        <ConfirmDelete
          title="Delete expense?"
          message={`“${deleting.description}” (${money(deleting.amount)}) will be permanently deleted.`}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await expensesApi.remove(deleting.id);
            await reload();
            notify('Expense deleted.');
            setDeleting(null);
          }}
        />
      )}
    </>
  );
}

function ExpenseForm({ expense, users, categories, onSubmit, onClose }) {
  const editing = !!expense;
  const [form, setForm] = useState({
    description: expense?.description ?? '',
    amount: expense?.amount ?? '',
    userid: '',
    categoryid: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const found = {};
    const amount = Number(form.amount);
    const description = form.description.trim();
    if (!description) found.description = 'Enter a description.';
    if (form.amount === '' || !Number.isFinite(amount) || amount < 0) found.amount = 'Enter an amount of 0 or more.';
    if (!editing && !form.userid) found.userid = 'Choose a user.';
    if (!editing && !form.categoryid) found.categoryid = 'Choose a category.';
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    setApiError('');
    try {
      await onSubmit(
        editing
          ? { amount, description }
          : { amount, description, userid: Number(form.userid), categoryid: Number(form.categoryid) },
      );
    } catch (err) {
      setApiError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title={editing ? 'Edit expense' : 'Add expense'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <Field label="Description" error={errors.description}>
          <input value={form.description} onChange={set('description')} aria-invalid={!!errors.description} autoFocus autoComplete="off" />
        </Field>
        <Field label="Amount" error={errors.amount}>
          <input type="number" inputMode="decimal" min="0" step="0.01" value={form.amount} onChange={set('amount')} aria-invalid={!!errors.amount} />
        </Field>

        {editing ? (
          <p className="muted small">
            {nameOf(users, expense.userid, 'Unknown user')} · {nameOf(categories, expense.categoryid, 'Unknown category')}.
            The user and category can't be changed after an expense is created.
          </p>
        ) : (
          <>
            <Field label="User" error={errors.userid}>
              <select value={form.userid} onChange={set('userid')} aria-invalid={!!errors.userid}>
                <option value="">Choose a user</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </Field>
            <Field label="Category" error={errors.categoryid}>
              <select value={form.categoryid} onChange={set('categoryid')} aria-invalid={!!errors.categoryid}>
                <option value="">Choose a category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </>
        )}

        {apiError && <div className="alert" role="alert"><strong>{apiError}</strong></div>}
        <div className="actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add expense'}</button>
        </div>
      </form>
    </Modal>
  );
}
