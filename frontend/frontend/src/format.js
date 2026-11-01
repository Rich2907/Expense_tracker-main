// Change the currency with VITE_CURRENCY (ISO 4217 code, e.g. USD, EUR, INR).
export const CURRENCY = import.meta.env.VITE_CURRENCY || 'USD';

const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: CURRENCY });

export const money = (value) => formatter.format(Number(value) || 0);

export const nameOf = (list, id, fallback) =>
  list.find((item) => String(item.id) === String(id))?.name ?? fallback;
