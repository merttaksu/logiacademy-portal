import React, { useState } from 'react';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Search, 
  Save, 
  Plus, 
  ArrowLeftRight, 
  CheckCircle, 
  TrendingUp, 
  CalendarDays,
  UserPlus
} from 'lucide-react';
import { Student, AttendanceRecord, LessonSchedule } from '../types';

interface AttendanceProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  schedule: LessonSchedule[];
  setSchedule: React.Dispatch<React.SetStateAction<LessonSchedule[]>>;
  selectedLessonTitle: string;
  setSelectedLessonTitle: (title: string) => void;
}

export default function Attendance({ 
  students, 
  setStudents, 
  schedule, 
  setSchedule,
  selectedLessonTitle,
  setSelectedLessonTitle
}: AttendanceProps) {
  const [selectedDate, setSelectedDate] = useState('2026-06-25');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for attendance records: key is studentId, value is status
  const [records, setRecords] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const initial: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(s => {
      initial[s.id] = 'present'; // default to present
    });
    return initial;
  });

  // State for new student modal/form
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');

  // Dropdown options based on scheduled lessons
  const lessonOptions = schedule.map(s => s.title);

  // Stats calculation
  const totalStudents = students.length;
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const counts = { present: 0, absent: 0, late: 0 };
  Object.keys(records).forEach(key => {
    const status = records[key];
    if (status === 'present') counts.present++;
    else if (status === 'absent') counts.absent++;
    else if (status === 'late') counts.late++;
  });

  const attendanceRate = totalStudents > 0 
    ? Math.round(((counts.present + counts.late * 0.7) / totalStudents) * 100)
    : 0;

  // Handler: Set status for student
  const setStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Handler: Save Attendance
  const handleSaveAttendance = () => {
    // Find scheduled item and clear its "Yoklama Bekliyor" badge
    const updatedSchedule = schedule.map(sch => {
      if (sch.title === selectedLessonTitle) {
        return {
          ...sch,
          badge: undefined, // remove badge since attendance is complete
          borderClass: 'border-secondary' // set to green/completed style
        };
      }
      return sch;
    });

    setSchedule(updatedSchedule);
    alert(`${selectedLessonTitle} dersi için yoklama başarıyla kaydedildi!\n\nÖzet:\nKatılan: ${counts.present} Öğrenci\nGeç Gelen: ${counts.late} Öğrenci\nKatılmayan: ${counts.absent} Öğrenci`);
  };

  // Handler: Add new student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const initials = newStudentName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const newStudentId = `stud-${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name: newStudentName,
      avatarInitials: initials || 'ÖG'
    };

    setStudents(prev => [...prev, newStudent]);
    setRecords(prev => ({ ...prev, [newStudentId]: 'present' }));
    setNewStudentName('');
    setShowAddStudent(false);
  };

  return (
    <div className="flex flex-col gap-stack-md min-h-full">
      {/* Attendance Settings & Controls Bar */}
      <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Lesson Selector */}
          <div className="flex flex-col gap-1.5 min-w-[220px]">
            <label className="text-xs font-bold text-[#5A5D6B]">Ders Seçimi</label>
            <select
              value={selectedLessonTitle}
              onChange={(e) => setSelectedLessonTitle(e.target.value)}
              className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white cursor-pointer font-bold focus:outline-none focus:border-[#1E293B]"
            >
              {lessonOptions.map((title, i) => (
                <option key={i} value={title}>{title}</option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#5A5D6B]">Tarih</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white font-bold focus:outline-none focus:border-[#1E293B]"
            />
          </div>
        </div>

        {/* Search and Add Student CTA */}
        <div className="flex gap-2.5 items-end self-stretch md:self-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8E90A0] absolute left-3.5 top-4" />
            <input 
              type="text" 
              placeholder="Öğrenci ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#E1E2EC] rounded-xl text-sm focus:outline-none focus:border-[#1E293B]"
            />
          </div>

          <button 
            onClick={() => setShowAddStudent(!showAddStudent)}
            className="border border-[#E1E2EC] hover:bg-neutral-50 p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Yeni Öğrenci Ekle"
          >
            <UserPlus className="w-5 h-5 text-[#1A1C1E]" />
            <span className="hidden sm:inline">Öğrenci Ekle</span>
          </button>
        </div>
      </div>

      {/* Add Student Form */}
      {showAddStudent && (
        <form onSubmit={handleAddStudentSubmit} className="bg-[#FFF9F2] border border-[#ffd2c5]/60 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#5A5D6B]">Öğrenci Adı Soyadı</label>
            <input 
              type="text" 
              placeholder="Örn: Mehmet Caner" 
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B]"
              required
            />
          </div>
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setShowAddStudent(false)}
              className="border border-[#E1E2EC] hover:bg-neutral-100 py-3 px-5 rounded-xl font-bold text-xs"
            >
              Vazgeç
            </button>
            <button 
              type="submit" 
              className="bg-[#1E293B] text-white py-3 px-5 rounded-xl font-bold text-xs shadow-md shadow-[#1E293B]/20 transition-all active:scale-95"
            >
              Öğrenciyi Kaydet
            </button>
          </div>
        </form>
      )}

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-stack-sm">
        <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-5 flex flex-col justify-center">
          <span className="text-[11px] text-[#5A5D6B] font-bold block uppercase tracking-wider">Yoklama Yapılan</span>
          <span className="text-xl font-black text-[#1A1C1E] flex items-center gap-2 mt-1">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            {Object.keys(records).length}/{totalStudents}
          </span>
        </div>

        <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-5 flex flex-col justify-center">
          <span className="text-[11px] text-[#5A5D6B] font-bold block uppercase tracking-wider">Katılanlar (Gelen)</span>
          <span className="text-xl font-black text-emerald-600 mt-1">
            {counts.present} Öğrenci
          </span>
        </div>

        <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-5 flex flex-col justify-center">
          <span className="text-[11px] text-[#5A5D6B] font-bold block uppercase tracking-wider">Geç Gelenler</span>
          <span className="text-xl font-black text-[#FF7E5F] mt-1">
            {counts.late} Öğrenci
          </span>
        </div>

        <div className="bg-white shadow-md shadow-[#FF7E5F]/5 rounded-3xl p-5 flex flex-col justify-center">
          <span className="text-[11px] text-[#5A5D6B] font-bold block uppercase tracking-wider">Genel Katılım Oranı</span>
          <span className="text-xl font-black text-[#1E293B] flex items-center gap-1.5 mt-1">
            <TrendingUp className="w-5 h-5 text-[#1E293B]" />
            %{attendanceRate}
          </span>
        </div>
      </div>

      {/* Attendance Grid/List */}
      <div className="bg-white shadow-xl shadow-[#FF7E5F]/5 rounded-[32px] overflow-hidden border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9F2] border-b border-[#E1E2EC]/60 text-xs text-[#5A5D6B] uppercase tracking-wider">
                <th className="p-5 font-bold">Öğrenci Bilgisi</th>
                <th className="p-5 text-center font-bold">Yoklama Durumu</th>
                <th className="p-5 text-right font-bold">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E2EC]/55 text-sm text-[#1A1C1E]">
              {filteredStudents.map((student) => {
                const currentStatus = records[student.id] || 'present';
                return (
                  <tr key={student.id} className="hover:bg-[#FFF9F2]/30 transition-colors">
                    {/* Student Info */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F0F4F8] text-[#1E293B] font-black text-xs flex items-center justify-center shadow-inner">
                          {student.avatarInitials}
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1C1E]">{student.name}</p>
                          <span className="text-[11px] font-semibold text-[#8E90A0]">ID: {student.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status Display Badge */}
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        currentStatus === 'present' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : currentStatus === 'absent' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-[#FFF0EB] text-[#FF7E5F] border border-[#ffd2c5]'
                      }`}>
                        {currentStatus === 'present' ? <UserCheck className="w-3.5 h-3.5" /> : currentStatus === 'absent' ? <UserX className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {currentStatus === 'present' ? 'Katıldı' : currentStatus === 'absent' ? 'Katılmadı' : 'Geç Geldi'}
                      </span>
                    </td>

                    {/* Interactive Selection Buttons */}
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setStatus(student.id, 'present')}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            currentStatus === 'present'
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/10'
                              : 'bg-white border-[#E1E2EC] hover:bg-neutral-50 text-emerald-600'
                          }`}
                          title="Katıldı"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setStatus(student.id, 'absent')}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-600/10'
                              : 'bg-white border-[#E1E2EC] hover:bg-neutral-50 text-rose-600'
                          }`}
                          title="Katılmadı"
                        >
                          <UserX className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setStatus(student.id, 'late')}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/10'
                              : 'bg-white border-[#E1E2EC] hover:bg-neutral-50 text-amber-500'
                          }`}
                          title="Geç Geldi"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-[#5A5D6B] font-semibold text-sm">
                    Arama kriterlerinize uygun öğrenci bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Save Action */}
        <div className="bg-[#FFF9F2] border-t border-[#E1E2EC]/50 p-5 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <span className="text-xs text-[#5A5D6B] font-bold">
            Tüm kayıtlar otomatik olarak taslak olarak kaydedilmektedir.
          </span>
          <button
            onClick={handleSaveAttendance}
            className="bg-[#FF7E5F] hover:bg-[#FF7E5F]/95 text-white py-3.5 px-6 rounded-2xl text-sm font-extrabold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FF7E5F]/20 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4 stroke-[3px]" />
            <span>Yoklamayı Kilitle ve Kaydet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
