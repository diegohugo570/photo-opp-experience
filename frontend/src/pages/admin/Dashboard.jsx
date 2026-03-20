import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { BarChart3, Image as ImageIcon, FileTerminal, LogOut } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('METRICS'); // METRICS, PHOTOS, LOGS
  
  const [metrics, setMetrics] = useState({ totalPhotos: 0, filteredPhotos: 0 });
  const [photos, setPhotos] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchData = async () => {
    try {
      if (activeTab === 'METRICS') {
        const { data } = await axios.get('http://localhost:5000/api/admin/metrics');
        setMetrics(data);
      } else if (activeTab === 'PHOTOS') {
        // Implement pagination here conceptually
        const { data } = await axios.get('http://localhost:5000/api/admin/photos?limit=24');
        setPhotos(data.photos);
      } else if (activeTab === 'LOGS') {
        const { data } = await axios.get('http://localhost:5000/api/admin/logs');
        setLogs(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const Sidebar = () => (
    <div className="w-64 bg-zinc-900 h-screen border-r border-zinc-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-black text-white tracking-tighter">NEX.admin</h1>
      </div>
      <nav className="flex-1 px-4 space-y-3">
        <button 
          onClick={() => setActiveTab('METRICS')}
          className={`w-full flex items-center gap-4 px-6 py-5 bg-[#5b5b5b] text-white font-bold text-xl tracking-tight shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all ${activeTab === 'METRICS' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
        >
          <BarChart3 size={24} /> Métricas
        </button>
        <button 
          onClick={() => setActiveTab('PHOTOS')}
          className={`w-full flex items-center gap-4 px-6 py-5 bg-[#5b5b5b] text-white font-bold text-xl tracking-tight shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all ${activeTab === 'PHOTOS' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
        >
          <ImageIcon size={24} /> Fotos
        </button>
        <button 
          onClick={() => setActiveTab('LOGS')}
          className={`w-full flex items-center gap-4 px-6 py-5 bg-[#5b5b5b] text-white font-bold text-xl tracking-tight shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-[#5b5b5b] transition-all ${activeTab === 'LOGS' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
        >
          <FileTerminal size={24} /> Logs do Sistema
        </button>
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 px-6 py-5 bg-red-500 text-white font-bold text-xl tracking-tight shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
        >
          <LogOut size={24} /> Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-brand-dark text-white">
      <Sidebar />
      <main className="flex-1 p-12 h-screen overflow-y-auto">
        
        {activeTab === 'METRICS' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-4xl font-black tracking-tight mb-6">Visão Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-between h-48 shadow-lg">
                <span className="text-zinc-400 font-medium text-xl mb-2">Fotos Totais</span>
                <span className="text-7xl font-black tracking-tight">{metrics.totalPhotos}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PHOTOS' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-4xl font-black tracking-tight mb-6">Galeria</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {photos.map(photo => (
                <div 
                  key={photo._id} 
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 ring-[#5b5b5b] transition-all group shadow-lg"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img src={photo.url} alt="User capture" className="w-full aspect-[9/16] object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
            {photos.length === 0 && <p className="text-zinc-500 text-center py-24 text-xl">Nenhuma foto encontrada.</p>}
          </div>
        )}

        {activeTab === 'LOGS' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-black tracking-tight">Logs do Sistema</h2>
              <button className="bg-[#5b5b5b] hover:bg-[#4a4a4a] text-white font-bold text-lg px-6 py-3 shadow-lg border-none rounded-xl transition-all">
                Exportar CSV
              </button>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-lg whitespace-nowrap">
                <thead className="bg-zinc-800/50 uppercase text-zinc-400">
                  <tr>
                    <th className="px-8 py-5">Data/Hora</th>
                    <th className="px-8 py-5">IP Mascarado</th>
                    <th className="px-8 py-5">Rota</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {logs.map(log => (
                    <tr key={log._id} className="hover:bg-zinc-800/30">
                      <td className="px-8 py-5 text-zinc-300 text-xl">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                      <td className="px-8 py-5 font-mono text-zinc-400 text-xl">{log.masked_ip}</td>
                      <td className="px-8 py-5 font-mono text-[#5b5b5b] text-xl">{log.route}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-2 rounded-md text-lg font-bold ${log.response_status < 400 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {log.response_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logs.length === 0 && <p className="text-zinc-500 text-center py-16 text-xl">Nenhum log encontrado.</p>}
            </div>
          </div>
        )}

      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-12 z-50 transition-opacity" onClick={() => setSelectedPhoto(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 flex gap-12 max-w-5xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto.url} className="h-[70vh] rounded-2xl object-contain bg-black shadow-2xl" />
            <div className="flex flex-col justify-center gap-12 border-l border-zinc-800 pl-12">
              <div>
                <h3 className="text-2xl font-black mb-4">Detalhes</h3>
                <p className="text-zinc-400 text-lg mb-2">Data: {new Date(selectedPhoto.createdAt).toLocaleString('pt-BR')}</p>
                <div className="mt-6">
                  <a href={selectedPhoto.url} target="_blank" className="text-[#5b5b5b] hover:underline text-lg font-bold">Abrir imagem original</a>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl w-max self-start shadow-xl">
                <QRCodeSVG value={selectedPhoto.url} size={220} />
              </div>
            </div>
            <button 
              className="absolute top-12 right-12 w-14 h-14 bg-[#5b5b5b] hover:bg-[#4a4a4a] rounded-full flex items-center justify-center transition-all text-white text-2xl font-black"
              onClick={() => setSelectedPhoto(null)}
            >
              <LogOut size={28} className="rotate-45" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
