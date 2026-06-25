import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Plus, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  FolderOpen, 
  Settings as SettingsIcon, 
  LogOut,
  MapPin,
  Clock,
  Users,
  FileText,
  ShieldCheck
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Curriculum from './components/Curriculum';
import Attendance from './components/Attendance';
import Resources from './components/Resources';
import Settings from './components/Settings';
import Admin from './components/Admin';

import { useFirebase } from './components/FirebaseProvider';

import { CourseModule, Student, LessonSchedule, RecentTopic, ResourceItem, Instructor, School } from './types';

export default function App() {
  const {
    user,
    authLoading,
    students,
    courses,
    schedule,
    recentTopics,
    resources,
    instructors,
    schools,
    instructorName,
    setInstructorProfile,
    addStudent,
    updateStudent,
    deleteStudent,
    addCourse,
    updateCourse,
    deleteCourse,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addTopic,
    deleteTopic,
    addResource,
    deleteResource,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    addSchool,
    updateSchool,
    deleteSchool,
    signIn,
    signOut
  } = useFirebase();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core mutable state adapters to preserve same component props
  const setStudents = async (action: React.SetStateAction<Student[]>) => {
    const nextVal = typeof action === 'function' ? (action as any)(students) : action;
    const currentMap = new Map<string, Student>(students.map(s => [s.id, s]));
    const nextMap = new Map<string, Student>((nextVal as Student[]).map(s => [s.id, s]));
    for (const [id, s] of nextMap.entries()) {
      const current = currentMap.get(id);
      if (!current || JSON.stringify(current) !== JSON.stringify(s)) {
        await addStudent(s);
      }
    }
    for (const id of currentMap.keys()) {
      if (!nextMap.has(id)) {
        await deleteStudent(id);
      }
    }
  };

  const setCourses = async (action: React.SetStateAction<CourseModule[]>) => {
    const nextVal = typeof action === 'function' ? (action as any)(courses) : action;
    const currentMap = new Map<string, CourseModule>(courses.map(c => [c.id, c]));
    const nextMap = new Map<string, CourseModule>((nextVal as CourseModule[]).map(c => [c.id, c]));
    for (const [id, c] of nextMap.entries()) {
      const current = currentMap.get(id);
      if (!current || JSON.stringify(current) !== JSON.stringify(c)) {
        await addCourse(c);
      }
    }
    for (const id of currentMap.keys()) {
      if (!nextMap.has(id)) {
        await deleteCourse(id);
      }
    }
  };

  const setSchedule = async (action: React.SetStateAction<LessonSchedule[]>) => {
    const nextVal = typeof action === 'function' ? (action as any)(schedule) : action;
    const currentMap = new Map<string, LessonSchedule>(schedule.map(l => [l.id, l]));
    const nextMap = new Map<string, LessonSchedule>((nextVal as LessonSchedule[]).map(l => [l.id, l]));
    for (const [id, l] of nextMap.entries()) {
      const current = currentMap.get(id);
      if (!current || JSON.stringify(current) !== JSON.stringify(l)) {
        await addSchedule(l);
      }
    }
    for (const id of currentMap.keys()) {
      if (!nextMap.has(id)) {
        await deleteSchedule(id);
      }
    }
  };

  const setResources = async (action: React.SetStateAction<ResourceItem[]>) => {
    const nextVal = typeof action === 'function' ? (action as any)(resources) : action;
    const currentMap = new Map<string, ResourceItem>(resources.map(r => [r.id, r]));
    const nextMap = new Map<string, ResourceItem>((nextVal as ResourceItem[]).map(r => [r.id, r]));
    for (const [id, r] of nextMap.entries()) {
      const current = currentMap.get(id);
      if (!current || JSON.stringify(current) !== JSON.stringify(r)) {
        await addResource(r);
      }
    }
    for (const id of currentMap.keys()) {
      if (!nextMap.has(id)) {
        await deleteResource(id);
      }
    }
  };

  const setInstructors = async (action: React.SetStateAction<Instructor[]>) => {
    const nextVal = typeof action === 'function' ? (action as any)(instructors) : action;
    const currentMap = new Map<string, Instructor>(instructors.map(i => [i.id, i]));
    const nextMap = new Map<string, Instructor>((nextVal as Instructor[]).map(i => [i.id, i]));
    for (const [id, i] of nextMap.entries()) {
      const current = currentMap.get(id);
      if (!current || JSON.stringify(current) !== JSON.stringify(i)) {
        await addInstructor(i);
      }
    }
    for (const id of currentMap.keys()) {
      if (!nextMap.has(id)) {
        await deleteInstructor(id);
      }
    }
  };

  const setSchools = async (action: React.SetStateAction<School[]>) => {
    const nextVal = typeof action === 'function' ? (action as any)(schools) : action;
    const currentMap = new Map<string, School>(schools.map(s => [s.id, s]));
    const nextMap = new Map<string, School>((nextVal as School[]).map(s => [s.id, s]));
    for (const [id, s] of nextMap.entries()) {
      const current = currentMap.get(id);
      if (!current || JSON.stringify(current) !== JSON.stringify(s)) {
        await addSchool(s);
      }
    }
    for (const id of currentMap.keys()) {
      if (!nextMap.has(id)) {
        await deleteSchool(id);
      }
    }
  };

  const setInstructorName = async (name: string) => {
    const match = name.match(/^(Doç\.\s*Dr\.|Prof\.\s*Dr\.|Dr\.\s*Öğr\.\s*Üyesi|Arş\.\s*Gör\.)\s*(.*)$/i);
    const title = match ? match[1] : 'Doç. Dr.';
    const cleanName = match ? match[2] : name;
    await setInstructorProfile(cleanName, title, 'Bilgisayar Mühendisliği');
  };

  // Attendance target state (updates when clicked from dashboard)
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');

  // Set default selected lesson when schedule is loaded
  React.useEffect(() => {
    if (schedule.length > 0 && !selectedLessonTitle) {
      setSelectedLessonTitle(schedule[0].title);
    }
  }, [schedule, selectedLessonTitle]);

  // Modal display states
  const [showNewLessonModal, setShowNewLessonModal] = useState(false);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);

  // States for New Lesson Form
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonTime, setLessonTime] = useState('09:00');
  const [lessonEndTime, setLessonEndTime] = useState('10:30');
  const [lessonLocation, setLessonLocation] = useState('Amfi A');
  const [lessonStudentsCount, setLessonStudentsCount] = useState(60);

  // States for New Topic Form
  const [topicTitle, setTopicTitle] = useState('');
  const [topicCourse, setTopicCourse] = useState('CS101');
  const [topicContent, setTopicContent] = useState('');
  const [topicType, setTopicType] = useState<'document' | 'quiz' | 'video'>('document');

  // Logo URL
  const logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBaMb1xBTS3ho_FhNTEx6ruIjFHBKHYJ-CD2HNTl2kbM8AeEkpoBSjD9nNaeqfM4fr5WrOF8v1y2CBp5EmGJuEK8gE6JprN_fYf3yBO7v5UzT3MeCT03VoI22BOpUAz0G-lzhcsVoMvWYOt-gYWKYIUOAWsUS2IMp195Z1wk9_MenVJwUPts15tcgljpKOC5WZKA6L73BY0wlNkfs5MbdimBXmt5I3FBH-Wm_8JGoIWr2-Zoc41wZnzMGKukoLf2MYQYcA";

  // Actions
  const handleTakeAttendance = (title: string) => {
    setSelectedLessonTitle(title);
    setActiveTab('attendance');
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    const newLesson: LessonSchedule = {
      id: `sch-${Date.now()}`,
      title: lessonTitle,
      time: lessonTime,
      endTime: lessonEndTime,
      location: `${lessonLocation} - ${lessonStudentsCount} Öğrenci`,
      studentsCount: Number(lessonStudentsCount),
      borderClass: 'border-secondary',
      badge: undefined
    };

    setSchedule(prev => [...prev, newLesson].sort((a, b) => a.time.localeCompare(b.time)));
    
    // Reset Form
    setLessonTitle('');
    setLessonTime('09:00');
    setLessonEndTime('10:30');
    setLessonLocation('Amfi A');
    setLessonStudentsCount(60);
    setShowNewLessonModal(false);
    alert('Yeni ders program akışına eklendi!');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;

    const newTopic: RecentTopic = {
      id: `topic-${Date.now()}`,
      title: topicTitle,
      course: topicCourse,
      updatedAt: 'Az önce eklendi',
      icon: topicType === 'quiz' ? 'quiz' : topicType === 'video' ? 'video_file' : 'description',
      type: topicType,
      content: topicContent || 'Doküman detayları girilmedi.'
    };

    addTopic(newTopic);
    
    // Reset Form
    setTopicTitle('');
    setTopicContent('');
    setTopicType('document');
    setShowNewTopicModal(false);
    alert('Yeni doküman başarıyla panoya eklendi!');
  };

  // Render correct content tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            instructorName={instructorName}
            schedule={schedule}
            recentTopics={recentTopics}
            courses={courses}
            setActiveTab={setActiveTab}
            onTakeAttendance={handleTakeAttendance}
            onNewTopic={() => setShowNewTopicModal(true)}
          />
        );
      case 'curriculum':
        return (
          <Curriculum 
            courses={courses}
            setCourses={setCourses}
          />
        );
      case 'attendance':
        return (
          <Attendance 
            students={students}
            setStudents={setStudents}
            schedule={schedule}
            setSchedule={setSchedule}
            selectedLessonTitle={selectedLessonTitle}
            setSelectedLessonTitle={setSelectedLessonTitle}
          />
        );
      case 'resources':
        return (
          <Resources 
            resources={resources}
            setResources={setResources}
          />
        );
      case 'settings':
        return (
          <Settings 
            instructorName={instructorName}
            setInstructorName={setInstructorName}
          />
        );
      case 'admin':
        return (
          <Admin 
            students={students}
            setStudents={setStudents}
            courses={courses}
            setCourses={setCourses}
            instructors={instructors}
            setInstructors={setInstructors}
            schools={schools}
            setSchools={setSchools}
            currentInstructorName={instructorName}
            setInstructorName={setInstructorName}
          />
        );
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Genel Bakış';
      case 'curriculum': return 'Müfredat Planlama';
      case 'attendance': return 'Yoklama Takip';
      case 'resources': return 'Kaynak Kütüphanesi';
      case 'settings': return 'Eğitmen Ayarları';
      case 'admin': return 'Admin Kontrol Paneli';
      default: return 'Logiacademy';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9ff]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF7E5F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-neutral-500">Sistem Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E293B] p-4">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 border border-neutral-200/50 flex flex-col items-center gap-6 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl overflow-hidden bg-[#1E293B]/5 p-2 flex items-center justify-center">
            <img src={logoUrl} alt="Logiacademy Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Logiacademy</h2>
            <p className="text-xs font-bold text-[#FF7E5F] mt-1">Eğitmen Portalı</p>
          </div>
          <p className="text-xs text-neutral-500 text-center leading-relaxed">
            Müfredat planlama, yoklama takip, okul ve eğitmen atama özelliklerine güvenli bir şekilde erişmek için giriş yapın.
          </p>
          <button
            onClick={() => signIn()}
            className="w-full bg-[#1E293B] hover:bg-[#1E293B]/90 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-black/10 text-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.55-4.455 10.55-10.74 0-.725-.08-1.28-.175-1.83H12.24z"/>
            </svg>
            <span>Google ile Giriş Yap</span>
          </button>
          <div className="text-[10px] text-neutral-400 font-semibold mt-2">
            Güvenli altyapı &bull; Logiacademy &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8f9ff]">
      {/* Sidebar - Desktop Only */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNewLesson={() => setShowNewLessonModal(true)}
        onLogout={signOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[280px] flex flex-col min-h-screen">
        {/* Header Bar */}
        <header className="sticky top-0 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant px-stack-sm md:px-stack-lg py-4 flex items-center justify-between z-30 shadow-[0px_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 text-on-surface-variant cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Active User Badging */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-label-md text-label-md font-extrabold text-on-surface">{instructorName}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Logi Academy Eğitmeni</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20">
              {instructorName.split(' ').pop()?.[0] || 'E'}
            </div>
          </div>
        </header>

        {/* Content Body Container */}
        <main className="flex-1 p-stack-sm md:p-stack-lg">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 md:hidden flex">
          <div className="w-[280px] bg-white h-full p-stack-sm flex flex-col gap-4 relative animate-slide-right shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Mobile Header Branding */}
            <div className="flex items-center gap-2.5 p-1 mb-2 mt-2">
              <img alt="Logo" className="w-10 h-10" src={logoUrl} />
              <div>
                <h3 className="font-bold text-primary">Logiacademy</h3>
                <span className="text-[10px] text-on-surface-variant">Eğitmen Portalı</span>
              </div>
            </div>

            {/* New Lesson Mobile CTA */}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setShowNewLessonModal(true);
              }}
              className="w-full bg-primary hover:bg-primary/95 text-on-primary py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Ders Ekle</span>
            </button>

            {/* Navigation Options */}
            <nav className="flex flex-col gap-1.5 mt-2">
              <button
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-bold cursor-pointer ${
                  activeTab === 'dashboard' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'
                }`}
              >
                <Calendar className="w-5 h-5 text-outline" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab('curriculum'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-bold cursor-pointer ${
                  activeTab === 'curriculum' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'
                }`}
              >
                <BookOpen className="w-5 h-5 text-outline" />
                <span>Müfredat</span>
              </button>

              <button
                onClick={() => { setActiveTab('attendance'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-bold cursor-pointer ${
                  activeTab === 'attendance' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'
                }`}
              >
                <CheckSquare className="w-5 h-5 text-outline" />
                <span>Yoklama</span>
              </button>

              <button
                onClick={() => { setActiveTab('resources'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-bold cursor-pointer ${
                  activeTab === 'resources' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'
                }`}
              >
                <FolderOpen className="w-5 h-5 text-outline" />
                <span>Kaynaklar</span>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-bold cursor-pointer ${
                  activeTab === 'settings' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'
                }`}
              >
                <SettingsIcon className="w-5 h-5 text-outline" />
                <span>Ayarlar</span>
              </button>

              <button
                onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-bold cursor-pointer ${
                  activeTab === 'admin' ? 'bg-[#F0F4F8] text-[#1E293B]' : 'text-[#5A5D6B]'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-[#FF7E5F]" />
                <span>Admin Paneli</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* New Lesson Dialog Modal */}
      {showNewLessonModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-outline-variant flex flex-col">
            <div className="p-stack-sm border-b border-outline-variant flex justify-between items-center bg-neutral-50">
              <h3 className="font-title-md text-title-md font-bold text-on-surface">Ders Program Akışı Ekle</h3>
              <button 
                onClick={() => setShowNewLessonModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-200 text-outline hover:text-on-surface cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="p-stack-sm flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Ders Adı</label>
                <input 
                  type="text" 
                  placeholder="Örn: Bilgisayar Grafikleri" 
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="border border-outline p-2.5 rounded-lg text-sm bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Başlangıç Saati</label>
                  <input 
                    type="time" 
                    value={lessonTime}
                    onChange={(e) => setLessonTime(e.target.value)}
                    className="border border-outline p-2 rounded-lg text-xs"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Bitiş Saati</label>
                  <input 
                    type="time" 
                    value={lessonEndTime}
                    onChange={(e) => setLessonEndTime(e.target.value)}
                    className="border border-outline p-2 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Derslik / Lokasyon</label>
                  <input 
                    type="text" 
                    placeholder="Örn: Lab 2, Amfi C" 
                    value={lessonLocation}
                    onChange={(e) => setLessonLocation(e.target.value)}
                    className="border border-outline p-2 rounded-lg text-xs"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Öğrenci Sayısı</label>
                  <input 
                    type="number" 
                    value={lessonStudentsCount}
                    onChange={(e) => setLessonStudentsCount(Number(e.target.value))}
                    className="border border-outline p-2 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowNewLessonModal(false)}
                  className="border border-outline hover:bg-neutral-100 py-2.5 px-4 rounded-lg font-bold"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit" 
                  className="bg-primary text-on-primary py-2.5 px-4 rounded-lg font-bold"
                >
                  Programa Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Topic Dialog Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-outline-variant flex flex-col">
            <div className="p-stack-sm border-b border-outline-variant flex justify-between items-center bg-neutral-50">
              <h3 className="font-title-md text-title-md font-bold text-on-surface">Son Konulara Doküman Ekle</h3>
              <button 
                onClick={() => setShowNewTopicModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-200 text-outline hover:text-on-surface cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="p-stack-sm flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Konu / Doküman Başlığı</label>
                <input 
                  type="text" 
                  placeholder="Örn: Algoritmik Karmaşıklık Analizi" 
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="border border-outline p-2.5 rounded-lg text-sm bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Ders / Modül</label>
                  <select
                    value={topicCourse}
                    onChange={(e) => setTopicCourse(e.target.value)}
                    className="border border-outline p-2 rounded-lg text-xs bg-white"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.title}>{course.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Doküman Türü</label>
                  <select
                    value={topicType}
                    onChange={(e) => setTopicType(e.target.value as any)}
                    className="border border-outline p-2 rounded-lg text-xs bg-white"
                  >
                    <option value="document">Ders Notu / PDF</option>
                    <option value="quiz">Quiz / Sınav Şablonu</option>
                    <option value="video">Ders Kaydı / Video</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Doküman İçeriği / Özeti</label>
                <textarea 
                  placeholder="Öğrenciler veya kendiniz için çalışma notu ve içerik detayları yazın..." 
                  value={topicContent}
                  onChange={(e) => setTopicContent(e.target.value)}
                  rows={4}
                  className="border border-outline p-2.5 rounded-lg text-sm bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowNewTopicModal(false)}
                  className="border border-outline hover:bg-neutral-100 py-2.5 px-4 rounded-lg font-bold"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit" 
                  className="bg-primary text-on-primary py-2.5 px-4 rounded-lg font-bold"
                >
                  Pano'ya Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
