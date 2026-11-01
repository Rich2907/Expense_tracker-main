import { Empty, PageHead } from '../components.jsx';
import { money, nameOf } from '../format.js';

export default function Dashboard({ expenses, users, categories }) {
  const total = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const average = expenses.length ? total / expenses.length : 0;
  const recent = [...expenses].sort((a, b) => b.id - a.id).slice(0, 6);

  const byCategory = new Map();
  expenses.forEach((e) => {
    const key = String(e.categoryid);
    byCategory.set(key, (byCategory.get(key) || 0) + (Number(e.amount) || 0));
  });
  const breakdown = [...byCategory.entries()]
    .map(([id, amount]) => ({ id, amount, name: nameOf(categories, id, 'Unknown category') }))
    .sort((a, b) => b.amount - a.amount);
  const max = breakdown[0]?.amount || 1;

  return (
    <>
      <PageHead title="Dashboard" sub="Totals are calculated from your recorded expenses." />

      <section className="stats" aria-label="Summary">
        <div className="stat lead"><span>Total spent</span><strong>{money(total)}</strong></div>
        <div className="stat"><span>Expenses</span><strong>{expenses.length}</strong></div>
        <div className="stat"><span>Average expense</span><strong>{money(average)}</strong></div>
        <div className="stat"><span>Users</span><strong>{users.length}</strong></div>
        <div className="stat"><span>Categories</span><strong>{categories.length}</strong></div>
      </section>

      {expenses.length === 0 ? (
        <Empty title="Nothing to summarise yet">
          Add users and categories, then record your first expense from the Expenses page.
        </Empty>
      ) : (
        <div className="two-col">
          <section className="card pad" aria-labelledby="by-cat">
            <h2 id="by-cat">Spending by category</h2>
            <ul className="bars">
              {breakdown.map((b) => (
                <li key={b.id}>
                  <div className="bar-head"><span>{b.name}</span><strong>{money(b.amount)}</strong></div>
                  <div className="bar" role="presentation"><i style={{ width: `${Math.max((b.amount / max) * 100, 2)}%` }} /></div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card pad" aria-labelledby="recent">
            <h2 id="recent">Recent expenses</h2>
            <ul className="recent">
              {recent.map((e) => (
                <li key={e.id}>
                  <div>
                    <strong>{e.description || 'No description'}</strong>
                    <span className="muted small">
                      {nameOf(categories, e.categoryid, 'Unknown category')} · {nameOf(users, e.userid, 'Unknown user')}
                    </span>
                  </div>
                  <span className="num">{money(e.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </>
  );
}
