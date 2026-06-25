import { CourseModule, Student, ResourceItem, LessonSchedule, RecentTopic } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Ahmet Yılmaz', avatarInitials: 'AY' },
  { id: 's2', name: 'Ayşe Demir Çelik', avatarInitials: 'BÇ' },
  { id: 's3', name: 'Can Kaya', avatarInitials: 'CK' },
  { id: 's4', name: 'Elif Öztürk', avatarInitials: 'EÖ' }
];

export const INITIAL_SCHEDULE: LessonSchedule[] = [
  {
    id: 'sch1',
    time: '09:00',
    endTime: '10:30',
    title: 'CS101: İleri Algoritmalar',
    location: 'Amfi B - 120 Öğrenci',
    studentsCount: 120,
    borderClass: 'border-error',
    badge: 'Yoklama Bekliyor'
  },
  {
    id: 'sch2',
    time: '11:00',
    endTime: '12:30',
    title: 'Veri Yapıları Lab',
    location: 'Lab 3 - 45 Öğrenci',
    studentsCount: 45,
    borderClass: 'border-outline'
  },
  {
    id: 'sch3',
    time: '14:00',
    endTime: '15:00',
    title: 'Öğrenci Görüşmeleri',
    location: 'Ofis 402',
    studentsCount: 1,
    borderClass: 'border-dashed'
  }
];

export const INITIAL_RECENT_TOPICS: RecentTopic[] = [
  {
    id: 'rt1',
    title: 'Dinamik Programlama Notları',
    course: 'CS101',
    updatedAt: '2 saat önce güncellendi',
    icon: 'description',
    type: 'document',
    content: 'Dinamik Programlama (Dynamic Programming), karmaşık problemleri daha küçük ve birbiriyle örtüşen alt problemlere bölerek çözen bir algoritma tasarım tekniğidir. \n\nTemel Özellikleri:\n1. Alt Problemlerin Örtüşmesi (Overlapping Subproblems)\n2. Optimal Alt Yapı (Optimal Substructure)\n\nÖrnekler:\n- Fibonacci Sayıları\n- En Uzun Ortak Alt Dizi (LCS)\n- Sırt Çantası Problemi (Knapsack)'
  },
  {
    id: 'rt2',
    title: 'Vize 1 Soruları Taslağı',
    course: 'Veri Yapıları',
    updatedAt: 'Dün düzenlendi',
    icon: 'quiz',
    type: 'quiz',
    content: 'Veri Yapıları Vize 1 Taslak Sınavı:\n\nSoru 1: Bağlı Listeler (Linked Lists) ve Diziler (Arrays) arasındaki farkları bellek kullanımı ve zaman karmaşıklığı (Time Complexity) açısından açıklayınız.\n\nSoru 2: İkili Arama Ağacı (Binary Search Tree) üzerinde eleman ekleme ve silme adımlarını görselleştiriniz.\n\nSoru 3: Yığın (Stack) veri yapısını kullanarak bir ifadenin parantez dengesini kontrol eden algoritmayı yazınız.'
  },
  {
    id: 'rt3',
    title: 'Ağaç Yapıları Ders Kaydı',
    course: 'Veri Yapıları',
    updatedAt: '3 gün önce',
    icon: 'video_file',
    type: 'video',
    content: 'Ağaç (Tree) Veri Yapısı Ders Kaydı Özeti:\n\n- Ağaç terimleri: Kök (Root), Yaprak (Leaf), Çocuk (Child), Derece (Degree), Yükseklik (Height)\n- İkili Ağaçlar (Binary Trees)\n- Ağaç Dolaşma (Tree Traversal) Algoritmaları:\n  - Pre-order (Kök - Sol - Sağ)\n  - In-order (Sol - Kök - Sağ)\n  - Post-order (Sol - Sağ - Kök)'
  }
];

export const INITIAL_CURRICULUM: CourseModule[] = [
  {
    id: 'm1',
    title: 'Web Geliştirme Temelleri',
    description: 'HTML, CSS ve temel JavaScript kavramlarına giriş. Öğrenciler statik web sayfaları oluşturmayı öğrenir.',
    type: 'Zorunlu',
    icon: 'code',
    progress: 75,
    weeks: [
      {
        weekNumber: 1,
        title: 'Hafta 1: Web Geliştirmeye Giriş',
        description: 'İnternet nasıl çalışır, HTML temelleri ve editör kurulumu.',
        status: 'Tamamlandı',
        materials: [
          { id: 'mat1', title: 'Ders Notları', type: 'Ders Notu', icon: 'description' },
          { id: 'mat2', title: 'Ödev: İlk Sayfam', type: 'Ödev', icon: 'assignment' },
          { id: 'mat3', title: 'Ek Kaynaklar', type: 'Ek Kaynak', icon: 'link' }
        ]
      },
      {
        weekNumber: 2,
        title: 'Hafta 2: CSS Temelleri',
        description: 'Seçiciler, renkler, fontlar ve kutu modeli (Box Model).',
        status: 'Devam Ediyor',
        materials: [
          { id: 'mat4', title: 'CSS Sunumu', type: 'Sunum', icon: 'description' },
          { id: 'mat5', title: 'Ödev: Stil Verme', type: 'Ödev', icon: 'assignment' },
          { id: 'mat6', title: 'Kilitli Kaynak', type: 'Ek Kaynak', icon: 'lock', isLocked: true }
        ]
      },
      {
        weekNumber: 3,
        title: 'Hafta 3: Responsive Tasarım',
        description: 'Media queries ve mobil öncelikli tasarım yaklaşımları.',
        status: 'Planlandı',
        materials: [
          { id: 'mat7', title: 'Responsive Izgara Sistemi', type: 'Ders Notu', icon: 'lock', isLocked: true },
          { id: 'mat8', title: 'Ödev: Mobil Uyumlu Grid', type: 'Ödev', icon: 'lock', isLocked: true }
        ]
      }
    ]
  },
  {
    id: 'm2',
    title: 'Veritabanı Yönetim Sistemleri',
    description: 'İlişkisel veritabanları, SQL sorguları ve veri modelleme teknikleri üzerine derinlemesine çalışma.',
    type: 'Zorunlu',
    icon: 'database',
    progress: 40,
    weeks: [
      {
        weekNumber: 1,
        title: 'Hafta 1: Veritabanı Kavramları',
        description: 'Veri modelleri, ilişkisel cebir ve birincil anahtarlar (Primary Keys).',
        status: 'Tamamlandı',
        materials: [
          { id: 'mat9', title: 'SQL Giriş Notları', type: 'Ders Notu', icon: 'description' },
          { id: 'mat10', title: 'Ödev: ER Diyagramı Tasarımı', type: 'Ödev', icon: 'assignment' }
        ]
      },
      {
        weekNumber: 2,
        title: 'Hafta 2: SQL SELECT ve Filtreleme',
        description: 'Temel veri sorgulama, WHERE cümleleri, AND/OR operatörleri.',
        status: 'Devam Ediyor',
        materials: [
          { id: 'mat11', title: 'SELECT Komutları Kılavuzu', type: 'Ders Notu', icon: 'description' },
          { id: 'mat12', title: 'Ödev: Sınıf Veritabanı Sorguları', type: 'Ödev', icon: 'assignment' }
        ]
      }
    ]
  },
  {
    id: 'm3',
    title: 'Kullanıcı Arayüzü Tasarımı',
    description: 'Figma kullanımı, tasarım sistemleri ve kullanıcı deneyimi (UX) prensipleri.',
    type: 'Seçmeli',
    icon: 'brush',
    progress: 0,
    weeks: [
      {
        weekNumber: 1,
        title: 'Hafta 1: Tasarım İlkeleri',
        description: 'Görsel hiyerarşi, kontrast ve hizalama prensipleri.',
        status: 'Planlandı',
        materials: [
          { id: 'mat13', title: 'Figma Başlangıç Sunumu', type: 'Sunum', icon: 'lock', isLocked: true }
        ]
      }
    ]
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res1',
    title: 'İleri Düzey Matematik Pedagojisi',
    description: 'Karmaşık konseptleri öğrencilere anlatırken kullanılabilecek görselleştirme teknikleri.',
    category: 'Öğretim Kılavuzları',
    type: 'Video',
    durationOrPages: 'Video • 12 dk',
    fileSizeOrUrl: '2.4 MB',
    icon: 'smart_display',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY_w2ZDiCpjJZQOTAWcOIXzSUhZnpSzpdXt4bj_U6h53XCfesBtH6xzAn2eMXj2ODThdCAHJc9gnGwttGo66Etc4dW8TBhcBS-7cOQWdfm1hYo49QgGt7Q9q_ktx9FAy9eTrjZ7--AvUCBtKEWXsr3G0xjxltOPMEixgG7NTkrTFOMMDdDogih0FSdo0OLeaKlOxz2FBzSjrQldmdgspF1kDTDia2dbJebo4WRy8czOfBBTlwgVFIU2w'
  },
  {
    id: 'res2',
    title: 'Tarih Dersi Özet Tabloları',
    description: '20. Yüzyıl siyasi tarihi kronolojisi ve önemli antlaşmaların özet listesi.',
    category: 'Öğrenci Notları',
    type: 'PDF',
    durationOrPages: 'PDF • 4 Sayfa',
    fileSizeOrUrl: '1.1 MB',
    icon: 'picture_as_pdf'
  },
  {
    id: 'res3',
    title: 'Etkileşimli Periyodik Tablo',
    description: 'Elementlerin özelliklerini detaylı incelemek için Royal Society of Chemistry aracı.',
    category: 'Harici Araçlar',
    type: 'Web Sitesi',
    durationOrPages: 'Web Sitesi',
    fileSizeOrUrl: 'rsc.org',
    icon: 'link'
  },
  {
    id: 'res4',
    title: 'Bahar Dönemi Müfredat Planı',
    description: 'Haftalık ders hedefleri, okuma listeleri ve ödev teslim tarihleri şablonu.',
    category: 'Öğretim Kılavuzları',
    type: 'DOCX',
    durationOrPages: 'DOCX • 12 Sayfa',
    fileSizeOrUrl: '850 KB',
    icon: 'description'
  }
];
