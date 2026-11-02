import React, { useState, useEffect } from 'react';
import {
  Sparkles, Calendar, BookOpen, FileUp, Upload, Download,
  CheckCircle2, AlertCircle, Copy, Check, ChevronLeft, ChevronRight,
  Code2, MonitorPlay, ListOrdered, HelpCircle, Trash2, Plus,
  FileText, Layers, Terminal, Clock, RefreshCw, Eye, BookMarked
} from 'lucide-react';
import { bilisimService, getFileUrl } from '../services/api';

export default function TeacherBilisimAI({ user }) {
  // Courses State
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // New Course Modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseGrade, setNewCourseGrade] = useState('11. Sınıf');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [selectedStarterKey, setSelectedStarterKey] = useState('mobil_uygulama');
  const [creatingCourse, setCreatingCourse] = useState(false);

  // Academic Week & Timeline
  const [currentWeekInfo, setCurrentWeekInfo] = useState({
    current_week: 8,
    total_weeks: 36,
    date_range_str: '02 - 06 Kasım 2026'
  });
  const [selectedWeek, setSelectedWeek] = useState(8);

  // Course Plan & Modules State
  const [planData, setPlanData] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);

  // Plan Upload State
  const [planFile, setPlanFile] = useState(null);
  const [uploadingPlan, setUploadingPlan] = useState(false);
  const [planTextInput, setPlanTextInput] = useState('');
  const [showPlanTextModal, setShowPlanTextModal] = useState(false);

  // Module Upload State
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleFile, setModuleFile] = useState(null);
  const [uploadingModule, setUploadingModule] = useState(false);

  // Material Generation & Display State
  const [material, setMaterial] = useState(null);
  const [loadingMaterial, setLoadingMaterial] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [customTeacherPrompt, setCustomTeacherPrompt] = useState('');
  const [activeMaterialTab, setActiveMaterialTab] = useState('presentation'); // 'presentation' | 'code' | 'lab' | 'guide' | 'quiz'

  // Interactive Slide Carousel State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  // Initial Fetch: Current Week & Courses
  useEffect(() => {
    loadWeekAndCourses();
  }, []);

  // When selectedCourseId or selectedWeek changes, load plan, modules, and materials
  useEffect(() => {
    if (selectedCourseId) {
      loadPlan(selectedCourseId);
      loadModules(selectedCourseId);
      loadMaterial(selectedCourseId, selectedWeek);
    }
  }, [selectedCourseId, selectedWeek]);

  const loadWeekAndCourses = async (preferredCourseId = null) => {
    setLoadingCourses(true);
    try {
      const [weekRes, coursesList] = await Promise.all([
        bilisimService.getCurrentWeek(),
        bilisimService.listCourses()
      ]);
      if (weekRes) {
        setCurrentWeekInfo(weekRes);
        setSelectedWeek((prev) => prev || weekRes.current_week || 8);
      }
      setCourses(coursesList || []);
      if (coursesList && coursesList.length > 0) {
        if (preferredCourseId && coursesList.some(c => c.id === preferredCourseId)) {
          setSelectedCourseId(preferredCourseId);
        } else if (!selectedCourseId || !coursesList.some(c => c.id === selectedCourseId)) {
          setSelectedCourseId(coursesList[0].id);
        }
      }
    } catch (err) {
      console.error('Bilişim başlangıç verileri alınamadı:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadPlan = async (courseId) => {
    setLoadingPlan(true);
    try {
      const data = await bilisimService.getPlan(courseId);
      setPlanData(data);
    } catch (err) {
      console.error('Yıllık plan alınamadı:', err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const loadModules = async (courseId) => {
    setLoadingModules(true);
    try {
      const data = await bilisimService.listModules(courseId);
      setModules(data);
    } catch (err) {
      console.error('Ders modülleri alınamadı:', err);
    } finally {
      setLoadingModules(false);
    }
  };

  const loadMaterial = async (courseId, week) => {
    setLoadingMaterial(true);
    setCurrentSlideIndex(0);
    try {
      const data = await bilisimService.getMaterial(courseId, week);
      if (data && data.exists) {
        setMaterial(data);
      } else {
        setMaterial(null);
      }
    } catch (err) {
      console.error('Haftalık materyal alınamadı:', err);
      setMaterial(null);
    } finally {
      setLoadingMaterial(false);
    }
  };

  // Direct 1-Click Upload New Annual Plan
  const handleUploadNewPlanDirectly = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPlan(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await bilisimService.uploadNewPlan(fd);
      alert(res.message || 'Yıllık plan başarıyla yüklendi ve ders listesine eklendi!');
      await loadWeekAndCourses(res.course_id);
      if (res.course_id) {
        setSelectedCourseId(res.course_id);
        loadPlan(res.course_id);
        loadMaterial(res.course_id, selectedWeek);
      }
    } catch (err) {
      console.error('Yeni plan yükleme hatası:', err);
      alert('Plan yüklenirken hata oluştu: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploadingPlan(false);
      e.target.value = '';
    }
  };

  // Create Course Handler
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) {
      alert('Lütfen ders adını giriniz.');
      return;
    }
    setCreatingCourse(true);
    try {
      const res = await bilisimService.createCourse({
        name: newCourseName.trim(),
        grade_level: newCourseGrade,
        description: newCourseDesc.trim()
      }, selectedStarterKey);

      setShowCourseModal(false);
      setNewCourseName('');
      setNewCourseDesc('');
      await loadWeekAndCourses(res.course_id);
      if (res.course_id) {
        setSelectedCourseId(res.course_id);
      }
      alert('Bilişim dersi başarıyla oluşturuldu!');
    } catch (err) {
      alert('Ders oluşturulurken hata: ' + (err.response?.data?.detail || err.message));
    } finally {
      setCreatingCourse(false);
    }
  };

  // Delete Course Handler
  const handleDeleteCourse = async () => {
    const course = courses.find(c => c.id === selectedCourseId);
    if (!course) return;
    if (!confirm(`"${course.name}" dersini ve ilişkili tüm plan, modül ve slaytları silmek istediğinize emin misiniz?`)) return;

    try {
      await bilisimService.deleteCourse(selectedCourseId);
      alert('Ders silindi.');
      loadWeekAndCourses();
    } catch (err) {
      alert('Ders silinemedi: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Upload Plan File Handler (for selected course or as a new course)
  const handleUploadPlanFile = async (e, asNewCourse = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!planFile) {
      alert('Lütfen bir yıllık plan dosyası (PDF, Word .docx, Excel .xlsx veya TXT) seçiniz.');
      return;
    }
    setUploadingPlan(true);
    try {
      const fd = new FormData();
      fd.append('file', planFile);
      if (asNewCourse) {
        const res = await bilisimService.uploadNewPlan(fd);
        alert(res.message || 'Yıllık plan yüklendi ve yeni ders başarıyla oluşturuldu!');
        setPlanFile(null);
        await loadWeekAndCourses(res.course_id);
        if (res.course_id) {
          setSelectedCourseId(res.course_id);
        }
      } else {
        if (!selectedCourseId) {
          alert('Lütfen önce bir ders seçiniz.');
          return;
        }
        const res = await bilisimService.uploadPlan(selectedCourseId, fd);
        alert(res.message || 'Yıllık plan başarıyla yüklendi ve müfredat ayrıştırıldı!');
        setPlanFile(null);
        await loadWeekAndCourses(selectedCourseId);
        loadPlan(selectedCourseId);
        loadMaterial(selectedCourseId, selectedWeek);
      }
    } catch (err) {
      console.error('Plan yükleme hatası:', err);
      alert('Plan yüklenirken hata: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploadingPlan(false);
    }
  };

  // Save Plan Text Handler
  const handleSavePlanText = async () => {
    if (!selectedCourseId) {
      alert('Lütfen önce bir ders seçiniz.');
      return;
    }
    if (!planTextInput.trim()) {
      alert('Lütfen yıllık plan metnini giriniz.');
      return;
    }
    setUploadingPlan(true);
    try {
      const fd = new FormData();
      fd.append('raw_text', planTextInput.trim());
      const res = await bilisimService.uploadPlan(selectedCourseId, fd);
      alert(res.message || 'Yıllık plan metni kaydedildi ve haftalık konular ayrıştırıldı!');
      setShowPlanTextModal(false);
      setPlanTextInput('');
      loadPlan(selectedCourseId);
      loadMaterial(selectedCourseId, selectedWeek);
    } catch (err) {
      console.error('Plan metin kaydetme hatası:', err);
      alert('Plan kaydedilirken hata: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploadingPlan(false);
    }
  };

  // Upload Module Handler
  const handleUploadModule = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert('Lütfen önce bir ders seçiniz.');
      return;
    }
    if (!moduleTitle.trim() || !moduleFile) {
      alert('Lütfen modül başlığı ve bir dosya (PDF / Word / TXT) seçiniz.');
      return;
    }
    setUploadingModule(true);
    try {
      const fd = new FormData();
      fd.append('title', moduleTitle.trim());
      fd.append('file', moduleFile);
      const res = await bilisimService.uploadModule(selectedCourseId, fd);
      alert(res.message || 'MEB ders modülü başarıyla yüklendi!');
      setShowModuleModal(false);
      setModuleTitle('');
      setModuleFile(null);
      loadModules(selectedCourseId);
    } catch (err) {
      console.error('Modül yükleme hatası:', err);
      alert('Modül yüklenirken hata: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploadingModule(false);
    }
  };

  // Delete Module Handler
  const handleDeleteModule = async (moduleId, title) => {
    if (!confirm(`"${title}" modül belgesini silmek istediğinize emin misiniz?`)) return;
    try {
      await bilisimService.deleteModule(selectedCourseId, moduleId);
      loadModules(selectedCourseId);
    } catch (err) {
      alert('Modül silinemedi: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Generate Materials with AI
  const handleGenerateMaterial = async () => {
    setGenerating(true);
    try {
      const res = await bilisimService.generateMaterial(selectedCourseId, selectedWeek, {
        week_number: selectedWeek,
        custom_instructions: customTeacherPrompt.trim() || undefined
      });
      alert(res.message || 'Materyaller ve sunum başarıyla oluşturuldu!');
      loadMaterial(selectedCourseId, selectedWeek);
    } catch (err) {
      alert('Materyal üretilirken hata oluştu: ' + (err.response?.data?.detail || err.message));
    } finally {
      setGenerating(false);
    }
  };

  // Copy Code Helper
  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const currentWeekTopic = planData?.parsed_weeks?.find(w => w.week === selectedWeek)?.topic || `${selectedWeek}. Hafta Bilişim Dersi`;
  const currentWeekOutcomes = planData?.parsed_weeks?.find(w => w.week === selectedWeek)?.outcomes || '';
  const slides = material?.slides || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER: MODULE BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Bilişim Teknolojileri Alanı • Otonom Ders Asistanı
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Terminal className="w-8 h-8 text-cyan-400" />
              Yıllık Plan, Modül Deposu & AI Ders Sunumu
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Yıllık planınızı ve MEB ders modüllerinizi yükleyin; yapay zeka güncel takvim haftasına göre derste kullanacağınız 
              <span className="text-cyan-300 font-semibold"> kod örneklerini</span>, 
              <span className="text-amber-300 font-semibold"> laboratuvar görevlerini</span> ve 
              <span className="text-emerald-300 font-semibold"> 16:9 PowerPoint (.pptx) sunusunu</span> tek tıkla hazırlasın.
            </p>
          </div>

          {/* Academic Calendar Week Badge */}
          <div className="bg-slate-800/80 backdrop-blur-md border border-cyan-400/30 rounded-xl p-4 shadow-lg min-w-[240px] text-center">
            <div className="text-xs font-medium text-cyan-300 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              MEB Akademik Takvimi
            </div>
            <div className="text-3xl font-black text-white">
              {currentWeekInfo.current_week}. HAFTA
            </div>
            <div className="text-xs text-amber-300 font-medium mt-1">
              📅 {currentWeekInfo.date_range_str}
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 bg-slate-900/60 py-1 px-2 rounded-md">
              Aktif Eğitim-Öğretim Haftası
            </div>
          </div>
        </div>
      </div>

      {/* COURSE SELECTOR BAR & ACTION CONTROLS */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Aktif Ders:
          </label>
          <select
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-cyan-500 min-w-[320px] max-w-full text-zinc-900 dark:text-zinc-100 shadow-sm"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.grade_level}) {c.has_plan ? '• [Plan Hazır]' : '• [Plan Yok]'}
              </option>
            ))}
          </select>

          {/* 1-Click Fast Upload New Plan & Create Course */}
          <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>📁 Yeni Yıllık Plan Yükle & Ders Aç</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc,.xlsx,.xls,.txt"
              className="hidden"
              onChange={handleUploadNewPlanDirectly}
              disabled={uploadingPlan}
            />
          </label>

          <button
            onClick={() => setShowCourseModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <Plus className="w-4 h-4" />
            Manuel Ders Ekle
          </button>
        </div>

        {selectedCourse && (
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md font-mono">
              {modules.length} Modül Yüklü
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${planData?.has_plan ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              {planData?.has_plan ? '✓ Yıllık Plan Hazır' : '⚠ Plan Yüklenmedi'}
            </span>
            <button
              onClick={handleDeleteCourse}
              title="Dersi Sil"
              className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 36-WEEK INTERACTIVE TIMELINE SELECTOR */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              36 Haftalık Müfredat Çizelgesi
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              (Hafta seçerek o konunun materyalini inceleyin veya üretin)
            </span>
          </div>
          <button
            onClick={() => setSelectedWeek(currentWeekInfo.current_week)}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5" />
            Bu Haftaya Git ({currentWeekInfo.current_week}. Hafta)
          </button>
        </div>

        {/* Horizontal scrollable week pill list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
          {Array.from({ length: 36 }, (_, i) => i + 1).map((w) => {
            const isCurrent = w === currentWeekInfo.current_week;
            const isSelected = w === selectedWeek;
            return (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 scale-105'
                    : isCurrent
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/40 hover:bg-amber-500/25'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>H{w}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Week Topic Banner */}
        <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              {selectedWeek}. Hafta Konusu ({selectedWeek === currentWeekInfo.current_week ? 'Şu Anki Takvim Haftası' : 'Seçilen Hafta'})
            </div>
            <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {currentWeekTopic}
            </div>
            {currentWeekOutcomes && (
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                🎯 {currentWeekOutcomes}
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateMaterial}
            disabled={generating}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md flex-shrink-0 ${
              generating
                ? 'bg-zinc-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20 hover:scale-[1.02]'
            }`}
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Yapay Zeka Hazırlıyor...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                {material?.exists ? 'Materyalleri Tekrar Üret' : 'Bu Haftanın Materyalini AI ile Hazırla'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: LEFT = PLAN & MODULES | RIGHT = AI MATERIALS & PRESENTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 1. YILLIK PLAN YÖNETİMİ & 2. MEB MODÜLLERİ DEPOSU (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 1: YILLIK PLAN YÖNETİMİ */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  1. Yıllık Plan Yönetimi
                </h3>
              </div>
              <button
                onClick={() => setShowPlanTextModal(true)}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
              >
                Metin Düzenle
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Bilişim dersinize ait MEB onaylı yıllık planı PDF, Word veya TXT olarak yükleyin. Sistem 36 haftalık konuları otomatik ayrıştırır.
            </p>

            {planData?.filename && (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-between text-xs border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    {planData.filename}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  {planData.parsed_weeks?.length || 36} Hafta
                </span>
              </div>
            )}

            {/* Plan File Upload Form */}
            <form onSubmit={handleUploadPlanFile} className="space-y-3">
              <label className="block w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 text-center cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors">
                <FileUp className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
                <span className="text-xs text-zinc-600 dark:text-zinc-300 block font-medium">
                  {planFile ? planFile.name : 'Yıllık Plan Dosyası Seç (PDF, Word .docx, Excel, TXT)'}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  PDF, DOCX, XLSX veya TXT dosyası seçin veya sürükleyin
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.xlsx,.xls,.txt"
                  onChange={(e) => setPlanFile(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleUploadPlanFile(e, false)}
                  disabled={!planFile || uploadingPlan}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                    !planFile || uploadingPlan
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  }`}
                >
                  {uploadingPlan ? 'Ayrıştırılıyor...' : 'Bu Ders İçin Kaydet'}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleUploadPlanFile(e, true)}
                  disabled={!planFile || uploadingPlan}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                    !planFile || uploadingPlan
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  {uploadingPlan ? 'Oluşturuluyor...' : '+ Yeni Ders Olarak Ekle'}
                </button>
              </div>
            </form>
          </div>

          {/* CARD 2: MEB DERS MODÜLLERİ DEPOSU */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  2. Ders Modülleri Deposu
                </h3>
              </div>
              <button
                onClick={() => setShowModuleModal(true)}
                className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Modül Yükle
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Ders kitaplarını veya MEB Bilişim modüllerini (PDF) yükleyin. Yapay zeka bu kaynaklardaki teorik ve kodlama konularını slaytlara aktarır.
            </p>

            {/* Modules List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {modules.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-400">
                  Henüz modül yüklenmedi.
                </div>
              ) : (
                modules.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 rounded-lg flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="truncate">
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                        {m.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                        <span>{m.page_count} sayfa</span>
                        <span>•</span>
                        <span>{m.file_size_kb} KB</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteModule(m.id, m.title)}
                      className="text-zinc-400 hover:text-red-500 p-1"
                      title="Modülü Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TEACHER CUSTOM PROMPT BOX */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              Öğretmenin Özel İstek / Yönerge Notu (İsteğe Bağlı)
            </label>
            <textarea
              rows={2}
              value={customTeacherPrompt}
              onChange={(e) => setCustomTeacherPrompt(e.target.value)}
              placeholder="Örn: Bu derste özellikle e-posta regex kontrolüne ve Toast mesajına ağırlık verilsin..."
              className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: AI GENERATED MATERIALS & PRESENTATION (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {loadingMaterial ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
              <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-3" />
              <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {selectedWeek}. Hafta Ders Materyalleri Yükleniyor...
              </div>
            </div>
          ) : !material?.exists ? (
            /* EMPTY STATE: PROMPT TO GENERATE */
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-10 text-center border border-dashed border-zinc-300 dark:border-zinc-700 space-y-4">
              <div className="w-14 h-14 bg-cyan-500/10 text-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedWeek}. Hafta İçin Henüz Materyal Hazırlanmadı
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Konu: <span className="font-semibold text-zinc-700 dark:text-zinc-300">"{currentWeekTopic}"</span>
                  <br />
                  Yıllık plan ve modüllerinizdeki içerikleri harmanlayarak anlatım sunusu, kodlar ve lab görevi üretmek için butona tıklayın.
                </p>
              </div>

              <button
                onClick={handleGenerateMaterial}
                disabled={generating}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/20 transition-all hover:scale-105"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    AI Arka Planda Üretiyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Yapay Zeka ile Şimdi Hazırla
                  </>
                )}
              </button>
            </div>
          ) : (
            /* MATERIAL DISPLAY STATION */
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {/* TOP TAB NAVIGATOR */}
              <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-2 sm:p-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setActiveMaterialTab('presentation')}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeMaterialTab === 'presentation'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <MonitorPlay className="w-4 h-4" />
                    1. Ders Sunusu ({slides.length} Slayt)
                  </button>

                  <button
                    onClick={() => setActiveMaterialTab('code')}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeMaterialTab === 'code'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    2. Canlı Kod Örnekleri
                  </button>

                  <button
                    onClick={() => setActiveMaterialTab('lab')}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeMaterialTab === 'lab'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    3. Laboratuvar Görevi
                  </button>

                  <button
                    onClick={() => setActiveMaterialTab('guide')}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeMaterialTab === 'guide'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    4. Ders Akış Kılavuzu
                  </button>

                  <button
                    onClick={() => setActiveMaterialTab('quiz')}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeMaterialTab === 'quiz'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    5. Pekiştirme Soruları
                  </button>
                </div>

                {/* PPTX Download Action */}
                {material?.download_url && (
                  <a
                    href={bilisimService.getDownloadUrl(material.id)}
                    download
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-transform hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    PowerPoint (.pptx) İndir
                  </a>
                )}
              </div>

              {/* TAB 1: PRESENTATION & INTERACTIVE SLIDE VIEWER */}
              {activeMaterialTab === 'presentation' && (
                <div className="p-6 space-y-6">
                  {slides.length > 0 ? (
                    <div className="space-y-4">
                      {/* 16:9 SLIDE CONTAINER */}
                      <div className="relative aspect-[16/9] w-full rounded-2xl bg-[#0B132B] text-white p-6 sm:p-8 flex flex-col justify-between shadow-2xl border border-[#3A506B] overflow-hidden select-none">
                        {/* Slide Top Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-amber-400" />

                        {/* Slide Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase">
                              {slides[currentSlideIndex]?.category || selectedCourse?.name}
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                              {slides[currentSlideIndex]?.title}
                            </h2>
                          </div>

                          <span className="px-3 py-1 rounded-lg bg-[#1C2541] border border-cyan-400 text-cyan-400 text-xs font-bold tracking-wider flex-shrink-0">
                            {slides[currentSlideIndex]?.badge || `SLAYT ${currentSlideIndex + 1}`}
                          </span>
                        </div>

                        {/* Slide Body: Code view or Bullets */}
                        <div className="my-auto py-2">
                          {slides[currentSlideIndex]?.code_snippet ? (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                              <div className="md:col-span-7 bg-[#0F172A] p-4 rounded-xl border border-[#3A506B] font-mono text-xs text-sky-200 overflow-x-auto max-h-[220px]">
                                <pre className="whitespace-pre-wrap">{slides[currentSlideIndex].code_snippet}</pre>
                              </div>
                              <div className="md:col-span-5 space-y-2">
                                {slides[currentSlideIndex]?.bullets?.map((b, bIdx) => (
                                  <div key={bIdx} className="p-2.5 rounded-lg bg-[#1C2541] border border-[#3A506B] text-xs text-slate-200 flex items-start gap-2">
                                    <span className="text-amber-400 font-bold">•</span>
                                    <span>{b}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {slides[currentSlideIndex]?.bullets?.map((bullet, bIdx) => (
                                <div
                                  key={bIdx}
                                  className="p-3.5 rounded-xl bg-[#1C2541] border border-[#3A506B] text-xs sm:text-sm text-slate-100 flex items-start gap-2.5 shadow-sm"
                                >
                                  <span className="text-cyan-400 font-bold text-base leading-none">•</span>
                                  <span className="leading-snug">{bullet}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Slide Footer */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                          <span>Torbalı Piri Reis MTAL Bilişim Teknolojileri</span>
                          <span>Slayt {currentSlideIndex + 1} / {slides.length}</span>
                        </div>
                      </div>

                      {/* SLIDE NAVIGATION CONTROLS */}
                      <div className="flex items-center justify-between px-2">
                        <button
                          onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                          disabled={currentSlideIndex === 0}
                          className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            currentSlideIndex === 0
                              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-cyan-600 hover:text-white'
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Önceki Slayt
                        </button>

                        {/* Slide Thumb Dots */}
                        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[280px] px-2">
                          {slides.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlideIndex(idx)}
                              className={`w-2.5 h-2.5 rounded-full transition-all ${
                                idx === currentSlideIndex
                                  ? 'bg-cyan-500 w-6'
                                  : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                          disabled={currentSlideIndex === slides.length - 1}
                          className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            currentSlideIndex === slides.length - 1
                              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-cyan-600 hover:text-white'
                          }`}
                        >
                          Sonraki Slayt
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-400 text-xs">Slayt bulunamadı.</div>
                  )}
                </div>
              )}

              {/* TAB 2: CODE EXAMPLES */}
              {activeMaterialTab === 'code' && (
                <div className="p-6 space-y-6">
                  {material?.code_examples?.length > 0 ? (
                    material.code_examples.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm space-y-3"
                      >
                        {/* Code Header Bar */}
                        <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-cyan-500" />
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                              {item.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase font-mono">
                              {item.language}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopyCode(item.code, idx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors"
                          >
                            {copiedCodeIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500 text-[11px]">Kopyalandı</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Kopyala</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Code Editor Window */}
                        <div className="p-4 bg-[#0F172A] font-mono text-xs text-sky-200 overflow-x-auto">
                          <pre className="whitespace-pre-wrap leading-relaxed">{item.code}</pre>
                        </div>

                        {/* Code Explanation & Pitfalls */}
                        <div className="p-4 pt-1 space-y-2 text-xs">
                          <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">Açıklama: </span>
                            {item.explanation}
                          </div>

                          {item.common_mistakes && (
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold">Öğrenci Tuzağı / Sık Yapılan Hata: </span>
                                {item.common_mistakes}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-zinc-400 text-xs">Kod örneği bulunamadı.</div>
                  )}
                </div>
              )}

              {/* TAB 3: LAB EXERCISE */}
              {activeMaterialTab === 'lab' && (
                <div className="p-6 space-y-6">
                  {material?.lab_exercises ? (
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                          Atölye Bilgisayar Uygulaması
                        </span>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                          {material.lab_exercises.title}
                        </h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {material.lab_exercises.scenario}
                        </p>
                      </div>

                      {/* Step by step lab instructions */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                          Uygulama Adımları:
                        </h4>
                        <div className="space-y-2">
                          {material.lab_exercises.steps?.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 flex items-start gap-3"
                            >
                              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                                {sIdx + 1}
                              </span>
                              <span className="leading-snug">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expected Output */}
                      {material.lab_exercises.expected_output && (
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-700 dark:text-cyan-300">
                          <span className="font-bold">Öğretmen Değerlendirme Kriteri & Beklenen Çıktı: </span>
                          {material.lab_exercises.expected_output}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-400 text-xs">Laboratuvar görevi bulunamadı.</div>
                  )}
                </div>
              )}

              {/* TAB 4: TEACHING GUIDE */}
              {activeMaterialTab === 'guide' && (
                <div className="p-6 space-y-6">
                  {material?.teaching_guide ? (
                    <div className="space-y-6">
                      {/* Timeline */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-500" />
                          Ders Akış Çizelgesi (80 Dakika)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {material.teaching_guide.timeline?.map((item, tIdx) => (
                            <div
                              key={tIdx}
                              className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 font-bold">
                                <span>{item.phase}</span>
                                <span className="text-[11px] bg-cyan-500/10 px-2 py-0.5 rounded">{item.time}</span>
                              </div>
                              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {item.activity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Board Notes & Tips */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {material.teaching_guide.board_notes && (
                          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                              <Terminal className="w-4 h-4 text-indigo-500" />
                              Tahtaya Çizilecek Notlar / Şemalar:
                            </span>
                            <pre className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400 font-sans mt-1">
                              {material.teaching_guide.board_notes}
                            </pre>
                          </div>
                        )}

                        {material.teaching_guide.teacher_tips && (
                          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-700 dark:text-amber-300 space-y-1">
                            <span className="font-bold flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4" />
                              Öğretmene Pedagojik Atölye İpucu:
                            </span>
                            <p className="leading-relaxed mt-1">
                              {material.teaching_guide.teacher_tips}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-400 text-xs">Ders kılavuzu bulunamadı.</div>
                  )}
                </div>
              )}

              {/* TAB 5: QUIZ QUESTIONS */}
              {activeMaterialTab === 'quiz' && (
                <div className="p-6 space-y-4">
                  {material?.quiz_questions?.length > 0 ? (
                    material.quiz_questions.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs"
                      >
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                          {qIdx + 1}. Soru: {q.question}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options?.map((opt, oIdx) => {
                            const optLetter = opt.trim().substring(0, 1).toUpperCase();
                            const isCorrect = optLetter === q.correct_answer;
                            return (
                              <div
                                key={oIdx}
                                className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                                  isCorrect
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                                    : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                                }`}
                              >
                                {opt} {isCorrect && '✓ (Doğru)'}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="text-zinc-500 dark:text-zinc-400 pt-1 text-[11px]">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Açıklama: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-zinc-400 text-xs">Pekiştirme sorusu bulunamadı.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: NEW COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-500" />
              Yeni Bilişim Dersi Tanımla
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Ders Adı</label>
                <input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="Örn: Mobil Uygulama Geliştirme (Android Studio)"
                  className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Sınıf Düzeyi</label>
                  <select
                    value={newCourseGrade}
                    onChange={(e) => setNewCourseGrade(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="9. Sınıf">9. Sınıf</option>
                    <option value="10. Sınıf">10. Sınıf</option>
                    <option value="11. Sınıf">11. Sınıf</option>
                    <option value="12. Sınıf">12. Sınıf</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Hazır Müfredat Şablonu</label>
                  <select
                    value={selectedStarterKey}
                    onChange={(e) => setSelectedStarterKey(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  >
                    <option value="mobil_uygulama">Mobil Uygulama (Android / Java)</option>
                    <option value="web_programlama">Web Programlama (React / JS)</option>
                    <option value="nesne_tabanli">Nesne Tabanlı (C# / Python)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Açıklama (İsteğe Bağlı)</label>
                <textarea
                  rows={2}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Dersin hedefleri ve laboratuvar içeriği..."
                  className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={creatingCourse}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  {creatingCourse ? 'Oluşturuluyor...' : 'Dersi Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PLAN TEXT EDITOR MODAL */}
      {showPlanTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Yıllık Plan Metnini Yapıştır veya Düzenle
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Yıllık planınızdaki hafta ve konuları buraya doğrudan yapıştırabilirsiniz. (Örn: "1. Hafta: Konu Başlığı - Kazanımlar")
            </p>

            <textarea
              rows={12}
              value={planTextInput}
              onChange={(e) => setPlanTextInput(e.target.value)}
              placeholder="1. Hafta: Android Studio Kurulumu&#10;2. Hafta: XML Arayüz Bileşenleri&#10;3. Hafta: ConstraintLayout..."
              className="w-full p-3 font-mono text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPlanTextModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={handleSavePlanText}
                disabled={uploadingPlan}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                {uploadingPlan ? 'Ayrıştırılıyor...' : 'Kaydet & 36 Haftayı Güncelle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MODULE UPLOAD MODAL */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-500" />
              MEB Ders Modülü Yükle
            </h3>

            <form onSubmit={handleUploadModule} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Modül Başlığı</label>
                <input
                  type="text"
                  required
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="Örn: Modül 2: Layout ve Olay Dinleyicileri"
                  className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Modül Dosyası (PDF/DOCX)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setModuleFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={uploadingModule}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {uploadingModule ? 'Metin İndeksleniyor...' : 'Modülü Yükle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

