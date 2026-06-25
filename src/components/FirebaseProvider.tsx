import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType, loginWithGoogle, logoutUser } from '../firebase';
import { Student, CourseModule, LessonSchedule, RecentTopic, ResourceItem, Instructor, School } from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_SCHEDULE, 
  INITIAL_RECENT_TOPICS, 
  INITIAL_CURRICULUM, 
  INITIAL_RESOURCES 
} from '../data';

const INITIAL_SCHOOLS: School[] = [
  { id: 'sch-1', name: 'Yıldız Teknik Üniversitesi', location: 'Davutpaşa Kampüsü' },
  { id: 'sch-2', name: 'İstanbul Teknik Üniversitesi', location: 'Ayazağa Kampüsü' },
  { id: 'sch-3', name: 'Orta Doğu Teknik Üniversitesi', location: 'Ankara Kampüsü' }
];

const INITIAL_INSTRUCTORS: Instructor[] = [
  { 
    id: 'inst-selim', 
    name: 'Doç. Dr. Selim Aksoy', 
    title: 'Doç. Dr.', 
    department: 'Yazılım Mühendisliği', 
    email: 'selim.aksoy@logiacademy.com',
    assignedSchools: ['sch-1', 'sch-2'],
    assignedCourses: ['m1', 'm2']
  },
  { 
    id: 'inst-ayse', 
    name: 'Prof. Dr. Ayşe Yılmaz', 
    title: 'Prof. Dr.', 
    department: 'Görsel Tasarım Bölümü', 
    email: 'ayse.yilmaz@logiacademy.com',
    assignedSchools: ['sch-2'],
    assignedCourses: ['m3']
  },
  { 
    id: 'inst-caner', 
    name: 'Dr. Öğr. Üyesi Caner Demir', 
    title: 'Dr. Öğr. Üyesi', 
    department: 'Bilgisayar Mühendisliği', 
    email: 'caner.demir@logiacademy.com',
    assignedSchools: ['sch-3'],
    assignedCourses: ['m1']
  }
];

interface FirebaseContextType {
  user: User | null;
  authLoading: boolean;
  students: Student[];
  courses: CourseModule[];
  schedule: LessonSchedule[];
  recentTopics: RecentTopic[];
  resources: ResourceItem[];
  instructors: Instructor[];
  schools: School[];
  instructorName: string;
  setInstructorProfile: (name: string, title: string, dept: string) => Promise<void>;
  
  // Create / Update / Delete triggers
  addStudent: (s: Student) => Promise<void>;
  updateStudent: (s: Student) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  
  addCourse: (c: CourseModule) => Promise<void>;
  updateCourse: (c: CourseModule) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  
  addSchedule: (l: LessonSchedule) => Promise<void>;
  updateSchedule: (l: LessonSchedule) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  
  addTopic: (t: RecentTopic) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  
  addResource: (r: ResourceItem) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  
  addInstructor: (inst: Instructor) => Promise<void>;
  updateInstructor: (inst: Instructor) => Promise<void>;
  deleteInstructor: (id: string) => Promise<void>;
  
  addSchool: (sch: School) => Promise<void>;
  updateSchool: (sch: School) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;

  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Synced state variables
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<CourseModule[]>([]);
  const [schedule, setSchedule] = useState<LessonSchedule[]>([]);
  const [recentTopics, setRecentTopics] = useState<RecentTopic[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [instructorName, setInstructorName] = useState('Doç. Dr. Selim Aksoy');

  // Test Connection on Boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Sync Auth
  useEffect(() => {
    // Handle redirect result if page was reloaded after signInWithRedirect
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error('Redirect sign-in error:', error);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Helper to Seed Initial Data if empty
  const seedDatabaseIfEmpty = async () => {
    try {
      const studentSnap = await getDocs(collection(db, 'students'));
      if (studentSnap.empty) {
        console.log('Seeding initial data to Firestore...');
        
        // Seed Students
        for (const s of INITIAL_STUDENTS) {
          await setDoc(doc(db, 'students', s.id), s);
        }
        // Seed Courses
        for (const c of INITIAL_CURRICULUM) {
          await setDoc(doc(db, 'courses', c.id), c);
        }
        // Seed Schedule
        for (const sch of INITIAL_SCHEDULE) {
          await setDoc(doc(db, 'schedule', sch.id), sch);
        }
        // Seed Recent Topics
        for (const rt of INITIAL_RECENT_TOPICS) {
          await setDoc(doc(db, 'recentTopics', rt.id), rt);
        }
        // Seed Resources
        for (const r of INITIAL_RESOURCES) {
          await setDoc(doc(db, 'resources', r.id), r);
        }
        // Seed Instructors
        for (const inst of INITIAL_INSTRUCTORS) {
          await setDoc(doc(db, 'instructors', inst.id), inst);
        }
        // Seed Schools
        for (const sch of INITIAL_SCHOOLS) {
          await setDoc(doc(db, 'schools', sch.id), sch);
        }
        // Seed default Settings
        await setDoc(doc(db, 'settings', 'global'), {
          instructorName: 'Doç. Dr. Selim Aksoy',
          title: 'Doç. Dr.',
          department: 'Yazılım Mühendisliği'
        });
      }
    } catch (err) {
      console.error('Error seeding initial Firestore data:', err);
    }
  };

  // Sync Listeners when logged in
  useEffect(() => {
    if (!user) return;

    // Check & Seed initial data
    seedDatabaseIfEmpty();

    // Students Listener
    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
      const list: Student[] = [];
      snap.forEach(doc => list.push(doc.data() as Student));
      setStudents(list);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'students'));

    // Courses Listener
    const unsubCourses = onSnapshot(collection(db, 'courses'), (snap) => {
      const list: CourseModule[] = [];
      snap.forEach(doc => list.push(doc.data() as CourseModule));
      setCourses(list.sort((a, b) => a.title.localeCompare(b.title)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'courses'));

    // Schedule Listener
    const unsubSchedule = onSnapshot(collection(db, 'schedule'), (snap) => {
      const list: LessonSchedule[] = [];
      snap.forEach(doc => list.push(doc.data() as LessonSchedule));
      setSchedule(list.sort((a, b) => a.time.localeCompare(b.time)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'schedule'));

    // Recent Topics Listener
    const unsubTopics = onSnapshot(collection(db, 'recentTopics'), (snap) => {
      const list: RecentTopic[] = [];
      snap.forEach(doc => list.push(doc.data() as RecentTopic));
      setRecentTopics(list);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'recentTopics'));

    // Resources Listener
    const unsubResources = onSnapshot(collection(db, 'resources'), (snap) => {
      const list: ResourceItem[] = [];
      snap.forEach(doc => list.push(doc.data() as ResourceItem));
      setResources(list);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'resources'));

    // Instructors Listener
    const unsubInstructors = onSnapshot(collection(db, 'instructors'), (snap) => {
      const list: Instructor[] = [];
      snap.forEach(doc => list.push(doc.data() as Instructor));
      setInstructors(list);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'instructors'));

    // Schools Listener
    const unsubSchools = onSnapshot(collection(db, 'schools'), (snap) => {
      const list: School[] = [];
      snap.forEach(doc => list.push(doc.data() as School));
      setSchools(list);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'schools'));

    // Settings Listener
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setInstructorName(docSnap.data().instructorName || 'Doç. Dr. Selim Aksoy');
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));

    return () => {
      unsubStudents();
      unsubCourses();
      unsubSchedule();
      unsubTopics();
      unsubResources();
      unsubInstructors();
      unsubSchools();
      unsubSettings();
    };
  }, [user]);

  // DB operations
  const addStudent = async (s: Student) => {
    try {
      await setDoc(doc(db, 'students', s.id), s);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${s.id}`);
    }
  };

  const updateStudent = async (s: Student) => {
    try {
      await updateDoc(doc(db, 'students', s.id), s as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${s.id}`);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `students/${id}`);
    }
  };

  const addCourse = async (c: CourseModule) => {
    try {
      await setDoc(doc(db, 'courses', c.id), c);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `courses/${c.id}`);
    }
  };

  const updateCourse = async (c: CourseModule) => {
    try {
      await updateDoc(doc(db, 'courses', c.id), c as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `courses/${c.id}`);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'courses', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `courses/${id}`);
    }
  };

  const addSchedule = async (l: LessonSchedule) => {
    try {
      await setDoc(doc(db, 'schedule', l.id), l);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `schedule/${l.id}`);
    }
  };

  const updateSchedule = async (l: LessonSchedule) => {
    try {
      await updateDoc(doc(db, 'schedule', l.id), l as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `schedule/${l.id}`);
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schedule', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schedule/${id}`);
    }
  };

  const addTopic = async (t: RecentTopic) => {
    try {
      await setDoc(doc(db, 'recentTopics', t.id), t);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `recentTopics/${t.id}`);
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recentTopics', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `recentTopics/${id}`);
    }
  };

  const addResource = async (r: ResourceItem) => {
    try {
      await setDoc(doc(db, 'resources', r.id), r);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `resources/${r.id}`);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'resources', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `resources/${id}`);
    }
  };

  const addInstructor = async (inst: Instructor) => {
    try {
      await setDoc(doc(db, 'instructors', inst.id), inst);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `instructors/${inst.id}`);
    }
  };

  const updateInstructor = async (inst: Instructor) => {
    try {
      await updateDoc(doc(db, 'instructors', inst.id), inst as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `instructors/${inst.id}`);
    }
  };

  const deleteInstructor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'instructors', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `instructors/${id}`);
    }
  };

  const addSchool = async (sch: School) => {
    try {
      await setDoc(doc(db, 'schools', sch.id), sch);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `schools/${sch.id}`);
    }
  };

  const updateSchool = async (sch: School) => {
    try {
      await updateDoc(doc(db, 'schools', sch.id), sch as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `schools/${sch.id}`);
    }
  };

  const deleteSchool = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schools', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schools/${id}`);
    }
  };

  const setInstructorProfile = async (name: string, title: string, dept: string) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        instructorName: `${title} ${name}`,
        title,
        department: dept
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
    }
  };

  const signIn = async () => {
    await loginWithGoogle();
  };

  const signOut = async () => {
    await logoutUser();
  };

  return (
    <FirebaseContext.Provider value={{
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
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
