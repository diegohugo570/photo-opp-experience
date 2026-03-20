import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-white to-gray-200 flex flex-col relative overflow-hidden">
      {/* Top Logo */}
      <div className="w-full flex justify-center pt-[48px]">
        <div className="flex items-end gap-2">
          <div className="border border-black px-4 py-2 text-4xl font-black tracking-tight leading-none flex items-center h-[80px] w-[110px] justify-center">
            NEX
          </div>
          <span className="text-3xl text-black font-medium leading-none mb-2">.lab</span>
        </div>
      </div>

      {/* Center Title */}
      <div className="flex-1 flex flex-col items-center justify-center mb-[120px] text-black">
        <h1 className="text-[110px] font-black tracking-tight leading-[0.85] text-center">
          Photo<br />
          Opp
        </h1>
      </div>

      {/* Bottom Button */}
        <div className="w-full px-8 pb-16 relative z-10 flex justify-center">
          <button 
            onClick={() => navigate('/capture')}
            className="w-full max-w-xl h-[80px] bg-[#5b5b5b] hover:bg-[#4a4a4a] text-white font-bold text-3xl tracking-tight flex items-center justify-center shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all"
          >
            Iniciar
          </button>
        </div>
    </div>
  );
}
