async function req(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
export const getProducts = params => req('/api/products?' + new URLSearchParams(params));
export const getCategories = () => req('/api/products/categories');
export const getProduct = id => req('/api/products/' + id);
export const placeOrder = body => req('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
export const getOrder = id => req('/api/orders/' + id);
export const money = n => '₹' + Number(n).toLocaleString('en-IN');
