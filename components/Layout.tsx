
import React from 'react';
import { Camera, Radio, History, Settings, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-20 lg:w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col items-center py-8">
        <div className="mb-12">
          <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Radio className="text-black" size={28} />
          </div>
        </div>
        
        <nav className="flex-1 space-y-8 w-full px-4">
          <NavItem icon={<Camera size={22} />} label="Creator Space" active />
          <NavItem icon={<History size={22} />} label="Recent Work" />
          <NavItem icon={<Settings size={22} />} label="Voice Lab" />
        </nav>

        <div className="mt-auto pt-8 border-t border-zinc-800 w-full px-4 flex justify-center lg:justify-start">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <User size={20} className="text-zinc-400" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium">Producer Mode</p>
                <p className="text-xs text-zinc-500">Tier: Elite</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-20">
          <h1 className="text-xl font-brand gold-gradient tracking-tight">CELEBVOICE <span className="text-white">PRO</span></h1>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i} 
                  src={`https://picsum.photos/seed/${i + 10}/32/32`} 
                  className="w-8 h-8 rounded-full border-2 border-[#0a0a0a]" 
                  alt="user"
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500 font-medium">124 users online</span>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all ${active ? 'bg-orange-500/10 text-orange-500' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}>
    {icon}
    <span className="hidden lg:block font-medium text-sm">{label}</span>
  </button>
);

export default Layout;
