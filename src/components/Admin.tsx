import React, { useState } from 'react';
import { 
  Users, 
  Trash2, 
  Plus, 
  Search, 
  Check, 
  X, 
  School as SchoolIcon, 
  BookOpen, 
  ShieldCheck, 
  Contact, 
  ArrowRightLeft, 
  GraduationCap, 
  Mail, 
  Building 
} from 'lucide-react';
import { Student, Instructor, School, CourseModule } from '../types';

interface AdminProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  courses: CourseModule[];
  setCourses: React.Dispatch<React.SetStateAction<CourseModule[]>>;
  instructors: Instructor[];
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>;
  schools: School[];
  setSchools: React.Dispatch<React.SetStateAction<School[]>>;
  currentInstructorName: string;
  setInstructorName: (name: string) => void;
}

export default function Admin({
  students,
  setStudents,
  courses,
  setCourses,
  instructors,
  setInstructors,
  schools,
  setSchools,
  currentInstructorName,
  setInstructorName
}: AdminProps) {
  const [adminTab, setAdminTab] = useState<'students' | 'instructors' | 'schools'>('students');

  // Search queries
  const [studentSearch, setStudentSearch] = useState('');
  const [instructorSearch, setInstructorSearch] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');

  // Form states - Students
  const [newStudentName, setNewStudentName] = useState('');

  // Form states - Instructors
  const [newInstName, setNewInstName] = useState('');
  const [newInstTitle, setNewInstTitle] = useState('Dr. Öğr. Üyesi');
  const [newInstEmail, setNewInstEmail] = useState('');
  const [newInstDept, setNewInstDept] = useState('');

  // Form states - Schools
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolLocation, setNewSchoolLocation] = useState('');

  // Instructor assignment modal state
  const [editingInstructorId, setEditingInstructorId] = useState<string | null>(null);

  // Notifications or toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Student Actions
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const initials = newStudentName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const newStudent: Student = {
      id: `s-${Date.now()}`,
      name: newStudentName.trim(),
      avatarInitials: initials || 'ST'
    };

    setStudents(prev => [...prev, newStudent]);
    setNewStudentName('');
    showToast(`"${newStudent.name}" başarıyla sisteme kaydedildi.`);
  };

  const handleRemoveStudent = (id: string, name: string) => {
    if (confirm(`"${name}" adlı öğrenciyi sistemden silmek istediğinize emin misiniz?`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast(`"${name}" sistemden silindi.`);
    }
  };

  // Instructor Actions
  const handleAddInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName.trim() || !newInstEmail.trim()) return;

    const newInstructor: Instructor = {
      id: `inst-${Date.now()}`,
      name: `${newInstTitle} ${newInstName.trim()}`,
      title: newInstTitle,
      department: newInstDept.trim() || 'Bilgisayar Mühendisliği',
      email: newInstEmail.trim(),
      assignedSchools: [],
      assignedCourses: []
    };

    setInstructors(prev => [...prev, newInstructor]);
    setNewInstName('');
    setNewInstEmail('');
    setNewInstDept('');
    showToast(`"${newInstructor.name}" eğitmen hesabı oluşturuldu.`);
  };

  const handleRemoveInstructor = (id: string, name: string) => {
    if (confirm(`"${name}" adlı eğitmen hesabını silmek istediğinize emin misiniz?`)) {
      setInstructors(prev => prev.filter(inst => inst.id !== id));
      showToast(`"${name}" eğitmen hesabı silindi.`);
    }
  };

  // School Actions
  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;

    const newSchool: School = {
      id: `sch-${Date.now()}`,
      name: newSchoolName.trim(),
      location: newSchoolLocation.trim() || 'Merkez Kampüs'
    };

    setSchools(prev => [...prev, newSchool]);
    setNewSchoolName('');
    setNewSchoolLocation('');
    showToast(`"${newSchool.name}" okulu sisteme eklendi.`);
  };

  const handleRemoveSchool = (id: string, name: string) => {
    if (confirm(`"${name}" adlı okulu silmek istediğinize emin misiniz? Bu işlem kayıtlı eğitmen atamalarını etkileyebilir.`)) {
      // Remove school
      setSchools(prev => prev.filter(s => s.id !== id));
      // Also clean up from instructors
      setInstructors(prev => prev.map(inst => ({
        ...inst,
        assignedSchools: inst.assignedSchools.filter(schId => schId !== id)
      })));
      showToast(`"${name}" okulu silindi ve atamalar temizlendi.`);
    }
  };

  // Toggle school assignment for current instructor being edited
  const handleToggleSchoolAssignment = (instId: string, schoolId: string) => {
    setInstructors(prev => prev.map(inst => {
      if (inst.id !== instId) return inst;
      const isAssigned = inst.assignedSchools.includes(schoolId);
      const updatedSchools = isAssigned
        ? inst.assignedSchools.filter(id => id !== schoolId)
        : [...inst.assignedSchools, schoolId];
      return { ...inst, assignedSchools: updatedSchools };
    }));
  };

  // Toggle course assignment for current instructor being edited
  const handleToggleCourseAssignment = (instId: string, courseId: string) => {
    setInstructors(prev => prev.map(inst => {
      if (inst.id !== instId) return inst;
      const isAssigned = inst.assignedCourses.includes(courseId);
      const updatedCourses = isAssigned
        ? inst.assignedCourses.filter(id => id !== courseId)
        : [...inst.assignedCourses, courseId];
      return { ...inst, assignedCourses: updatedCourses };
    }));
  };

  // Filter lists
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredInstructors = instructors.filter(inst => 
    inst.name.toLowerCase().includes(instructorSearch.toLowerCase()) ||
    inst.department.toLowerCase().includes(instructorSearch.toLowerCase()) ||
    inst.email.toLowerCase().includes(instructorSearch.toLowerCase())
  );

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.location.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const activeInstructorForEdit = instructors.find(inst => inst.id === editingInstructorId);

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-[#1E293B] text-white font-semibold text-sm px-5 py-3.5 rounded-2xl shadow-xl shadow-[#1E293B]/30 z-50 animate-fade-in flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Panel Summary Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-md shadow-[#FF7E5F]/5 flex items-center gap-4 border border-slate-100">
          <div className="w-12 h-12 bg-[#F0F4F8] text-[#1E293B] rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#5A5D6B] font-extrabold uppercase tracking-wider block">Toplam Öğrenci</span>
            <span className="text-xl font-black text-[#1A1C1E]">{students.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-md shadow-[#FF7E5F]/5 flex items-center gap-4 border border-slate-100">
          <div className="w-12 h-12 bg-[#FFF0EB] text-[#FF7E5F] rounded-2xl flex items-center justify-center">
            <Contact className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#5A5D6B] font-extrabold uppercase tracking-wider block">Kayıtlı Eğitmen</span>
            <span className="text-xl font-black text-[#1A1C1E]">{instructors.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-md shadow-[#FF7E5F]/5 flex items-center gap-4 border border-slate-100">
          <div className="w-12 h-12 bg-[#FFF9F2] text-amber-500 rounded-2xl flex items-center justify-center">
            <SchoolIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#5A5D6B] font-extrabold uppercase tracking-wider block">Tanımlı Okul</span>
            <span className="text-xl font-black text-[#1A1C1E]">{schools.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-md shadow-[#FF7E5F]/5 flex items-center gap-4 border border-slate-100">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#5A5D6B] font-extrabold uppercase tracking-wider block">Mevcut Ders</span>
            <span className="text-xl font-black text-[#1A1C1E]">{courses.length}</span>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-2.5 border-b border-[#E1E2EC]/60 pb-3">
        <button
          onClick={() => setAdminTab('students')}
          className={`px-5 py-3 rounded-full text-xs font-black transition-all uppercase tracking-wider cursor-pointer ${
            adminTab === 'students'
              ? 'bg-[#1E293B] text-white shadow-md shadow-[#1E293B]/20'
              : 'bg-white border border-[#E1E2EC] hover:bg-neutral-50 text-[#5A5D6B]'
          }`}
        >
          Öğrenci Yönetimi
        </button>

        <button
          onClick={() => setAdminTab('instructors')}
          className={`px-5 py-3 rounded-full text-xs font-black transition-all uppercase tracking-wider cursor-pointer ${
            adminTab === 'instructors'
              ? 'bg-[#1E293B] text-white shadow-md shadow-[#1E293B]/20'
              : 'bg-white border border-[#E1E2EC] hover:bg-neutral-50 text-[#5A5D6B]'
          }`}
        >
          Eğitmen & Okul Sınıf Atamaları
        </button>

        <button
          onClick={() => setAdminTab('schools')}
          className={`px-5 py-3 rounded-full text-xs font-black transition-all uppercase tracking-wider cursor-pointer ${
            adminTab === 'schools'
              ? 'bg-[#1E293B] text-white shadow-md shadow-[#1E293B]/20'
              : 'bg-white border border-[#E1E2EC] hover:bg-neutral-50 text-[#5A5D6B]'
          }`}
        >
          Okul & Kurum Ayarları
        </button>
      </div>

      {/* TAB CONTENT 1: STUDENTS */}
      {adminTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Student Form */}
          <div className="bg-white p-6 rounded-[32px] shadow-lg shadow-[#FF7E5F]/5 border border-slate-100 flex flex-col gap-4">
            <h3 className="font-black text-[#1A1C1E] text-base">Yeni Öğrenci Girişi</h3>
            <p className="text-xs font-medium text-[#5A5D6B] leading-relaxed">
              Logiacademy portali müfredat, yoklama ve ders takip sistemine dahil edilecek yeni bir öğrenci ekleyin.
            </p>

            <form onSubmit={handleAddStudent} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#5A5D6B]">Öğrenci Adı Soyadı</label>
                <input
                  type="text"
                  placeholder="Örn: Ayşe Sena Kurt"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B] font-semibold"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#FF7E5F] hover:bg-[#FF7E5F]/95 text-white py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#FF7E5F]/15 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>Öğrenciyi Sisteme Ekle</span>
              </button>
            </form>
          </div>

          {/* Right Column: Students List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-lg shadow-[#FF7E5F]/5 border border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-[#1A1C1E] text-base">Öğrenci Listesi</h3>
                <span className="text-xs font-bold text-[#5A5D6B]">Toplam {filteredStudents.length} kayıt listeleniyor</span>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#8E90A0] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Öğrenci ara..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E1E2EC] rounded-xl text-xs focus:outline-none focus:border-[#1E293B]"
                />
              </div>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFF9F2] border-b border-[#E1E2EC]/60 text-[11px] text-[#5A5D6B] uppercase tracking-wider">
                    <th className="p-4 font-extrabold">Öğrenci</th>
                    <th className="p-4 font-extrabold">Öğrenci Numarası / ID</th>
                    <th className="p-4 font-extrabold text-right">Eylemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E2EC]/55 text-sm text-[#1A1C1E]">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#FFF9F2]/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F0F4F8] text-[#1E293B] font-black text-xs flex items-center justify-center shadow-inner">
                            {student.avatarInitials}
                          </div>
                          <span className="font-bold text-[#1A1C1E]">{student.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-semibold text-[#5A5D6B]">
                        {student.id}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRemoveStudent(student.id, student.name)}
                          className="p-2 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Öğrenciyi Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-[#5A5D6B] font-semibold text-xs">
                        Aranan kriterde öğrenci kaydı bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: INSTRUCTORS & ASSIGNMENTS */}
      {adminTab === 'instructors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Add Instructor Form */}
          <div className="bg-white p-6 rounded-[32px] shadow-lg shadow-[#FF7E5F]/5 border border-slate-100 flex flex-col gap-4">
            <h3 className="font-black text-[#1A1C1E] text-base">Eğitmen Hesabı Oluştur</h3>
            <p className="text-xs font-medium text-[#5A5D6B] leading-relaxed">
              Akademi sistemine ders ataması yapılabilecek, yoklama alabilecek yetkili yeni bir eğitmen profili oluşturun.
            </p>

            <form onSubmit={handleAddInstructor} className="flex flex-col gap-3.5 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#5A5D6B]">Unvan</label>
                <select
                  value={newInstTitle}
                  onChange={(e) => setNewInstTitle(e.target.value)}
                  className="border border-[#E1E2EC] p-3 rounded-xl text-xs bg-white cursor-pointer font-bold focus:outline-none focus:border-[#1E293B]"
                >
                  <option value="Prof. Dr.">Prof. Dr.</option>
                  <option value="Doç. Dr.">Doç. Dr.</option>
                  <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
                  <option value="Arş. Gör.">Arş. Gör.</option>
                  <option value="Öğr. Gör.">Öğr. Gör.</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#5A5D6B]">Ad Soyad</label>
                <input
                  type="text"
                  placeholder="Örn: Selim Aksoy"
                  value={newInstName}
                  onChange={(e) => setNewInstName(e.target.value)}
                  className="border border-[#E1E2EC] p-3 rounded-xl text-xs bg-white focus:outline-none focus:border-[#1E293B] font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#5A5D6B]">E-posta Adresi</label>
                <input
                  type="email"
                  placeholder="orn@logiacademy.com"
                  value={newInstEmail}
                  onChange={(e) => setNewInstEmail(e.target.value)}
                  className="border border-[#E1E2EC] p-3 rounded-xl text-xs bg-white focus:outline-none focus:border-[#1E293B] font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#5A5D6B]">Anabilim Dalı / Bölüm</label>
                <input
                  type="text"
                  placeholder="Örn: Yazılım Mühendisliği"
                  value={newInstDept}
                  onChange={(e) => setNewInstDept(e.target.value)}
                  className="border border-[#E1E2EC] p-3 rounded-xl text-xs bg-white focus:outline-none focus:border-[#1E293B] font-semibold"
                />
              </div>

              <button
                type="submit"
                className="bg-[#1E293B] hover:bg-[#1E293B]/95 text-white py-3.5 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#1E293B]/15 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>Eğitmeni Oluştur</span>
              </button>
            </form>
          </div>

          {/* Right Column: Instructor List and Dynamic Atama controls */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-lg shadow-[#FF7E5F]/5 border border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-[#1A1C1E] text-base">Eğitmen Yönetimi ve Atama Paneli</h3>
                <span className="text-xs font-bold text-[#5A5D6B]">Eğitmenlere okul atama ve sınıf/ders tanımlama alanı</span>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#8E90A0] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Eğitmen veya bölüm ara..."
                  value={instructorSearch}
                  onChange={(e) => setInstructorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E1E2EC] rounded-xl text-xs focus:outline-none focus:border-[#1E293B]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {filteredInstructors.map((inst) => {
                const isSelectedForEdit = editingInstructorId === inst.id;
                const assignedSchoolsList = schools.filter(s => inst.assignedSchools.includes(s.id));
                const assignedCoursesList = courses.filter(c => inst.assignedCourses.includes(c.id));

                return (
                  <div 
                    key={inst.id}
                    className={`border rounded-2xl p-5 transition-all ${
                      isSelectedForEdit 
                        ? 'border-[#1E293B] bg-[#F0F4F8]/10 shadow-md' 
                        : 'border-[#E1E2EC]/60 bg-white hover:border-[#FF7E5F]/20 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      {/* Name & Title */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-sm text-[#1A1C1E]">{inst.name}</h4>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase">
                            {inst.id === 'inst-selim' || inst.name.includes('Selim') ? 'Aktif Portaldaki' : 'Kayıtlı'}
                          </span>
                        </div>
                        <p className="text-xs text-[#5A5D6B] font-semibold mt-1 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5" /> {inst.department}
                        </p>
                        <p className="text-xs text-[#5A5D6B] font-medium flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-[#8E90A0]" /> {inst.email}
                        </p>
                      </div>

                      {/* Action trigger & Switch active instructor simulation */}
                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                        {/* Simulation trigger */}
                        <button
                          onClick={() => {
                            setInstructorName(inst.name);
                            showToast(`Aktif eğitmen simulator paneli "${inst.name}" olarak değiştirildi.`);
                          }}
                          className="px-3 py-1.5 bg-[#FFF9F2] text-[#FF7E5F] border border-[#ffd2c5] hover:bg-[#FFF0EB] text-[11px] font-black rounded-lg transition-all"
                          title="Portalı Bu Eğitmen Olarak Görüntüle"
                        >
                          Simüle Et
                        </button>

                        <button
                          onClick={() => setEditingInstructorId(isSelectedForEdit ? null : inst.id)}
                          className="px-3.5 py-1.5 bg-[#F0F4F8] text-[#1E293B] hover:bg-[#F0F4F8]/80 text-[11px] font-black rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Atamaları Yönet</span>
                        </button>

                        <button
                          onClick={() => handleRemoveInstructor(inst.id, inst.name)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Current Assigned Details summary pill boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E1E2EC]/50 border-dashed">
                      <div>
                        <span className="text-[10px] text-[#8E90A0] font-extrabold uppercase tracking-wider block mb-1.5">Atanmış Okullar ({assignedSchoolsList.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                          {assignedSchoolsList.length > 0 ? (
                            assignedSchoolsList.map(s => (
                              <span key={s.id} className="text-[10px] font-bold bg-[#FFF9F2] border border-[#ffd2c5] text-[#FF7E5F] px-2.5 py-1 rounded-lg">
                                {s.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-[#8E90A0] italic">Atanmış okul bulunmuyor</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#8E90A0] font-extrabold uppercase tracking-wider block mb-1.5">Atanmış Dersler & Sınıflar ({assignedCoursesList.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                          {assignedCoursesList.length > 0 ? (
                            assignedCoursesList.map(c => (
                              <span key={c.id} className="text-[10px] font-bold bg-[#F0F4F8] border border-[#cbd5e1] text-[#1E293B] px-2.5 py-1 rounded-lg">
                                {c.title}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-[#8E90A0] italic">Atanmış ders bulunmuyor</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED INTERACTIVE ASSIGNMENT FORM */}
                    {isSelectedForEdit && (
                      <div className="mt-5 p-4 bg-slate-50/50 border border-[#E1E2EC]/70 rounded-2xl animate-fade-in flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-[#E1E2EC] pb-2">
                          <h5 className="font-extrabold text-xs text-[#1A1C1E]">
                            {inst.name} Atama Yönetimi
                          </h5>
                          <button 
                            onClick={() => setEditingInstructorId(null)}
                            className="text-[10px] text-slate-500 hover:text-slate-700 font-bold"
                          >
                            Kapat
                          </button>
                        </div>

                        {/* Schools sub-selection */}
                        <div>
                          <span className="text-[10px] font-bold text-[#5A5D6B] block mb-2">Kurum / Okul Seçimi (Birden fazla seçilebilir):</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {schools.map(s => {
                              const isChecked = inst.assignedSchools.includes(s.id);
                              return (
                                <label 
                                  key={s.id} 
                                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                                    isChecked 
                                      ? 'bg-[#FFF0EB] border-[#ffd2c5] font-bold text-[#FF7E5F]' 
                                      : 'bg-white border-slate-200 hover:bg-white text-slate-700'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleSchoolAssignment(inst.id, s.id)}
                                    className="rounded border-[#E1E2EC] text-[#FF7E5F] focus:ring-[#FF7E5F] w-3.5 h-3.5"
                                  />
                                  <span>{s.name}</span>
                                </label>
                              );
                            })}
                            {schools.length === 0 && (
                              <p className="text-[10px] italic text-[#8E90A0] col-span-full">Okul listesi boş. Okul ayarları sekmesinden okul tanımlayabilirsiniz.</p>
                            )}
                          </div>
                        </div>

                        {/* Courses sub-selection */}
                        <div>
                          <span className="text-[10px] font-bold text-[#5A5D6B] block mb-2">Sınıf / Ders Ataması (Birden fazla seçilebilir):</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {courses.map(c => {
                              const isChecked = inst.assignedCourses.includes(c.id);
                              return (
                                <label 
                                  key={c.id} 
                                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                                    isChecked 
                                      ? 'bg-[#F0F4F8] border-indigo-200 font-bold text-[#1E293B]' 
                                      : 'bg-white border-slate-200 hover:bg-white text-slate-700'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleCourseAssignment(inst.id, c.id)}
                                    className="rounded border-[#E1E2EC] text-[#1E293B] focus:ring-[#1E293B] w-3.5 h-3.5"
                                  />
                                  <span>{c.title}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SCHOOL & INSTITUTIONS SETUP */}
      {adminTab === 'schools' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Create School Form */}
          <div className="bg-white p-6 rounded-[32px] shadow-lg shadow-[#FF7E5F]/5 border border-slate-100 flex flex-col gap-4">
            <h3 className="font-black text-[#1A1C1E] text-base">Okul / Kurum Ekle</h3>
            <p className="text-xs font-medium text-[#5A5D6B] leading-relaxed">
              Eğitmenlerin atamasının yapılabileceği yeni okul, enstitü veya şube kurumlarını sisteme tanımlayın.
            </p>

            <form onSubmit={handleAddSchool} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#5A5D6B]">Okul / Kurum Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Boğaziçi Üniversitesi"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B] font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#5A5D6B]">Lokasyon / Kampüs</label>
                <input
                  type="text"
                  placeholder="Örn: Bebek Kampüsü"
                  value={newSchoolLocation}
                  onChange={(e) => setNewSchoolLocation(e.target.value)}
                  className="border border-[#E1E2EC] p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B] font-semibold"
                />
              </div>

              <button
                type="submit"
                className="bg-[#FF7E5F] hover:bg-[#FF7E5F]/95 text-white py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#FF7E5F]/15 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>Kurumu Sisteme Ekle</span>
              </button>
            </form>
          </div>

          {/* Right Column: Institutions list */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-lg shadow-[#FF7E5F]/5 border border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-[#1A1C1E] text-base">Sistemdeki Tanımlı Okullar</h3>
                <span className="text-xs font-bold text-[#5A5D6B]">Toplam {schools.length} okul/enstitü tanımlı</span>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#8E90A0] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Okul veya lokasyon ara..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E1E2EC] rounded-xl text-xs focus:outline-none focus:border-[#1E293B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {filteredSchools.map((school) => {
                // Find instructors assigned to this school
                const linkedInstructors = instructors.filter(inst => inst.assignedSchools.includes(school.id));

                return (
                  <div key={school.id} className="border border-[#E1E2EC]/60 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-[#FFF9F2] text-amber-500 rounded-xl flex items-center justify-center shadow-inner">
                            <SchoolIcon className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-sm text-[#1A1C1E]">{school.name}</h4>
                        </div>
                        <button
                          onClick={() => handleRemoveSchool(school.id, school.name)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                          title="Okulu Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-[#5A5D6B] font-semibold mt-3 pl-1">
                        📍 {school.location}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E1E2EC]/50 flex items-center justify-between text-xs font-bold text-[#8E90A0]">
                      <span>Aktif Atanmış Eğitmenler</span>
                      <span className="text-[#1E293B] bg-[#F0F4F8] px-2 py-0.5 rounded-full text-[10px]">
                        {linkedInstructors.length} Eğitmen
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredSchools.length === 0 && (
                <div className="col-span-full text-center py-8 text-[#5A5D6B] font-semibold text-xs border border-dashed border-[#E1E2EC] rounded-2xl">
                  Aranan kriterde okul kaydı bulunamadı.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
