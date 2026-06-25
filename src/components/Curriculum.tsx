import React, { useState } from 'react';
import { 
  Code, 
  Database, 
  Brush, 
  BookOpen, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Circle, 
  Play, 
  Plus, 
  FileText, 
  Link as LinkIcon, 
  FileCheck, 
  HelpCircle,
  Eye,
  Settings,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import { CourseModule, WeekContent, MaterialItem } from '../types';

interface CurriculumProps {
  courses: CourseModule[];
  setCourses: React.Dispatch<React.SetStateAction<CourseModule[]>>;
}

export default function Curriculum({ courses, setCourses }: CurriculumProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [expandedWeekNum, setExpandedWeekNum] = useState<number | null>(1);
  const [newWeekTitle, setNewWeekTitle] = useState('');
  const [newWeekDesc, setNewWeekDesc] = useState('');
  const [showAddWeek, setShowAddWeek] = useState(false);

  // For adding a new material
  const [selectedWeekNumForMaterial, setSelectedWeekNumForMaterial] = useState<number | null>(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<'Ders Notu' | 'Ödev' | 'Ek Kaynak' | 'Sunum' | 'Video'>('Ders Notu');

  const activeCourse = courses.find(c => c.id === selectedCourseId);

  const getCourseIcon = (iconName: string, isActive: boolean) => {
    switch (iconName) {
      case 'code': return <Code className={`w-5 h-5 ${isActive ? 'text-[#1E293B]' : 'text-slate-500'}`} />;
      case 'database': return <Database className={`w-5 h-5 ${isActive ? 'text-[#FF7E5F]' : 'text-slate-500'}`} />;
      case 'brush': return <Brush className={`w-5 h-5 ${isActive ? 'text-amber-500' : 'text-slate-500'}`} />;
      default: return <BookOpen className={`w-5 h-5 ${isActive ? 'text-[#1E293B]' : 'text-slate-500'}`} />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Tamamlandı': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Devam Ediyor': return 'bg-[#FFF0EB] text-[#FF7E5F] border-[#ffd2c5]';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const getMaterialIcon = (type: string, isLocked?: boolean) => {
    if (isLocked) return <Lock className="w-4 h-4 text-[#8E90A0]" />;
    switch (type) {
      case 'Ders Notu': return <FileText className="w-4 h-4 text-sky-500" />;
      case 'Ödev': return <FileCheck className="w-4 h-4 text-emerald-500" />;
      case 'Sunum': return <Play className="w-4 h-4 text-rose-500" />;
      case 'Video': return <Play className="w-4 h-4 text-[#1E293B]" />;
      default: return <LinkIcon className="w-4 h-4 text-amber-500" />;
    }
  };

  // Handler: Toggle week status
  const handleToggleWeekStatus = (weekNum: number) => {
    if (!selectedCourseId) return;
    
    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourseId) return course;

      const updatedWeeks = course.weeks.map(week => {
        if (week.weekNumber !== weekNum) return week;
        let nextStatus: 'Tamamlandı' | 'Devam Ediyor' | 'Planlandı' = 'Planlandı';
        if (week.status === 'Planlandı') nextStatus = 'Devam Ediyor';
        else if (week.status === 'Devam Ediyor') nextStatus = 'Tamamlandı';
        
        // When weekly content status switches to Completed, unlock materials
        const updatedMaterials = week.materials.map(mat => ({
          ...mat,
          isLocked: nextStatus === 'Tamamlandı' ? false : mat.isLocked
        }));

        return { ...week, status: nextStatus, materials: updatedMaterials };
      });

      // Re-calculate average course progress
      const completedWeeks = updatedWeeks.filter(w => w.status === 'Tamamlandı').length;
      const progress = Math.round((completedWeeks / updatedWeeks.length) * 100);

      return { ...course, weeks: updatedWeeks, progress };
    });

    setCourses(updatedCourses);
  };

  // Handler: Add a new week to course
  const handleAddWeek = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeekTitle.trim() || !selectedCourseId) return;

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourseId) return course;
      
      const nextWeekNum = course.weeks.length + 1;
      const newWeek: WeekContent = {
        weekNumber: nextWeekNum,
        title: `Hafta ${nextWeekNum}: ${newWeekTitle}`,
        description: newWeekDesc || 'Haftalık kazanım hedefleri ve detaylı müfredat içeriği.',
        status: 'Planlandı',
        materials: []
      };

      const updatedWeeks = [...course.weeks, newWeek];
      const completedWeeks = updatedWeeks.filter(w => w.status === 'Tamamlandı').length;
      const progress = Math.round((completedWeeks / updatedWeeks.length) * 100);

      return { ...course, weeks: updatedWeeks, progress };
    });

    setCourses(updatedCourses);
    setNewWeekTitle('');
    setNewWeekDesc('');
    setShowAddWeek(false);
  };

  // Handler: Add new material item to week
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim() || !selectedCourseId || selectedWeekNumForMaterial === null) return;

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourseId) return course;

      const updatedWeeks = course.weeks.map(week => {
        if (week.weekNumber !== selectedWeekNumForMaterial) return week;

        const newMat: MaterialItem = {
          id: `mat-${Date.now()}`,
          title: materialTitle,
          type: materialType,
          icon: materialType === 'Ders Notu' ? 'description' : materialType === 'Ödev' ? 'assignment' : 'link',
          isLocked: week.status === 'Planlandı'
        };

        return { ...week, materials: [...week.materials, newMat] };
      });

      return { ...course, weeks: updatedWeeks };
    });

    setCourses(updatedCourses);
    setMaterialTitle('');
    setSelectedWeekNumForMaterial(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-stack-md min-h-full">
      {/* Course Modules Sidebar inside Tab */}
      <div className="w-full lg:w-[300px] flex flex-col gap-stack-sm">
        <h3 className="font-bold text-base text-[#1A1C1E] mb-1">Eğitim Modülleri</h3>
        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {courses.map((course) => {
            const isActive = course.id === selectedCourseId;
            return (
              <button
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setExpandedWeekNum(1);
                  setShowAddWeek(false);
                  setSelectedWeekNumForMaterial(null);
                }}
                className={`flex-shrink-0 text-left p-5 rounded-3xl border transition-all cursor-pointer flex flex-col gap-3 min-w-[220px] lg:min-w-0 ${
                  isActive 
                    ? 'bg-[#F0F4F8]/60 border-[#1E293B] shadow-md shadow-[#1E293B]/10' 
                    : 'bg-white border-[#E1E2EC]/55 hover:bg-neutral-50 hover:border-[#8E90A0]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${isActive ? 'bg-[#1E293B]/10' : 'bg-neutral-100'}`}>
                    {getCourseIcon(course.icon, isActive)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1C1E] truncate max-w-[140px] lg:max-w-[170px]">
                      {course.title}
                    </h4>
                    <span className="text-xs font-semibold text-[#5A5D6B]">
                      {course.type} • {course.weeks.length} Hafta
                    </span>
                  </div>
                </div>

                {/* Micro Progress Indicator */}
                <div className="w-full mt-1">
                  <div className="flex justify-between text-[10px] text-[#5A5D6B] mb-1 font-bold">
                    <span>Müfredat İlerlemesi</span>
                    <span className="text-[#1E293B]">%{course.progress}</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${course.progress === 100 ? 'bg-emerald-500' : 'bg-[#1E293B]'}`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Course Weeks & Material Content Area */}
      <div className="flex-1 bg-white shadow-xl shadow-[#FF7E5F]/5 rounded-[32px] p-6 lg:p-8 flex flex-col gap-6">
        {activeCourse ? (
          <>
            {/* Header Description of Active Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-[#E1E2EC]">
              <div>
                <span className="bg-[#F0F4F8] text-[#1E293B] text-[10px] px-3.5 py-1.5 rounded-full font-extrabold uppercase tracking-wider">
                  {activeCourse.type} MODÜL
                </span>
                <h2 className="text-xl md:text-2xl font-black text-[#1A1C1E] mt-3">{activeCourse.title}</h2>
                <p className="text-sm font-medium text-[#5A5D6B] max-w-2xl mt-1.5 leading-relaxed">{activeCourse.description}</p>
              </div>

              <button 
                onClick={() => setShowAddWeek(!showAddWeek)}
                className="bg-[#1E293B] hover:bg-[#1E293B]/95 text-white py-3.5 px-5 rounded-2xl font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-stretch md:self-auto justify-center shadow-lg shadow-[#1E293B]/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>Haftalık Konu Ekle</span>
              </button>
            </div>

            {/* Add Week Form View */}
            {showAddWeek && (
              <form onSubmit={handleAddWeek} className="bg-[#FFF9F2] border border-[#ffd2c5]/60 rounded-2xl p-5 flex flex-col gap-4">
                <h4 className="font-bold text-sm text-[#1A1C1E]">Yeni Hafta Müfredat Girişi</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Örn: CSS Flexbox ve Layout Düzenleri" 
                    value={newWeekTitle}
                    onChange={(e) => setNewWeekTitle(e.target.value)}
                    className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B]"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Örn: Flex container özellikleri, hizalama kuralları..." 
                    value={newWeekDesc}
                    onChange={(e) => setNewWeekDesc(e.target.value)}
                    className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B]"
                  />
                </div>
                <div className="flex justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setShowAddWeek(false)} 
                    className="border border-[#E1E2EC] hover:bg-neutral-100 py-2.5 px-4 rounded-xl font-bold transition-all"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#FF7E5F] text-white py-2.5 px-5 rounded-xl font-bold shadow-md shadow-[#FF7E5F]/20 transition-all"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* List of Weeks */}
            <div className="flex flex-col gap-4">
              {activeCourse.weeks.map((week) => {
                const isExpanded = expandedWeekNum === week.weekNumber;
                return (
                  <div 
                    key={week.weekNumber} 
                    className={`border rounded-2xl transition-all ${
                      isExpanded 
                        ? 'border-[#1E293B] bg-[#F0F4F8]/20' 
                        : 'border-[#E1E2EC]/60 bg-white hover:border-[#FF7E5F]/30 shadow-sm'
                    }`}
                  >
                    {/* Week Accordion Header */}
                    <div 
                      className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer select-none"
                      onClick={() => setExpandedWeekNum(isExpanded ? null : week.weekNumber)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#1A1C1E]">
                            {week.title}
                          </h4>
                          <span className={`text-[10px] font-extrabold border rounded-full px-2.5 py-1 tracking-wider uppercase ${getStatusBadgeClass(week.status)}`}>
                            {week.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#5A5D6B] mt-1.5 leading-relaxed">{week.description}</p>
                      </div>

                      <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-dashed border-[#E1E2EC]">
                        {/* Status Toggle Interaction */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWeekStatus(week.weekNumber);
                          }}
                          className="bg-neutral-100 hover:bg-neutral-200 border border-[#E1E2EC] text-[#1A1C1E] text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                          title="Durumu Değiştir"
                        >
                          <Settings className="w-3.5 h-3.5 text-[#8E90A0]" />
                          <span>Aşama Değiştir</span>
                        </button>

                        <span className="text-xs font-bold text-[#8E90A0] hidden sm:block">
                          {week.materials.length} Kaynak
                        </span>
                      </div>
                    </div>

                    {/* Expanded Materials View */}
                    {isExpanded && (
                      <div className="p-5 border-t border-[#E1E2EC] bg-white rounded-b-2xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-xs text-[#1A1C1E]">Öğrenme Kaynakları ve Dokümanlar</h5>
                          <button 
                            onClick={() => setSelectedWeekNumForMaterial(week.weekNumber)}
                            className="text-[#1E293B] hover:text-[#1E293B]/80 font-bold text-xs flex items-center gap-1 cursor-pointer bg-[#F0F4F8] px-2.5 py-1.5 rounded-xl"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                            <span>Kaynak Ekle</span>
                          </button>
                        </div>

                        {/* Add Material Modal-Form inside week */}
                        {selectedWeekNumForMaterial === week.weekNumber && (
                          <form onSubmit={handleAddMaterial} className="bg-[#FFF9F2] border border-[#ffd2c5]/40 rounded-xl p-4 flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <input 
                                type="text" 
                                placeholder="Kaynak Başlığı (Örn: Flexbox Cheat Sheet)" 
                                value={materialTitle}
                                onChange={(e) => setMaterialTitle(e.target.value)}
                                className="border border-[#E1E2EC] p-2.5 rounded-lg text-xs bg-white focus:outline-none focus:border-[#1E293B]"
                                required
                              />
                              <select
                                value={materialType}
                                onChange={(e) => setMaterialType(e.target.value as any)}
                                className="border border-[#E1E2EC] p-2.5 rounded-lg text-xs bg-white"
                              >
                                <option value="Ders Notu">Ders Notu</option>
                                <option value="Ödev">Ödev</option>
                                <option value="Sunum">Sunum</option>
                                <option value="Video">Video</option>
                                <option value="Ek Kaynak">Ek Kaynak</option>
                              </select>
                            </div>
                            <div className="flex justify-end gap-2 text-[10px]">
                              <button 
                                type="button" 
                                onClick={() => setSelectedWeekNumForMaterial(null)} 
                                className="border border-[#E1E2EC] hover:bg-neutral-100 py-1.5 px-3 rounded-lg font-bold"
                              >
                                İptal
                              </button>
                              <button 
                                type="submit" 
                                className="bg-[#FF7E5F] text-white py-1.5 px-4 rounded-lg font-bold shadow-sm"
                              >
                                Ekle
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Materials list */}
                        {week.materials.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {week.materials.map((material) => (
                              <div 
                                key={material.id} 
                                className={`flex items-center justify-between p-4.5 rounded-2xl border transition-all ${
                                  material.isLocked 
                                    ? 'bg-neutral-50/50 border-neutral-100' 
                                    : 'bg-white border-[#E1E2EC] hover:border-[#1E293B]/40 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${material.isLocked ? 'bg-neutral-100' : 'bg-[#F0F4F8]'}`}>
                                    {getMaterialIcon(material.type, material.isLocked)}
                                  </div>
                                  <div>
                                    <h6 className={`text-xs font-bold ${material.isLocked ? 'text-[#8E90A0] line-through' : 'text-[#1A1C1E]'}`}>
                                      {material.title}
                                    </h6>
                                    <span className="text-[10px] text-[#5A5D6B] font-semibold block mt-0.5">
                                      {material.isLocked ? 'İleride Yayınlanacak' : material.type}
                                    </span>
                                  </div>
                                </div>

                                {!material.isLocked && (
                                  <button 
                                    onClick={() => alert(`${material.title} görüntüleniyor / indiriliyor...`)}
                                    className="text-[11px] font-bold text-[#1E293B] hover:underline flex items-center gap-0.5 cursor-pointer bg-[#F0F4F8] px-2 py-1 rounded-lg"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Aç</span>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 border border-dashed border-[#E1E2EC] rounded-2xl">
                            <p className="text-xs font-bold text-[#5A5D6B]">Bu hafta için henüz eklenmiş kaynak bulunmuyor.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="font-body-md text-body-md text-[#5A5D6B]">Lütfen detaylarını incelemek istediğiniz ders modülünü seçiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
