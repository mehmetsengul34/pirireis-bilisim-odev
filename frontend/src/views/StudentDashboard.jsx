import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, CheckCircle2, Clock, Download, Award, 
  MessageSquare, BookOpen, FileCheck, Sparkles, MonitorPlay, Code2, 
  ChevronLeft, ChevronRight, Copy, Check, AlertCircle, HelpCircle, 
  RefreshCw, Terminal, Layers
} from 'lucide-react';
import { 
  assignmentService, submissionService, bilisimService, getFileUrl 
} from '../services/api';
import StudentYksManager from './StudentYksManager';

export default function StudentDashboard({ user }) {
  // Navigation Tabs: 'materials' | 'assignments' | 'yks'
  const [activeTab, setActiveTab] = useState('materials');

  // Bilişim Weekly Materials State
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [currentWeekInfo, setCurrentWeekInfo] = useState({
    current_week: 8,
    total_weeks: 36,
    date_range_str: '02 - 06 Kasım 2026'
  });
  const [material, setMaterial] = useState(null);
  const [loadingMaterial, setLoadingMaterial] = useState(false);
  const [materialSubTab, setMaterialSubTab] = useState('slides'); // 'slides' | 'example'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  // Homeworks State
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  // Submission State per assignment
  const [uploadFiles, setUploadFiles] = useState({}); // { [assignId]: File }
  const [studentNotes, setStudentNotes] = useState({}); // { [assignId]: string }
  const [submitting, setSubmitting] = useState({}); // { [assignId]: boolean }
  const [successMessage, setSuccessMessage] = useState({}); // { [assignId]: string }

  // Initial Fetch: Homeworks & Courses & Current Week
  useEffect(() => {
    fetchAssignments();
    loadBilisimData();
  }, []);

  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const list = await assignmentService.list();
      setAssignments(list || []);
    } catch (err) {
      console.error('Ödevler yüklenirken hata:', err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const loadBilisimData = async () => {
    setLoadingCourses(true);
    try {
      const [weekRes, coursesList] = await Promise.all([
        bilisimService.getCurrentWeek(),
        bilisimService.listCourses()
      ]);
      if (weekRes) setCurrentWeekInfo(weekRes);
      setCourses(coursesList || []);
      // If there are courses and none selected yet, we let student select or auto-select first
      if (coursesList && coursesList.length > 0 && !selectedCourseId) {
        setSelectedCourseId(coursesList[0].id.toString());
      }
    } catch (err) {
      console.error('Bilişim başlangıç verileri alınamadı:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Load Material for Selected Active Course for the Current Academic Week ONLY
  useEffect(() => {
    if (selectedCourseId && currentWeekInfo.current_week) {
      loadMaterialForCourse(Number(selectedCourseId), currentWeekInfo.current_week);
    } else {
      setMaterial(null);
    }
  }, [selectedCourseId, currentWeekInfo.current_week]);

  const loadMaterialForCourse = async (courseId, week) => {
    setLoadingMaterial(true);
    setCurrentSlideIndex(0);
    try {
      const data = await bilisimService.getMaterial(courseId, week);
      setMaterial(data && data.exists ? data : null);
    } catch (err) {
      console.error('Ders materyali yüklenemedi:', err);
      setMaterial(null);
    } finally {
      setLoadingMaterial(false);
    }
  };

  // Copy Code Helper
  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Homework Form Handlers
  const handleFileChange = (assignId, file) => {
    setUploadFiles(prev => ({ ...prev, [assignId]: file }));
  };

  const handleNoteChange = (assignId, note) => {
    setStudentNotes(prev => ({ ...prev, [assignId]: note }));
  };

  const handleSubmitHomework = async (assignId) => {
    const file = uploadFiles[assignId];
    const note = studentNotes[assignId] || '';

    if (!file && !note.trim()) {
      alert('Lütfen teslim etmek için bir dosya seçin veya açıklama notu girin.');
      return;
    }

    setSubmitting(prev => ({ ...prev, [assignId]: true }));
    try {
      const formData = new FormData();
      formData.append('assignment_id', assignId);
      if (file) formData.append('file', file);
      if (note) formData.append('student_note', note);

      await submissionService.submit(formData);

      setSuccessMessage(prev => ({ ...prev, [assignId]: 'Ödeviniz başarıyla yüklendi ve iletildi!' }));
      setTimeout(() => {
        setSuccessMessage(prev => ({ ...prev, [assignId]: '' }));
      }, 4000);

      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.detail || 'Ödev teslim edilirken bir hata oluştu.');
    } finally {
      setSubmitting(prev => ({ ...prev, [assignId]: false }));
    }
  };

  const selectedCourse = courses.find(c => c.id === Number(selectedCourseId));
  const slides = material?.slides || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-2 border border-cyan-200 dark:border-cyan-800">
              <BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Öğrenci Portalı • Torbalı Piri Reis MTAL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Merhaba, {user.full_name}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Bilişim dersinizin o haftaki <span className="font-semibold text-cyan-600 dark:text-cyan-400">anlatım sunusuna</span>, <span className="font-semibold text-teal-600 dark:text-teal-400">haftalık konu örneğine</span> ve modül soru çözümlerine buradan ulaşabilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-3 text-center min-w-[120px]">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Öğrenci No</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                {user.student_number || user.username}
              </span>
            </div>
            <div className="bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 rounded-xl p-3 text-center min-w-[130px]">
              <span className="text-[11px] text-cyan-700 dark:text-cyan-300 block font-medium">Akademik Takvim</span>
              <span className="text-sm font-bold text-cyan-800 dark:text-cyan-200">
                {currentWeekInfo.current_week}. Hafta
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto max-w-full items-center gap-1.5 p-1 bg-zinc-100/90 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 scrollbar-thin">
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'materials'
              ? 'bg-cyan-600 text-white shadow-sm font-bold shadow-cyan-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <MonitorPlay className="w-4 h-4" />
          <span>Bilişim Ders Materyalleri (Slayt & Konu Örneği)</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'assignments'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Ders Ödevleri ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('yks')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'yks'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>YKS Test & Sınav Merkezi</span>
        </button>
      </div>

      {/* TAB 1: BİLİŞİM DERS MATERYALLERİ (ÖĞRENCİ SADECE O HAFTANIN SLAYTI VE KONU ÖRNEĞİNE ERİŞEBİLİR) */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* COURSE SELECTOR BAR */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Aktif Ders Seçiniz:
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-cyan-500 min-w-[280px] max-w-full text-zinc-900 dark:text-zinc-100 shadow-sm"
              >
                <option value="">-- Lütfen Aktif Bir Ders Seçiniz --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.grade_level})
                  </option>
                ))}
              </select>
            </div>

            {selectedCourse && (
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 rounded-lg font-bold">
                  {currentWeekInfo.current_week}. Hafta ({currentWeekInfo.date_range_str})
                </span>
              </div>
            )}
          </div>

          {/* NO COURSE SELECTED STATE */}
          {!selectedCourseId ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-dashed border-zinc-300 dark:border-zinc-700 space-y-3">
              <div className="w-14 h-14 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Lütfen İncelemek İstediğiniz Aktif Dersi Seçiniz
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Öğretmeninizin sisteme yüklediği yıllık plan ve ders modülleri doğrultusunda bu haftanın ders slaytına ve konu örneğine erişmek için yukarıdaki menüden dersinizi seçiniz.
              </p>
            </div>
          ) : loadingMaterial ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
              <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-3" />
              <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {currentWeekInfo.current_week}. Hafta Ders Materyalleri Yükleniyor...
              </div>
            </div>
          ) : !material?.exists ? (
            /* MATERIAL NOT READY YET */
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-10 text-center border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {currentWeekInfo.current_week}. Hafta İçin Henüz Materyal Yayınlanmadı
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Bu ders için {currentWeekInfo.current_week}. hafta sunusu ve konu örneği öğretmeniniz tarafından henüz hazırlanmamıştır. Lütfen daha sonra tekrar kontrol ediniz.
              </p>
            </div>
          ) : (
            /* ACTIVE MATERIAL VIEW: STRICTLY LIMITED TO SLIDES AND TOPIC EXAMPLE */
            <div className="space-y-6">
              {/* WEEK TOPIC BANNER */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedCourse?.name} • {currentWeekInfo.current_week}. Hafta Konusu
                  </div>
                  <span className="text-xs text-amber-300 font-semibold">
                    📅 {currentWeekInfo.date_range_str}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {material.topic || `${currentWeekInfo.current_week}. Hafta Bilişim Dersi`}
                </h2>

                {material.outcomes && (
                  <div className="text-xs text-zinc-300 bg-black/20 p-3 rounded-xl border border-white/10 leading-relaxed">
                    <span className="font-bold text-cyan-300">🎯 Bu Haftanın MEB Kazanımları: </span>
                    {material.outcomes}
                  </div>
                )}
              </div>

              {/* STRICT DUAL SUB-TABS: 1. DERS SLAYTI | 2. KONU ÖRNEĞİ */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-2 sm:p-3 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMaterialSubTab('slides')}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        materialSubTab === 'slides'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <MonitorPlay className="w-4 h-4" />
                      1. O Haftanın Ders Slaytı ({slides.length} Slayt)
                    </button>

                    <button
                      onClick={() => setMaterialSubTab('example')}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        materialSubTab === 'example'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Code2 className="w-4 h-4" />
                      2. O Haftanın Konu Örneği & Modül Çözümleri
                    </button>
                  </div>

                  {/* Top Download Button for Current Subtab */}
                  {materialSubTab === 'slides' && material?.download_url && (
                    <a
                      href={bilisimService.getDownloadUrl(material.id)}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-transform hover:scale-105"
                      title="Ders Sunusunu (.pptx) indir"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PowerPoint (.pptx) İndir
                    </a>
                  )}

                  {materialSubTab === 'example' && material?.topic_download_url && (
                    <a
                      href={bilisimService.getTopicExampleDownloadUrl(material.id)}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-sm transition-transform hover:scale-105"
                      title="Konu Örneğini ve Çözümleri (.docx) indir"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Konu Örneğini İndir (.docx)
                    </a>
                  )}
                </div>

                {/* SUBTAB 1: PRESENTATION SLIDE VIEWER */}
                {materialSubTab === 'slides' && (
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

                {/* SUBTAB 2: O HAFTANIN KONU ÖRNEĞİ & MODÜL ÜNİTE SORULARI */}
                {materialSubTab === 'example' && (
                  <div className="p-6 space-y-6">
                    {/* TOPIC EXAMPLE CARD */}
                    {material?.daily_plan?.topic_example ? (
                      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-teal-500" />
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              Haftanın Konu Örneği ve Çalışma Kodu
                            </h3>
                          </div>
                          {material?.topic_download_url && (
                            <a
                              href={bilisimService.getTopicExampleDownloadUrl(material.id)}
                              download
                              className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Belge Olarak İndir (.docx)
                            </a>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            {material.daily_plan.topic_example.title}
                          </h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {material.daily_plan.topic_example.explanation}
                          </p>
                        </div>

                        {material.daily_plan.topic_example.code_or_design && (
                          <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                            <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 flex items-center justify-between text-xs">
                              <span className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold">
                                Derste Uygulanacak Kod / Tasarım Örneği
                              </span>
                              <button
                                onClick={() => handleCopyCode(material.daily_plan.topic_example.code_or_design, 'student_daily_code')}
                                className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white inline-flex items-center gap-1"
                              >
                                {copiedCodeIndex === 'student_daily_code' ? (
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
                            <div className="p-4 bg-[#0F172A] font-mono text-xs text-sky-200 overflow-x-auto">
                              <pre className="whitespace-pre-wrap leading-relaxed">
                                {material.daily_plan.topic_example.code_or_design}
                              </pre>
                            </div>
                          </div>
                        )}

                        {material.daily_plan.topic_example.pitfalls && (
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Öğrencinin Dikkat Edeceği Noktalar / Sık Yapılan Hatalar: </span>
                              {material.daily_plan.topic_example.pitfalls}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : material?.code_examples?.length > 0 ? (
                      /* Fallback to code examples if daily plan topic example is not present */
                      <div className="space-y-4">
                        {material.code_examples.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm space-y-3"
                          >
                            <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                {item.title}
                              </span>
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
                            <div className="p-4 bg-[#0F172A] font-mono text-xs text-sky-200 overflow-x-auto">
                              <pre className="whitespace-pre-wrap leading-relaxed">{item.code}</pre>
                            </div>
                            <div className="p-4 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                              {item.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* MODÜL ÜNİTE SONU DEĞERLENDİRME SORULARI VE ÇÖZÜMLERİ */}
                    {(material?.daily_plan?.unit_questions?.length > 0 || material?.unit_questions?.length > 0) && (
                      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-indigo-500" />
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              Modül Ünite Sonu Değerlendirme Soruları ve Çözümleri
                            </h3>
                          </div>
                          <span className="text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md font-semibold border border-indigo-200 dark:border-indigo-800">
                            {(material.daily_plan?.unit_questions || material.unit_questions).length} Soru & Cevap
                          </span>
                        </div>

                        <div className="space-y-3">
                          {(material.daily_plan?.unit_questions || material.unit_questions).map((qItem, qIdx) => (
                            <div
                              key={qIdx}
                              className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs"
                            >
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                                  {qIdx + 1}
                                </span>
                                <span className="leading-snug">{qItem.question}</span>
                              </div>

                              <div className="pl-7 space-y-1.5">
                                <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30">
                                  Doğru Cevap: {qItem.correct_answer}
                                </div>
                                <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Detaylı Çözüm ve Açıklama: </span>
                                  {qItem.solution}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ASSIGNMENTS SECTION */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span>Ders Ödevleri ve Görevler</span>
            </h2>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              Toplam {assignments.length} ödev
            </span>
          </div>

          {loadingAssignments ? (
            <div className="text-center py-16 text-xs text-zinc-400 dark:text-zinc-500">Ödevler yükleniyor...</div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
              <CheckCircle2 className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Bekleyen Ödeviniz Yok</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Öğretmeniniz yeni bir ödev verdiğinde burada görüntülenecektir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {assignments.map((assignment) => {
                const mySub = assignment.my_submission;
                const hasSubmitted = !!mySub;
                const isGraded = mySub && mySub.grade !== null && mySub.grade !== undefined;

                return (
                  <div
                    key={assignment.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700">
                          {assignment.classroom_name}
                        </span>

                        {isGraded ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>Puan: {mySub.grade} / 100</span>
                          </span>
                        ) : hasSubmitted ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>İnceleme Bekleniyor</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                            Teslim Edilmedi
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                        {assignment.title}
                      </h3>

                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        {assignment.description || 'Bu ödev için özel bir açıklama girilmemiş.'}
                      </p>

                      {assignment.attachment_path && (
                        <div className="mt-2.5">
                          <a
                            href={getFileUrl(assignment.attachment_path)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-750 transition"
                          >
                            <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                            <span>Öğretmenin Eklediği Belgeyi İndir ({assignment.attachment_filename})</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {isGraded && (
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                            <Award className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                            <span>Öğretmen Değerlendirmesi</span>
                          </div>
                          <span className="text-base font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                            {mySub.grade} <span className="text-xs text-emerald-600 dark:text-emerald-400 font-sans">/ 100</span>
                          </span>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-2.5 border border-emerald-200/60 dark:border-emerald-800/40">
                          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block mb-0.5 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-zinc-400" />
                            <span>Geri Bildirim:</span>
                          </span>
                          <p className="text-xs text-zinc-800 dark:text-zinc-200 italic leading-relaxed">
                            "{mySub.feedback || 'Öğretmen ek bir görüş belirtmedi, tebrikler!'}"
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3.5">
                      {hasSubmitted && (
                        <div className="mb-3 p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>Ödeviniz Teslim Edildi</span>
                            </span>
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block mt-0.5">
                              Tarih: {new Date(mySub.submitted_at).toLocaleString('tr-TR')}
                            </span>
                          </div>

                          {mySub.file_path && (
                            <a
                              href={mySub.file_path}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                              <span>Dosyam</span>
                            </a>
                          )}
                        </div>
                      )}

                      <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                          {hasSubmitted ? 'Ödevinizi Güncellemek / Yeniden Yüklemek İster misiniz?' : 'Ödevinizi Sisteme Yükleyin:'}
                        </span>

                        <div>
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(assignment.id, e.target.files[0])}
                            className="w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-zinc-200 dark:file:bg-zinc-700 file:text-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-300 dark:hover:file:bg-zinc-600 cursor-pointer"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Öğretmene iletmek istediğiniz not (opsiyonel)..."
                            value={studentNotes[assignment.id] || ''}
                            onChange={(e) => handleNoteChange(assignment.id, e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                          />
                        </div>

                        {successMessage[assignment.id] && (
                          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{successMessage[assignment.id]}</span>
                          </div>
                        )}

                        <button
                          onClick={() => handleSubmitHomework(assignment.id)}
                          disabled={submitting[assignment.id]}
                          className="w-full py-2 px-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          {submitting[assignment.id] ? (
                            <span>Yükleniyor...</span>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>{hasSubmitted ? 'Ödevi Güncelle' : 'Ödevi Gönder'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: YKS TEST & SINAV MERKEZİ */}
      {activeTab === 'yks' && (
        <StudentYksManager user={user} />
      )}
    </div>
  );
}
