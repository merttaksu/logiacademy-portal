import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  MapPin, 
  Users, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  HelpCircle, 
  Video, 
  UserCheck, 
  Award, 
  BookOpen, 
  Plus,
  ArrowRight,
  BookMarked
} from 'lucide-react';
import { LessonSchedule, RecentTopic, CourseModule } from '../types';

interface DashboardProps {
  instructorName: string;
  schedule: LessonSchedule[];
  recentTopics: RecentTopic[];
  courses: CourseModule[];
  setActiveTab: (tab: string) => void;
  onTakeAttendance: (lessonTitle: string) => void;
  onNewTopic: () => void;
}

export default function Dashboard({ 
  instructorName, 
  schedule, 
  recentTopics, 
  courses,
  setActiveTab,
  onTakeAttendance,
  onNewTopic
}: DashboardProps) {
  const [selectedTopic, setSelectedTopic] = useState<RecentTopic | null>(null);

  // Calculate quick stats
  const totalStudents = courses.reduce((acc, course) => acc + (course.type === 'Zorunlu' ? 45 : 30), 0);
  const activeCoursesCount = courses.length;
  const completedProgressAvg = Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / activeCoursesCount);

  return (
    <div className="flex flex-col lg:flex-row gap-stack-lg min-h-full">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-stack-md">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] text-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-[#FF7E5F]/20">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mb-16"></div>
          <div className="absolute left-1/3 top-0 w-48 h-48 bg-[#1E293B]/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-stack-md">
            <div>
              <span className="font-bold text-xs bg-white/20 px-3 py-1.5 rounded-full text-white tracking-wider uppercase">Bugün • 25 Haziran 2026</span>
              <h2 className="font-headline-sm text-2xl md:text-3xl font-black tracking-tight mt-3 text-white">Hoş Geldiniz, {instructorName}</h2>
              <p className="font-body-md text-sm md:text-base text-white/95 mt-2.5 max-w-xl leading-relaxed">
                Logiacademy Öğretim Portalında bugün 3 planlanmış dersiniz bulunmaktadır. İlk dersiniz 15 dakika içinde başlayacaktır.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('curriculum')}
              className="bg-white hover:bg-[#FFF5EC] text-[#FF7E5F] px-6 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap self-stretch lg:self-auto justify-center"
            >
              <span>Müfredatı Düzenle</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-stack-sm">
          {/* Stat 1 */}
          <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#F0F4F8] text-[#1E293B] flex items-center justify-center shadow-inner">
              <BookMarked className="w-7 h-7" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#5A5D6B] block">Aktif Sınıflar</span>
              <span className="text-xl font-black text-[#1A1C1E] mt-0.5 block">{activeCoursesCount} Sınıf</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] text-[#FF7E5F] flex items-center justify-center shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#5A5D6B] block">Toplam Öğrenci</span>
              <span className="text-xl font-black text-[#1A1C1E] mt-0.5 block">{totalStudents}</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#5A5D6B] block">Müfredat Tamamlama</span>
              <span className="text-xl font-black text-[#1A1C1E] mt-0.5 block">%{completedProgressAvg}</span>
            </div>
          </div>
        </div>

        {/* Schedule & Recent Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {/* Schedule */}
          <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#1A1C1E]">Program Akışı</h3>
              <span className="text-xs font-bold text-[#FF7E5F] bg-[#FFF0EB] px-3 py-1 rounded-full">25 Haziran, Perşembe</span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {schedule.map((item) => (
                <div 
                  key={item.id} 
                  className={`border-l-4 ${
                    item.borderClass === 'border-error' 
                      ? 'border-[#FF7E5F] bg-[#FFF5EC]' 
                      : item.borderClass === 'border-dashed'
                        ? 'border-dashed border-[#E1E2EC] bg-[#FFF9F2]/50'
                        : 'border-[#1E293B] bg-[#F0F4F8]/40'
                  } rounded-r-2xl p-5 flex flex-col gap-2.5 transition-all hover:shadow-md`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-[#1A1C1E] font-bold text-base">
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-[#FF7E5F] text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#5A5D6B] font-medium text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#8E90A0]" />
                      {item.time} - {item.endTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#8E90A0]" />
                      {item.location}
                    </span>
                  </div>

                  {item.badge === 'Yoklama Bekliyor' && (
                    <button 
                      onClick={() => onTakeAttendance(item.title)}
                      className="mt-1 self-start text-xs font-bold text-[#FF7E5F] bg-[#FFF0EB] hover:bg-[#FF7E5F] hover:text-white px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Yoklama Almaya Başla</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Topics / Docs */}
          <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#1A1C1E]">Son Konular ve Dokümanlar</h3>
              <button 
                onClick={onNewTopic}
                className="text-[#1E293B] hover:text-[#1E293B]/80 font-bold text-sm flex items-center gap-1 cursor-pointer bg-[#F0F4F8] px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>Yeni</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {recentTopics.map((topic) => {
                const getIcon = (topicType: string) => {
                  switch (topicType) {
                    case 'quiz': return <HelpCircle className="w-5 h-5 text-[#FF7E5F]" />;
                    case 'video': return <Video className="w-5 h-5 text-[#1E293B]" />;
                    default: return <FileText className="w-5 h-5 text-indigo-500" />;
                  }
                };

                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className="w-full text-left p-4 rounded-2xl hover:bg-[#FFF9F2]/50 transition-all border border-[#E1E2EC]/50 hover:border-[#FF7E5F]/50 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-white transition-colors shadow-sm">
                        {getIcon(topic.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1A1C1E] group-hover:text-[#1E293B] transition-colors">
                          {topic.title}
                        </h4>
                        <span className="text-xs font-semibold text-[#5A5D6B] mt-0.5 block">
                          {topic.course} • {topic.updatedAt}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#8E90A0] group-hover:text-[#1E293B] group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Document Drawer Panel */}
      {selectedTopic && (
        <div className="w-full lg:w-[360px] bg-white shadow-xl shadow-[#FF7E5F]/5 rounded-[32px] p-6 flex flex-col gap-stack-sm relative border border-[#E1E2EC]/30">
          <div className="flex items-center justify-between pb-4 border-b border-[#E1E2EC]">
            <div>
              <span className="bg-[#F0F4F8] text-[#1E293B] text-[10px] px-3 py-1.5 rounded-full font-extrabold uppercase tracking-wider">
                {selectedTopic.course}
              </span>
              <p className="text-xs font-bold text-[#5A5D6B] mt-2.5">{selectedTopic.updatedAt}</p>
            </div>
            <button 
              onClick={() => setSelectedTopic(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 text-[#8E90A0] hover:text-[#1A1C1E] transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mt-4">
            <h3 className="text-base font-black text-[#1A1C1E] mb-3 leading-snug">{selectedTopic.title}</h3>
            <div className="bg-[#FFF9F2]/60 p-4 rounded-2xl border border-[#ffd2c5]/40 font-mono text-xs text-[#5A5D6B] whitespace-pre-wrap leading-relaxed">
              {selectedTopic.content || "Doküman içeriği bulunmamaktadır."}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E1E2EC] flex gap-2">
            <button 
              onClick={() => alert('Dosya indirme işlemi başlatıldı.')}
              className="flex-1 bg-[#1E293B] text-white py-3 px-4 rounded-xl text-xs font-bold text-center hover:bg-[#1E293B]/90 shadow-md shadow-[#1E293B]/20 transition-all cursor-pointer"
            >
              Dosyayı İndir
            </button>
            <button 
              onClick={() => alert('Düzenleme modu yakında aktif edilecektir.')}
              className="border border-[#E1E2EC] hover:bg-neutral-50 py-3 px-4 rounded-xl text-xs font-bold text-[#1A1C1E] transition-all cursor-pointer"
            >
              Düzenle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
