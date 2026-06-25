import React, { useState, useRef } from 'react';
import { 
  Search, 
  Video, 
  FileText, 
  Link as LinkIcon, 
  Download, 
  ExternalLink, 
  Plus, 
  Play, 
  BookOpen, 
  FileCode, 
  File, 
  Check, 
  UploadCloud, 
  X,
  Filter
} from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourcesProps {
  resources: ResourceItem[];
  setResources: React.Dispatch<React.SetStateAction<ResourceItem[]>>;
}

export default function Resources({ resources, setResources }: ResourcesProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Öğretim Kılavuzları' | 'Öğrenci Notları' | 'Harici Araçlar'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  
  // State for Add Resource Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Öğretim Kılavuzları' | 'Öğrenci Notları' | 'Harici Araçlar'>('Öğretim Kılavuzları');
  const [newType, setNewType] = useState<'Video' | 'PDF' | 'Web Sitesi' | 'DOCX'>('PDF');
  const [newDetail, setNewDetail] = useState(''); // duration or pages
  const [newSize, setNewSize] = useState('');
  
  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter calculations
  const filteredResources = resources.filter(res => {
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video className="w-5 h-5 text-[#1E293B]" />;
      case 'PDF': return <FileText className="w-5 h-5 text-[#FF7E5F]" />;
      case 'Web Sitesi': return <LinkIcon className="w-5 h-5 text-amber-500" />;
      default: return <File className="w-5 h-5 text-sky-500" />;
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setNewTitle(file.name.split('.').slice(0, -1).join('.'));
      setNewSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      
      const extension = file.name.split('.').pop()?.toUpperCase();
      if (extension === 'PDF') {
        setNewType('PDF');
        setNewDetail('PDF • 1 Sayfa');
      } else if (['MP4', 'MOV', 'AVI'].includes(extension || '')) {
        setNewType('Video');
        setNewDetail('Video • 5 dk');
      } else if (['DOC', 'DOCX'].includes(extension || '')) {
        setNewType('DOCX');
        setNewDetail('DOCX • 5 Sayfa');
      } else {
        setNewType('PDF');
        setNewDetail('Dosya');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setNewTitle(file.name.split('.').slice(0, -1).join('.'));
      setNewSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      
      const extension = file.name.split('.').pop()?.toUpperCase();
      if (extension === 'PDF') {
        setNewType('PDF');
        setNewDetail('PDF • 1 Sayfa');
      } else if (['MP4', 'MOV', 'AVI'].includes(extension || '')) {
        setNewType('Video');
        setNewDetail('Video • 5 dk');
      } else if (['DOC', 'DOCX'].includes(extension || '')) {
        setNewType('DOCX');
        setNewDetail('DOCX • 5 Sayfa');
      } else {
        setNewType('PDF');
        setNewDetail('Dosya');
      }
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newResItem: ResourceItem = {
      id: `res-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Eğitmen kütüphanesine yeni yüklenen yardımcı materyal.',
      category: newCategory,
      type: newType,
      durationOrPages: newDetail || (newType === 'PDF' ? 'PDF • 1 Sayfa' : newType === 'Video' ? 'Video • 10 dk' : 'Web Sitesi'),
      fileSizeOrUrl: newSize || '250 KB',
      icon: newType === 'Video' ? 'smart_display' : newType === 'PDF' ? 'picture_as_pdf' : newType === 'Web Sitesi' ? 'link' : 'description'
    };

    setResources(prev => [newResItem, ...prev]);
    resetForm();
    setShowAddModal(false);
    alert('Kaynak kütüphaneye başarıyla yüklendi!');
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDesc('');
    setNewCategory('Öğretim Kılavuzları');
    setNewType('PDF');
    setNewDetail('');
    setNewSize('');
    setUploadedFile(null);
  };

  return (
    <div className="flex flex-col gap-stack-md min-h-full">
      {/* Search and Category Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Category Pill Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Öğretim Kılavuzları', 'Öğrenci Notları', 'Harici Araçlar'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-3 rounded-full text-xs font-black transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                activeCategory === cat
                  ? 'bg-[#1E293B] text-white shadow-md shadow-[#1E293B]/25'
                  : 'bg-white border border-[#E1E2EC] hover:bg-neutral-50 text-[#5A5D6B]'
              }`}
            >
              {cat === 'All' ? 'Tüm Kaynaklar' : cat}
            </button>
          ))}
        </div>

        {/* Search & Action Input */}
        <div className="flex gap-2.5 items-center">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8E90A0] absolute left-3.5 top-4" />
            <input 
              type="text" 
              placeholder="Kaynaklarda ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#E1E2EC] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B]"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#FF7E5F] hover:bg-[#FF7E5F]/95 text-white py-3.5 px-5 rounded-2xl font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-lg shadow-[#FF7E5F]/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>Yeni Kaynak Yükle</span>
          </button>
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
        {filteredResources.map((resource) => (
          <div 
            key={resource.id} 
            className="bg-white border border-[#E1E2EC]/60 rounded-[32px] overflow-hidden flex flex-col justify-between shadow-md shadow-[#FF7E5F]/5 hover:shadow-xl hover:shadow-[#FF7E5F]/10 hover:border-[#1E293B]/30 transition-all duration-300"
          >
            {/* Visual Header / Thumbnail (Hotlink requested for İleri Düzey Matematik Pedagojisi) */}
            {resource.imageUrl ? (
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden flex items-center justify-center group">
                <img 
                  src={resource.imageUrl} 
                  alt={resource.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button 
                  onClick={() => setSelectedResource(resource)}
                  className="absolute w-12 h-12 rounded-full bg-white text-[#1E293B] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg z-10"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              </div>
            ) : (
              <div className="p-5 bg-[#FFF9F2]/55 border-b border-[#E1E2EC]/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-inner flex items-center justify-center">
                  {getResourceIcon(resource.type)}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#8E90A0] uppercase tracking-wider">{resource.type}</span>
                  <p className="font-bold text-xs text-[#5A5D6B] truncate max-w-[180px]">
                    {resource.category}
                  </p>
                </div>
              </div>
            )}

            {/* Title & Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#1A1C1E] line-clamp-1 mb-2">
                  {resource.title}
                </h4>
                <p className="text-xs font-semibold text-[#5A5D6B] line-clamp-2 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#E1E2EC]/60 text-xs">
                <span className="text-[#5A5D6B] font-bold">
                  {resource.durationOrPages} ({resource.fileSizeOrUrl})
                </span>
                
                <button
                  onClick={() => {
                    if (resource.type === 'Web Sitesi') {
                      window.open(`https://${resource.fileSizeOrUrl}`, '_blank');
                    } else {
                      setSelectedResource(resource);
                    }
                  }}
                  className="text-[#1E293B] hover:underline font-bold flex items-center gap-1 cursor-pointer bg-[#F0F4F8] px-2.5 py-1 rounded-lg"
                >
                  {resource.type === 'Web Sitesi' ? (
                    <>
                      <span>Git</span>
                      <ExternalLink className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>Detay</span>
                      <Download className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredResources.length === 0 && (
          <div className="col-span-full text-center py-12 border border-dashed border-[#E1E2EC]/60 rounded-[32px] bg-white shadow-sm">
            <p className="font-bold text-sm text-[#5A5D6B]">Aradığınız kriterlere uygun kaynak bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Resource Detail Drawer/Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border-none flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E1E2EC] flex justify-between items-center bg-[#FFF9F2]">
              <span className="bg-[#F0F4F8] text-[#1E293B] text-[10px] px-3.5 py-1.5 rounded-full font-black uppercase tracking-wider">
                {selectedResource.category}
              </span>
              <button 
                onClick={() => setSelectedResource(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-[#1A1C1E] transition-all cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-4">
              {selectedResource.imageUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden relative bg-black">
                  <img 
                    src={selectedResource.imageUrl} 
                    alt={selectedResource.title} 
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => alert('Video oynatılıyor...')}
                      className="w-14 h-14 rounded-full bg-[#1E293B] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg cursor-pointer"
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-black text-[#1A1C1E] mb-2">{selectedResource.title}</h3>
                <p className="text-xs font-semibold text-[#5A5D6B] leading-relaxed mb-4">
                  {selectedResource.description}
                </p>

                <div className="grid grid-cols-2 gap-3 bg-[#FFF9F2] p-4 rounded-2xl border border-[#ffd2c5]/40">
                  <div>
                    <span className="text-[10px] font-bold text-[#8E90A0] uppercase">Dosya Formatı / Türü</span>
                    <p className="text-xs font-bold text-[#1A1C1E] mt-0.5">{selectedResource.type}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#8E90A0] uppercase">Detaylar / Boyut</span>
                    <p className="text-xs font-bold text-[#1A1C1E] mt-0.5">{selectedResource.durationOrPages} ({selectedResource.fileSizeOrUrl})</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-5 border-t border-[#E1E2EC] bg-white flex justify-end gap-2 text-xs">
              <button 
                onClick={() => setSelectedResource(null)}
                className="border border-[#E1E2EC] hover:bg-neutral-100 py-2.5 px-4 rounded-xl font-bold"
              >
                Kapat
              </button>
              <button 
                onClick={() => {
                  alert('Kaynak başarıyla indirildi / görüntülendi.');
                  setSelectedResource(null);
                }}
                className="bg-[#FF7E5F] text-white py-2.5 px-5 rounded-xl font-bold shadow-lg shadow-[#FF7E5F]/20"
              >
                Dosyayı İndir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal (Supports Drag and Drop) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border-none flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E1E2EC] flex justify-between items-center bg-[#FFF9F2]">
              <h3 className="font-bold text-sm text-[#1A1C1E]">Yeni Eğitmen Kaynağı Ekle</h3>
              <button 
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-[#1A1C1E] transition-all cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Drag and Drop File Upload Area */}
            <div className="p-5 flex flex-col gap-4">
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  dragActive 
                    ? 'border-[#1E293B] bg-[#F0F4F8]/10' 
                    : uploadedFile 
                      ? 'border-emerald-500 bg-emerald-50/20' 
                      : 'border-[#E1E2EC] hover:border-[#1E293B]/50 bg-neutral-50/50'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" 
                  accept=".pdf,.docx,.doc,.mp4,.avi,.mkv,.png,.jpg,.jpeg"
                />
                
                {uploadedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#1A1C1E] truncate max-w-xs">{uploadedFile.name}</p>
                    <span className="text-xs text-[#5A5D6B] font-medium">({newSize})</span>
                    <button 
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="text-xs text-rose-600 font-bold hover:underline mt-1"
                    >
                      Dosyayı Kaldır
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="w-10 h-10 text-[#8E90A0]" />
                    <p className="text-sm font-bold text-[#1A1C1E]">Dosyayı buraya sürükleyip bırakın</p>
                    <p className="text-xs text-[#5A5D6B]">veya manuel olarak seçmek için</p>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#F0F4F8] text-[#1E293B] text-xs font-bold py-2 px-4 rounded-xl hover:bg-[#F0F4F8]/80 transition-all cursor-pointer mt-1"
                    >
                      Dosya Seç
                    </button>
                  </div>
                )}
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#5A5D6B]">Kaynak Başlığı</label>
                  <input 
                    type="text" 
                    placeholder="Örn: 10. Sınıf Kimya Laboratuvar Föyü" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="border border-[#E1E2EC] p-2.5 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1E293B]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#5A5D6B]">Kısa Açıklama</label>
                  <textarea 
                    placeholder="Kaynağın amacı, içeriği veya hedef kitlesi hakkında kısa bilgi..." 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={2}
                    className="border border-[#E1E2EC] p-2.5 rounded-xl text-sm bg-white resize-none focus:outline-none focus:border-[#1E293B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#5A5D6B]">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="border border-[#E1E2EC] p-2.5 rounded-xl text-xs bg-white cursor-pointer"
                    >
                      <option value="Öğretim Kılavuzları">Öğretim Kılavuzları</option>
                      <option value="Öğrenci Notları">Öğrenci Notları</option>
                      <option value="Harici Araçlar">Harici Araçlar</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#5A5D6B]">Tür</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="border border-[#E1E2EC] p-2.5 rounded-xl text-xs bg-white cursor-pointer"
                    >
                      <option value="PDF">PDF Dokümanı</option>
                      <option value="DOCX">Microsoft Word (DOCX)</option>
                      <option value="Video">Eğitim Videosu</option>
                      <option value="Web Sitesi">İnternet Adresi (URL)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#5A5D6B]">İçerik Detayı (Sayfa/Süre)</label>
                    <input 
                      type="text" 
                      placeholder="Örn: PDF • 8 Sayfa veya Video • 15 dk" 
                      value={newDetail}
                      onChange={(e) => setNewDetail(e.target.value)}
                      className="border border-[#E1E2EC] p-2.5 rounded-xl text-xs bg-white focus:outline-none focus:border-[#1E293B]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#5A5D6B]">Dosya Boyutu / Adresi</label>
                    <input 
                      type="text" 
                      placeholder="Örn: 1.4 MB veya khanacademy.org" 
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      className="border border-[#E1E2EC] p-2.5 rounded-xl text-xs bg-white focus:outline-none focus:border-[#1E293B]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-xs pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      resetForm();
                      setShowAddModal(false);
                    }}
                    className="border border-[#E1E2EC] hover:bg-neutral-100 py-2.5 px-4 rounded-xl font-bold"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#1E293B] text-white py-2.5 px-5 rounded-xl font-bold shadow-md shadow-[#1E293B]/20 transition-all active:scale-95"
                  >
                    Yüklemeyi Tamamla
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
