import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import emailIcon from '../../assets/icon-email.png';
import { Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!email || !password) return;
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-200 relative overflow-hidden">
      {/* Top Logo */}
      <div className="w-full flex justify-center pt-[48px]">
        <div className="flex items-end gap-2">
          <div className="border border-black px-4 py-2 text-4xl font-black tracking-tight leading-none flex items-center h-[80px] w-[110px] justify-center">
            NEX
          </div>
          <span className="text-3xl text-black font-medium leading-none mb-2">.lab</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto px-8">
        <h1 className="text-[70px] font-black text-black text-center mb-12 tracking-tight leading-none">Login</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-red-500 bg-red-100 p-3 rounded font-medium text-sm text-center">{error}</div>}
          
          <div className="relative shadow-lg">
            <input 
              type="email" 
              required
              placeholder="Email"
              className="w-full bg-[#1e1e1e] border border-[#333] text-white px-6 py-6 text-2xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] font-medium tracking-tight"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <img
              src={emailIcon}
              alt="Email"
              className="absolute right-6 top-1/2 -translate-y-1/2 w-7 h-7 object-contain"
            />
          </div>
          
          <div className="relative shadow-lg mt-4">
            <input 
              type="password" 
              required
              placeholder="Senha"
              className="w-full bg-[#1e1e1e] border border-[#333] text-white px-6 py-6 text-2xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] font-medium tracking-tight"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-white" size={28} />
          </div>

          <div className="flex items-center justify-between text-[18px] font-medium text-zinc-500 px-2 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-zinc-500 border-2 border-zinc-400"
                checked={remember} 
                onChange={(e) => setRemember(e.target.checked)} 
              />
              <span>Lembrar</span>
            </label>
            <button type="button" className="hover:text-zinc-800 transition-colors text-[18px]">
              Esqueci minha senha
            </button>
          </div>
        </form>
      </div>

      <div className="w-full px-8 pb-16 pt-8 z-10 flex justify-center">
        <button 
          type="button"
          onClick={handleLogin}
          className="w-full max-w-xl h-[80px] bg-[#5b5b5b] hover:bg-[#4a4a4a] text-white font-bold text-3xl tracking-tight flex items-center justify-center shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
