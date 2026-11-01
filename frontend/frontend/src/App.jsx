import { useCallback, useEffect, useState } from 'react';
import { categoriesApi, expensesApi, usersApi, API_BASE_URL } from './api.js';
import { CURRENCY } from './format.js';
import Dashboard from './pages/Dashboard.jsx';
import Expenses from './pages/Expenses.jsx';
import NameCrud from './pages/NameCrud.jsx';

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'categories', label: 'Categories' },
  { id: 'users', label: 'Users' },
];

const currentRoute = () => {
  const id = window.location.hash.replace('#/', '');
  return NAV.some((n) => n.id === id) ? id : 'dashboard';
};

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [data, setData] = useState({ users: [], categories: [], expenses: [] });
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = 'success') => setToast({ message, type, key: Date.now() }), []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), toast.type === 'error' ? 7000 : 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onHash = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const reload = useCallback(async () => {
    try {
      const [users, categories, expenses] = await Promise.all([usersApi.list(), categoriesApi.list(), expensesApi.list()]);
      setData({ users, categories, expenses });
      setStatus('ready');
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
      setStatus((s) => (s === 'ready' ? 'ready' : 'error'));
      notify(`Couldn't refresh data: ${err.message}`, 'error');
    }
  }, [notify]);

  useEffect(() => { reload(); }, [reload]);

  const shared = { ...data, reload, notify };
  const pages = {
    dashboard: <Dashboard {...shared} />,
    expenses: <Expenses {...shared} />,
    categories: (
      <NameCrud
        kind="category" title="Categories" sub="Group expenses so you can see where money goes."
        items={data.categories} api={categoriesApi} reload={reload} notify={notify}
        usedBy={(id) => data.expenses.filter((e) => String(e.categoryid) === String(id)).length}
      />
    ),
    users: (
      <NameCrud
        kind="user" title="Users" sub="The people who record expenses."
        items={data.users} api={usersApi} reload={reload} notify={notify}
        usedBy={(id) => data.expenses.filter((e) => String(e.userid) === String(id)).length}
      />
    ),
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">ET</span>
          <span>Expense Tracker</span>
        </div>
        <nav aria-label="Main">
          {NAV.map((n) => (
            <a key={n.id} href={`#/${n.id}`} aria-current={route === n.id ? 'page' : undefined}>{n.label}</a>
          ))}
        </nav>
        <p className="sidebar-foot">Amounts in {CURRENCY}</p>
      </aside>

      <main className="main" id="main">
        {status === 'loading' && <p className="loading" role="status">Loading your data…</p>}
        {status === 'error' && (
          <div className="alert" role="alert">
            <strong>Couldn't load data from {API_BASE_URL}.</strong>
            <p>{loadError}</p>
            <button type="button" className="btn" onClick={() => { setStatus('loading'); reload(); }}>Try again</button>
          </div>
        )}
        {status === 'ready' && pages[route]}
      </main>

      <div className="toast-region" aria-live="polite">
        {toast && (
          <div key={toast.key} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button type="button" aria-label="Dismiss message" onClick={() => setToast(null)}>×</button>
          </div>
        )}
      </div>
    </div>
  );
}
