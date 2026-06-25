import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Plus,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewLesson: () => void;
  onLogout?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onNewLesson, onLogout }: SidebarProps) {
  const logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBaMb1xBTS3ho_FhNTEx6ruIjFHBKHYJ-CD2HNTl2kbM8AeEkpoBSjD9nNaeqfM4fr5WrOF8v1y2CBp5EmGJuEK8gE6JprN_fYf3yBO7v5UzT3MeCT03VoI22BOpUAz0G-lzhcsVoMvWYOt-gYWKYIUOAWsUS2IMp195Z1wk9_MenVJwUPts15tcgljpKOC5WZKA6L73BY0wlNkfs5MbdimBXmt5I3FBH-Wm_8JGoIWr2-Zoc41wZnzMGKukoLf2MYQYcA";

  return (
    <aside className="hidden md:flex flex-col h-screen p-stack-md gap-stack-sm bg-[#1E293B] text-white fixed left-0 top-0 w-[280px] shadow-2xl shadow-[#1E293B]/20 z-40 transition-all duration-200 ease-in-out">
      {/* Header with Custom Logo */}
      <div className="flex items-center gap-stack-sm p-stack-sm mb-stack-sm">
        <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center bg-white/10 p-1">
          <img 
            alt="Logiacademy Logo" 
            className="w-full h-full object-contain" 
            src={logoUrl} 
          />
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-black text-white tracking-tight">Logiacademy</h1>
          <p className="font-label-sm text-label-sm text-[#FEB47B] font-bold">Eğitmen Portalı</p>
        </div>
      </div>

      {/* CTA Button */}
      <button 
        onClick={onNewLesson}
        className="w-full bg-[#FF7E5F] hover:bg-[#FF7E5F]/90 text-white py-3.5 px-4 rounded-2xl font-bold shadow-lg shadow-[#FF7E5F]/30 active:scale-[0.98] transition-all mb-stack-lg flex items-center justify-center gap-2 group cursor-pointer"
      >
        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200" />
        <span>Yeni Ders Ekle</span>
      </button>

      {/* Nav Tabs */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {/* Dashboard Tab */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl transition-all text-left w-full cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-white text-[#1E293B] font-bold shadow-md shadow-[#1E293B]/10'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-[#1E293B]' : 'text-white/75'}`} />
          <span className="font-semibold text-sm">Dashboard</span>
        </button>

        {/* Curriculum Tab */}
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl transition-all text-left w-full cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-white text-[#1E293B] font-bold shadow-md shadow-[#1E293B]/10'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'curriculum' ? 'text-[#1E293B]' : 'text-white/75'}`} />
          <span className="font-semibold text-sm">Müfredat</span>
        </button>

        {/* Attendance Tab */}
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl transition-all text-left w-full cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-white text-[#1E293B] font-bold shadow-md shadow-[#1E293B]/10'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <CheckSquare className={`w-5 h-5 ${activeTab === 'attendance' ? 'text-[#1E293B]' : 'text-white/75'}`} />
          <span className="font-semibold text-sm">Yoklama</span>
        </button>

        {/* Resources Tab */}
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl transition-all text-left w-full cursor-pointer ${
            activeTab === 'resources'
              ? 'bg-white text-[#1E293B] font-bold shadow-md shadow-[#1E293B]/10'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <FolderOpen className={`w-5 h-5 ${activeTab === 'resources' ? 'text-[#1E293B]' : 'text-white/75'}`} />
          <span className="font-semibold text-sm">Kaynaklar</span>
        </button>

        {/* Admin Tab */}
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl transition-all text-left w-full cursor-pointer ${
            activeTab === 'admin'
              ? 'bg-white text-[#1E293B] font-bold shadow-md shadow-[#1E293B]/10'
              : 'text-[#FEB47B] hover:bg-white/10 hover:text-white'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'text-[#1E293B]' : 'text-[#FEB47B]'}`} />
          <span className="font-bold text-sm">Admin Paneli</span>
        </button>
      </nav>

      {/* Footer Nav */}
      <div className="mt-auto flex flex-col gap-1.5 pt-stack-md border-t border-white/10">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl transition-all text-left w-full cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white text-[#1E293B] font-bold shadow-md'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-[#1E293B]' : 'text-white/75'}`} />
          <span className="font-semibold text-sm">Ayarlar</span>
        </button>
        <button
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              alert('Çıkış yapıldı. Güvenliğiniz için tarayıcınızı kapatabilirsiniz.');
            }
          }}
          className="flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-white/80 hover:bg-red-500/20 hover:text-red-200 transition-all text-left w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-white/75" />
          <span className="font-semibold text-sm">Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}

