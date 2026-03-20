async function testAdmin() {
  const adminRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@nex.lab', password: 'admin123' })
  });
  
  const { token, role } = await adminRes.json();
  if (!token || role !== 'ADMIN') {
    console.error('Failed to get Admin token!');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${token}` };
  
  const metrics = await fetch('http://localhost:5000/api/admin/metrics', { headers }).then(r => r.json());
  console.log('Metrics:', metrics);
  
  const logs = await fetch('http://localhost:5000/api/admin/logs', { headers }).then(r => r.json());
  console.log('Logs array length:', logs.length);
  if (logs.length > 0) {
    console.log('Sample log:', logs[0]);
  }
}
testAdmin();
