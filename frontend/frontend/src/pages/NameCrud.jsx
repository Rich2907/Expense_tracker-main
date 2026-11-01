import { useState } from 'react';
import { ConfirmDelete, Empty, Field, Modal, PageHead } from '../components.jsx';

// Shared list/create/edit/delete screen for users and categories (both are { id, name }).
export default function NameCrud({ kind, title, sub, items, api, reload, notify, usedBy }) {
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [deleting, setDeleting] = useState(null);
  const label = kind[0].toUpperCase() + kind.slice(1);

  return (
    <>
      <PageHead
        title={title}
        sub={sub}
        action={<button type="button" className="btn primary" onClick={() => setEditing('new')}>Add {kind}</button>}
      />

      {items.length === 0 ? (
        <Empty title={`No ${kind === 'user' ? 'users' : 'categories'} yet`}>
          Add your first {kind} to get started.
        </Empty>
      ) : (
        <ul className="list card">
          {items.map((item) => {
            const count = usedBy(item.id);
            return (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span className="muted small">{count} {count === 1 ? 'expense' : 'expenses'}</span>
                </div>
                <div className="row-actions">
                  <button type="button" className="btn small" onClick={() => setEditing(item)} aria-label={`Edit ${item.name}`}>Edit</button>
                  <button type="button" className="btn small danger-outline" onClick={() => setDeleting(item)} aria-label={`Delete ${item.name}`}>Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <NameForm
          kind={kind}
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSubmit={async (name) => {
            if (editing === 'new') await api.create({ name });
            else await api.update(editing.id, { name });
            await reload();
            notify(editing === 'new' ? `${label} added.` : `${label} updated.`);
            setEditing(null);
          }}
        />
      )}

      {deleting && (
        <ConfirmDelete
          title={`Delete ${kind}?`}
          message={`“${deleting.name}” will be permanently deleted.`}
          hint={`The ${kind} may still be used by expenses. Remove those expenses first, then try again.`}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await api.remove(deleting.id);
            await reload();
            notify(`${label} deleted.`);
            setDeleting(null);
          }}
        />
      )}
    </>
  );
}

function NameForm({ kind, item, onSubmit, onClose }) {
  const [name, setName] = useState(item?.name ?? '');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Enter a name.'); return; }
    setError('');
    setApiError('');
    setBusy(true);
    try {
      await onSubmit(trimmed);
    } catch (err) {
      setApiError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title={item ? `Edit ${kind}` : `Add ${kind}`} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <Field label="Name" error={error}>
          <input value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!error} autoFocus autoComplete="off" />
        </Field>
        {apiError && <div className="alert" role="alert"><strong>{apiError}</strong></div>}
        <div className="actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary" disabled={busy}>{busy ? 'Saving…' : item ? 'Save changes' : `Add ${kind}`}</button>
        </div>
      </form>
    </Modal>
  );
}
