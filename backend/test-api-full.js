async function test() {
  await fetch('http://localhost:5000/api/seed/seed', { method: 'POST' }).catch(e => console.log('Seed Error', e));

  const adminRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@nex.lab', password: 'admin123' })
  });
  console.log('Admin:', await adminRes.json());
  
  const promoRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'promo@nex.lab', password: 'promo123' })
  });
  console.log('Promo:', await promoRes.json());
}
test();
