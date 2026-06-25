import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Save, 
  Sparkles, 
  GraduationCap, 
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface SettingsProps {
  instructorName: string;
  setInstructorName: (name: string) => void;
}

export default function Settings({ instructorName, setInstructorName }: SettingsProps) {
  const [name, setName] = useState(instructorName);
  const [title, setTitle] = useState('Doç. Dr.');
  const [department, setDepartment] = useState('Bilgisayar Mühendisliği');
  const [notifications, setNotifications] = useState({
    lessonReminder: true,
    attendanceAlert: true,
    studentMessage: false,
    curriculumUpdate: true,
  });
  const [language, setLanguage] = useState('tr');
  const [themeMode, setThemeMode] = useState('light');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setInstructorName(`${title} ${name.replace(/^(Doç\.\s*Dr\.|Prof\.\s*Dr\.|Dr\.\s*Öğr\.\s*Üyesi|Arş\.\s*Gör\.)\s*/i, '')}`);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-white shadow-xl shadow-[#FF7E5F]/5 rounded-[32px] p-6 lg:p-8 max-w-4xl border-none flex flex-col gap-6">
      <div className="pb-5 border-b border-[#E1E2EC]">
        <h2 className="text-xl md:text-2xl font-black text-[#1A1C1E]">Eğitmen Portalı Ayarları</h2>
        <p className="text-xs font-semibold text-[#5A5D6B] mt-1">Profil bilgilerinizi düzenleyin, portal ve bildirim tercihlerinizi özelleştirin.</p>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Ayarlarınız başarıyla kaydedildi ve tüm modüllere uygulandı!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Section 1: Profil Bilgileri */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 flex flex-col gap-1">
            <h4 className="font-bold text-sm text-[#1A1C1E] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#1E293B]" />
              <span>Profil Bilgileri</span>
            </h4>
            <p className="text-xs font-semibold text-[#5A5D6B] mt-1 leading-relaxed">Panellerde ve yoklama şablonlarında görünecek eğitmen unvanınız.</p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#5A5D6B]">Unvan</label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white cursor-pointer font-bold focus:outline-none focus:border-[#1E293B]"
              >
                <option value="Doç. Dr.">Doç. Dr.</option>
                <option value="Prof. Dr.">Prof. Dr.</option>
                <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
                <option value="Arş. Gör.">Arş. Gör.</option>
                <option value="Öğr. Gör.">Öğr. Gör.</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#5A5D6B]">Ad Soyad</label>
              <input
                type="text"
                value={name.replace(/^(Doç\.\s*Dr\.|Prof\.\s*Dr\.|Dr\.\s*Öğr\.\s*Üyesi|Arş\.\s*Gör\.)\s*/i, '')}
                onChange={(e) => setName(e.target.value)}
                className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B] font-bold"
                required
              />
            </div>

            <div className="col-span-full flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#5A5D6B]">Anabilim Dalı / Bölüm</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B]"
              />
            </div>
          </div>
        </div>

        <hr className="border-[#E1E2EC]/60" />

        {/* Section 2: Bildirim Tercihleri */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 flex flex-col gap-1">
            <h4 className="font-bold text-sm text-[#1A1C1E] flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#1E293B]" />
              <span>Bildirim Tercihleri</span>
            </h4>
            <p className="text-xs font-semibold text-[#5A5D6B] mt-1 leading-relaxed">Hangi durumlarda sistem uyarıları almak istediğinizi belirleyin.</p>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 border border-[#E1E2EC]/60 rounded-2xl hover:bg-neutral-50/50 transition-colors bg-[#FFF9F2]/30">
              <div>
                <h5 className="text-xs font-bold text-[#1A1C1E]">Ders Başlangıç Hatırlatmaları</h5>
                <p className="text-[11px] font-semibold text-[#5A5D6B] mt-0.5">Ders başlamadan 15 dakika önce sesli veya görsel uyarı gönder.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.lessonReminder}
                onChange={() => handleToggleNotification('lessonReminder')}
                className="w-4 h-4 text-[#1E293B] rounded border-[#E1E2EC] focus:ring-[#1E293B] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-[#E1E2EC]/60 rounded-2xl hover:bg-neutral-50/50 transition-colors bg-[#FFF9F2]/30">
              <div>
                <h5 className="text-xs font-bold text-[#1A1C1E]">Yoklama Uyarısı</h5>
                <p className="text-[11px] font-semibold text-[#5A5D6B] mt-0.5">Ders bitiminde alınmayan yoklamalar için uyarı göster.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.attendanceAlert}
                onChange={() => handleToggleNotification('attendanceAlert')}
                className="w-4 h-4 text-[#1E293B] rounded border-[#E1E2EC] focus:ring-[#1E293B] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-[#E1E2EC]/60 rounded-2xl hover:bg-neutral-50/50 transition-colors bg-[#FFF9F2]/30">
              <div>
                <h5 className="text-xs font-bold text-[#1A1C1E]">Öğrenci Teslim Bildirimleri</h5>
                <p className="text-[11px] font-semibold text-[#5A5D6B] mt-0.5">Öğrenciler ödev veya proje yüklediğinde e-posta bildirimi gönder.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.studentMessage}
                onChange={() => handleToggleNotification('studentMessage')}
                className="w-4 h-4 text-[#1E293B] rounded border-[#E1E2EC] focus:ring-[#1E293B] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <hr className="border-[#E1E2EC]/60" />

        {/* Section 3: Genel Tercihler */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 flex flex-col gap-1">
            <h4 className="font-bold text-sm text-[#1A1C1E] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#1E293B]" />
              <span>Dil ve Bölge Tercihleri</span>
            </h4>
            <p className="text-xs font-semibold text-[#5A5D6B] mt-1 leading-relaxed">Portal arayüzünde varsayılan dil ayarları.</p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#5A5D6B]">Portal Dili</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white cursor-pointer font-semibold"
              >
                <option value="tr">Türkçe (TR)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#5A5D6B]">Görünüm Teması</label>
              <select
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value)}
                className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white cursor-pointer font-semibold"
              >
                <option value="light">Aydınlık (Varsayılan)</option>
                <option value="dark">Karanlık (Yakında)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="border-t border-[#E1E2EC]/60 pt-5 flex justify-end gap-3">
          <button
            type="submit"
            className="bg-[#FF7E5F] hover:bg-[#FF7E5F]/95 text-white py-3.5 px-6 rounded-2xl text-sm font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#FF7E5F]/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[3px]" />
            <span>Ayarları Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
