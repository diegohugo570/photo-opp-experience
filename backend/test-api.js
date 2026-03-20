fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@nex.lab', password: 'admin123' })
})
.then(r => r.json())
.then(data => console.log('Admin Login Response:', data))
.catch(console.error);

fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'promo@nex.lab', password: 'promo123' })
})
.then(r => r.json())
.then(data => console.log('Promo Login Response:', data))
.catch(console.error);
