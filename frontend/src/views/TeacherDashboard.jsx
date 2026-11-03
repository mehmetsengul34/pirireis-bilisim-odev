import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Plus, CheckCircle2, Clock, FileText, Download, 
  Send, UserPlus, Trash2, Award, ChevronRight, X,
  Crown, ShieldCheck, Upload, FileUp, Copy, Check,
  Database, Save, RefreshCw, AlertTriangle, Server, HardDrive, Sparkles, Terminal
} from 'lucide-react';
import { 
  classroomService, assignmentService, submissionService, 
  teacherService, systemService, getFileUrl 
} from '../services/api';
import TeacherYksManager from './TeacherYksManager';
import TeacherBilisimAI from './TeacherBilisimAI';

export default function TeacherDashboard({ user }) {
  const isMaster = user?.username?.toLowerCase() === 'pirireis';
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'classrooms' | 'teachers' | 'system'
  const [classrooms, setClassrooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Master Teacher States
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacherFullName, setTeacherFullName] = useState('');
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');

  // System & Backup States (Master Only)
  const [systemStatus, setSystemStatus] = useState(null);
  const [loadingSystem, setLoadingSystem] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState(null);

  // Classroom Modal States
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('11. Sınıf');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [newClassTeacherId, setNewClassTeacherId] = useState('');

  // Student Modal States
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [studentModalTab, setStudentModalTab] = useState('pdf'); // 'pdf' | 'manual'
  const [studentFullName, setStudentFullName] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('1234');
  const [studentNumber, setStudentNumber] = useState('');
  const [classStudents, setClassStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // PDF Upload States
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfResult, setPdfResult] = useState(null);
  const [pdfError, setPdfError] = useState('');
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Assignment Modal States
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignClassId, setAssignClassId] = useState('');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignFile, setAssignFile] = useState(null);

  // Submissions Review Modal
  const [reviewAssignment, setReviewAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [gradingState, setGradingState] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classList, assignList] = await Promise.all([
        classroomService.list(),
        assignmentService.list()
      ]);
      setClassrooms(classList);
      setAssignments(assignList);
      if (classList.length > 0 && !assignClassId) {
        setAssignClassId(classList[0].id.toString());
      }
    } catch (err) {
      console.error('Veriler yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    if (!isMaster) return;
    setLoadingTeachers(true);
    try {
      const teacherList = await teacherService.list();
      setTeachers(teacherList);
    } catch (err) {
      console.error('Öğretmenler yüklenirken hata:', err);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const fetchSystemStatus = async () => {
    if (!isMaster) return;
    setLoadingSystem(true);
    try {
      const status = await systemService.getStatus();
      setSystemStatus(status);
    } catch (err) {
      console.error('Sistem durumu alınamadı:', err);
    } finally {
      setLoadingSystem(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (isMaster) {
      fetchTeachers();
      fetchSystemStatus();
    }
  }, []);

  // Handle Download Backup
  const handleDownloadBackup = async () => {
    try {
      await systemService.downloadBackup();
    } catch (err) {
      alert('Yedek indirilirken hata oluştu: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle Restore Backup
  const handleRestoreBackup = async (e) => {
    e.preventDefault();
    if (!restoreFile) {
      alert('Lütfen geri yüklemek için geçerli bir JSON yedek dosyası seçiniz.');
      return;
    }
    if (!confirm('Seçilen yedek dosyasındaki veriler mevcut veritabanına aktarılacak ve eksik kayıtlar eklenecektir. Devam etmek istiyor musunuz?')) {
      return;
    }
    setRestoring(true);
    setRestoreResult(null);
    try {
      const res = await systemService.restoreBackup(restoreFile);
      setRestoreResult(res);
      alert('Tüm veriler başarıyla geri yüklendi!');
      setRestoreFile(null);
      fetchData();
      fetchTeachers();
      fetchSystemStatus();
    } catch (err) {
      alert('Geri yükleme başarısız oldu: ' + (err.response?.data?.detail || err.message));
    } finally {
      setRestoring(false);
    }
  };

  // Handle Create Teacher (Master Only)
  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    if (!teacherFullName.trim() || !teacherUsername.trim() || !teacherPassword.trim()) {
      alert('Lütfen ad soyad, kullanıcı adı ve şifre alanlarını eksiksiz doldurunuz.');
      return;
    }
    try {
      await teacherService.create({
        full_name: teacherFullName.trim(),
        username: teacherUsername.trim(),
        password: teacherPassword.trim()
      });
      setShowTeacherModal(false);
      setTeacherFullName('');
      setTeacherUsername('');
      setTeacherPassword('');
      fetchTeachers();
      fetchSystemStatus();
    } catch (err) {
      alert(err.response?.data?.detail || 'Öğretmen hesabı oluşturulamadı.');
    }
  };

  // Handle Delete Teacher (Master Only)
  const handleDeleteTeacher = async (teacherId, teacherName) => {
    if (!confirm(`"${teacherName}" isimli öğretmeni silmek istediğinize emin misiniz?`)) return;
    try {
      await teacherService.delete(teacherId);
      fetchTeachers();
      fetchData();
      fetchSystemStatus();
    } catch (err) {
      alert(err.response?.data?.detail || 'Öğretmen silinirken hata oluştu.');
    }
  };

  // Handle Create Classroom
  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      alert('Lütfen sınıf adını giriniz.');
      return;
    }
    try {
      await classroomService.create({
        name: newClassName.trim(),
        grade_level: newClassGrade.trim(),
        description: newClassDesc.trim(),
        teacher_id: newClassTeacherId ? parseInt(newClassTeacherId, 10) : undefined
      });
      setShowClassModal(false);
      setNewClassName('');
      setNewClassDesc('');
      setNewClassTeacherId('');
      fetchData();
      fetchSystemStatus();
    } catch (err) {
      alert('Sınıf oluşturulamadı.');
    }
  };

  // Open Student Modal for a Class
  const handleOpenStudentModal = async (classroomId) => {
    setSelectedClassId(classroomId);
    setShowStudentModal(true);
    setStudentModalTab('pdf'); // default to PDF import
    setPdfFile(null);
    setPdfResult(null);
    setPdfError('');
    setLoadingStudents(true);
    try {
      const students = await classroomService.getStudents(classroomId);
      setClassStudents(students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Handle Add Student to Class (Manual)
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentFullName.trim() || !studentUsername.trim() || !studentPassword.trim()) {
      alert('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    try {
      await classroomService.addStudent(selectedClassId, {
        full_name: studentFullName.trim(),
        username: studentUsername.trim(),
        password: studentPassword.trim(),
        student_number: studentNumber.trim()
      });

      // Clear form
      setStudentFullName('');
      setStudentUsername('');
      setStudentPassword('1234');
      setStudentNumber('');

      // Refresh student list
      const students = await classroomService.getStudents(selectedClassId);
      setClassStudents(students);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Öğrenci eklenirken bir hata oluştu.');
    }
  };

  // Handle PDF Upload for Students
  const handlePdfUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert('Lütfen bir e-Okul sınıf listesi PDF dosyası seçiniz.');
      return;
    }

    setUploadingPdf(true);
    setPdfError('');
    setPdfResult(null);

    try {
      const res = await classroomService.uploadStudentsPdf(selectedClassId, pdfFile);
      setPdfResult(res);
      setPdfFile(null);

      // Refresh student list
      const students = await classroomService.getStudents(selectedClassId);
      setClassStudents(students);
      fetchData();
    } catch (err) {
      setPdfError(err.response?.data?.detail || 'PDF dosyası işlenirken hata oluştu.');
    } finally {
      setUploadingPdf(false);
    }
  };

  // Copy or Download credentials list
  const handleCopyCredentials = () => {
    if (!pdfResult?.students) return;
    const text = pdfResult.students.map(s => 
      `No: ${s.student_number || '-'} | Ad Soyad: ${s.full_name} | Kullanıcı Adı: ${s.username} | Şifre: ${s.password}`
    ).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2500);
  };

  // Handle Remove Student from Class
  const handleRemoveStudent = async (studentId) => {
    if (!confirm('Bu öğrenciyi sınıftan çıkarmak istediğinize emin misiniz?')) return;
    try {
      await classroomService.removeStudent(selectedClassId, studentId);
      const students = await classroomService.getStudents(selectedClassId);
      setClassStudents(students);
      fetchData();
    } catch (err) {
      alert('Öğrenci çıkarılırken hata oluştu.');
    }
  };

  // Handle Delete Classroom
  const handleDeleteClass = async (classroomId, className) => {
    if (!confirm(`"${className}" sınıfını ve bu sınıfa ait tüm ödevleri silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await classroomService.delete(classroomId);
      if (selectedClassId === classroomId) {
        setShowStudentModal(false);
        setSelectedClassId(null);
      }
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Sınıf silinirken hata oluştu.');
    }
  };

  // Handle Delete Assignment
  const handleDeleteAssignment = async (assignmentId, assignmentTitle) => {
    if (!confirm(`"${assignmentTitle}" ödevini ve bu ödeve ait tüm öğrenci teslimlerini silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await assignmentService.delete(assignmentId);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Ödev silinirken hata oluştu.');
    }
  };

  // Handle Assignment Creation
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const targetClassId = assignClassId || (classrooms[0]?.id?.toString() || '');
    if (!assignTitle.trim() || !targetClassId) {
      alert('Lütfen sınıf ve ödev başlığı giriniz.');
      return;
    }

    const formData = new FormData();
    formData.append('classroom_id', targetClassId);
    formData.append('title', assignTitle.trim());
    formData.append('description', assignDesc.trim());
    if (assignDueDate) formData.append('due_date', assignDueDate);
    if (assignFile) formData.append('file', assignFile);

    try {
      await assignmentService.create(formData);
      setShowAssignmentModal(false);
      setAssignTitle('');
      setAssignDesc('');
      setAssignDueDate('');
      setAssignFile(null);
      fetchData();
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Ödev oluşturulurken hata oluştu.';
      alert(errMsg);
    }
  };

  // Open Submissions Review
  const handleOpenSubmissions = async (assignment) => {
    setReviewAssignment(assignment);
    setLoadingSubmissions(true);
    try {
      const subs = await submissionService.getByAssignment(assignment.id);
      setSubmissions(subs);
      const stateObj = {};
      subs.forEach(s => {
        stateObj[s.id] = {
          grade: s.grade !== null && s.grade !== undefined ? s.grade.toString() : '',
          feedback: s.feedback || '',
          saving: false,
          success: false
        };
      });
      setGradingState(stateObj);
    } catch (err) {
      alert('Ödev teslimleri yüklenemedi.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Save Grade & Feedback
  const handleSaveGrade = async (submissionId) => {
    const s = gradingState[submissionId];
    if (s.grade === '' || isNaN(parseInt(s.grade, 10))) {
      alert('Lütfen 0 ile 100 arasında bir puan giriniz.');
      return;
    }

    setGradingState(prev => ({
      ...prev,
      [submissionId]: { ...prev[submissionId], saving: true, success: false }
    }));

    try {
      await submissionService.grade(submissionId, s.grade, s.feedback);
      setGradingState(prev => ({
        ...prev,
        [submissionId]: { ...prev[submissionId], saving: false, success: true }
      }));
      setTimeout(() => {
        setGradingState(prev => ({
          ...prev,
          [submissionId]: { ...prev[submissionId], success: false }
        }));
      }, 3000);
      fetchData();
    } catch (err) {
      alert('Puan kaydedilemedi.');
      setGradingState(prev => ({
        ...prev,
        [submissionId]: { ...prev[submissionId], saving: false }
      }));
    }
  };

  const selectedClass = classrooms.find(c => c.id === selectedClassId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="no-print bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-700">
                <Award className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>{isMaster ? 'Master Yönetici & Öğretmen Paneli' : 'Öğretmen Yönetim Paneli'}</span>
              </div>
              {isMaster && systemStatus?.db && (
                <button
                  onClick={() => {
                    setActiveTab('system');
                    fetchSystemStatus();
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition ${
                    systemStatus.db.is_persistent
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                  }`}
                  title="Veritabanı ve Kalıcılık Durumu (Tıklayın)"
                >
                  <Database className="w-3 h-3" />
                  <span>{systemStatus.db.is_persistent ? 'PostgreSQL (Kalıcı)' : 'SQLite (Geçici Bulut Diski - Yedek Alınız)'}</span>
                </button>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Hoş Geldiniz, {user.full_name}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
              {isMaster 
                ? 'Okul genelindeki tüm sınıfları, öğretmen hesaplarını ve ödevleri bu panelden eksiksiz yönetebilirsiniz.' 
                : 'Sınıflarınızı yönetin, öğrencilere ödev tanımlayın ve teslim edilen çalışmaları puanlayın.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isMaster && (
              <button
                onClick={() => setShowTeacherModal(true)}
                className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                <span>Yeni Öğretmen Ekle</span>
              </button>
            )}
            <button
              onClick={() => setShowClassModal(true)}
              className="px-3.5 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span>Yeni Sınıf Aç</span>
            </button>
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Yeni Ödev Gönder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="no-print flex flex-nowrap sm:flex-wrap overflow-x-auto max-w-full items-center gap-1.5 p-1 bg-zinc-100/90 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 scrollbar-thin">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'assignments'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Verilen Ödevler ({assignments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('classrooms')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'classrooms'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sınıflar & Öğrenciler ({classrooms.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('yks')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'yks'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>YKS Test & Sınav Merkezi</span>
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'curriculum'
              ? 'bg-cyan-600 text-white shadow-sm font-bold shadow-cyan-600/30'
              : 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-300" />
          <span>Bilişim Dersi AI Asistanı & Sunum</span>
        </button>
        {isMaster && (
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'teachers'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Öğretmenler ({teachers.length})</span>
          </button>
        )}
        {isMaster && (
          <button
            onClick={() => {
              setActiveTab('system');
              fetchSystemStatus();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'system'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Veri Güvenliği & Yedekleme</span>
          </button>
        )}
      </div>

      {/* Tab 1: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">Ödevler yükleniyor...</div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
              <FileText className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Henüz Gönderilen Ödev Yok</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-4">
                Öğrencilerinize uygulama, araştırma veya proje ödevi göndermek için butonu kullanın.
              </p>
              <button
                onClick={() => setShowAssignmentModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white font-medium rounded-xl text-xs transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>İlk Ödevi Oluştur</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700">
                        {assignment.classroom_name}
                      </span>
                      {assignment.due_date && (
                        <span className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <Clock className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                          <span>{new Date(assignment.due_date).toLocaleDateString('tr-TR')}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                      {assignment.title}
                    </h3>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-3 leading-relaxed">
                      {assignment.description || 'Açıklama belirtilmemiş.'}
                    </p>

                    {assignment.attachment_path && (
                      <div className="mt-3">
                        <a
                          href={getFileUrl(assignment.attachment_path)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 transition"
                        >
                          <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                          <span>Ek: {assignment.attachment_filename}</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <span><strong className="text-zinc-900 dark:text-zinc-100">{assignment.submission_count}</strong> Teslim</span>
                      <span>•</span>
                      <span><strong className="text-emerald-600 dark:text-emerald-400">{assignment.graded_count}</strong> Puanlandı</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id, assignment.title)}
                        title="Ödevi Sil"
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenSubmissions(assignment)}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-lg text-xs font-medium transition flex items-center gap-1"
                      >
                        <span>İncele</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Classrooms */}
      {activeTab === 'classrooms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.map((cls) => (
              <div
                key={cls.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs font-medium">
                      {cls.grade_level || 'Bilişim'}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      {cls.student_count} Öğrenci
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{cls.name}</h3>
                  {cls.teacher_name && (
                    <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Öğretmen: {cls.teacher_name}</span>
                    </div>
                  )}
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                    {cls.description || 'Açıklama girilmemiş.'}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {cls.assignment_count} Aktif Ödev
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      title="Sınıfı Sil"
                      className="px-2 py-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition text-xs font-medium"
                    >
                      Sil
                    </button>
                    <button
                      onClick={() => handleOpenStudentModal(cls.id)}
                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Öğrencileri Yönet</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: YKS Test & Sınav Merkezi */}
      {activeTab === 'yks' && (
        <TeacherYksManager classrooms={classrooms} user={user} />
      )}

      {/* Tab: Bilişim Dersi AI Asistanı */}
      {activeTab === 'curriculum' && (
        <TeacherBilisimAI user={user} />
      )}

      {/* Tab 3: Teachers (Master Only) */}
      {isMaster && activeTab === 'teachers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Tanımlı Öğretmenler ({teachers.length})</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Sisteme yeni öğretmen hesabı açabilir veya mevcut öğretmenleri silebilirsiniz.
              </p>
            </div>
            <button
              onClick={() => setShowTeacherModal(true)}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Öğretmen Ekle</span>
            </button>
          </div>

          {loadingTeachers ? (
            <div className="p-8 text-center text-xs text-zinc-400">Öğretmenler yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((tch) => {
                const isCurrentMaster = tch.username.toLowerCase() === 'pirireis';
                return (
                  <div
                    key={tch.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-semibold text-xs">
                        {isCurrentMaster ? <Crown className="w-5 h-5 text-amber-500" /> : <ShieldCheck className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          <span>{tch.full_name}</span>
                          {isCurrentMaster && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded font-medium">
                              Master
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                          @{tch.username}
                        </div>
                      </div>
                    </div>

                    {!isCurrentMaster && (
                      <button
                        onClick={() => handleDeleteTeacher(tch.id, tch.full_name)}
                        title="Öğretmeni Sil"
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: New Teacher Modal (Master Only) */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Yeni Öğretmen Hesabı Aç</h2>
              </div>
              <button
                onClick={() => setShowTeacherModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Öğretmen Adı Soyadı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ayşe Kaya"
                  value={teacherFullName}
                  onChange={(e) => setTeacherFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Kullanıcı Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: aysekaya"
                  value={teacherUsername}
                  onChange={(e) => setTeacherUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Giriş Şifresi</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 20262027"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-3.5 py-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-medium transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-medium transition"
                >
                  Öğretmeni Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: System & Data Persistence (Master Only) */}
      {isMaster && activeTab === 'system' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Sistem Durumu ve Veri Kalıcılığı Güvencesi</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Bulut sunucusunda (Render) ve yerel ortamda veritabanı durumunuzu kontrol edin, tek tıkla tam yedek alın veya geri yükleyin.
                </p>
              </div>
              <button
                onClick={fetchSystemStatus}
                disabled={loadingSystem}
                className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-medium transition flex items-center gap-1.5 self-start md:self-center"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSystem ? 'animate-spin' : ''}`} />
                <span>Yenile</span>
              </button>
            </div>

            {/* DB Health Alert Banner */}
            <div className="mt-5">
              {systemStatus?.db?.is_persistent ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                      Veritabanı Kalıcı Modda Aktif ({systemStatus.db.dialect.toUpperCase()})
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300/90 mt-0.5">
                      Sistem bulut ortamında kalıcı PostgreSQL veritabanına bağlıdır. Sunucu uykuya geçse bile öğretmen, sınıf, öğrenci ve ödev verileriniz asla silinmez.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                      Dikkat: Geçici Dosya Tabanlı Veritabanı Aktif (SQLite)
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                      Canlı Render sunucusunda <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded font-mono text-[11px]">DATABASE_URL</code> ortam değişkeni tanımlanmadığında veriler geçici diske kaydedilir ve Render 15 dakika hareketsiz kalıp uyuduğunda sıfırlanır.
                      Aşağıdaki <strong>"Yedek İndir"</strong> butonuyla verilerinizi bilgisayarınıza indirebilir veya kalıcı PostgreSQL veritabanını sisteme bağlayabilirsiniz.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Counts Grid */}
            {systemStatus?.counts && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Öğretmenler</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{systemStatus.counts.teachers}</div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Sınıflar</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{systemStatus.counts.classrooms}</div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Öğrenciler</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{systemStatus.counts.students}</div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Aktif Ödevler</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{systemStatus.counts.assignments}</div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Teslimler</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{systemStatus.counts.submissions}</div>
                </div>
              </div>
            )}
          </div>

          {/* Backup & Restore Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backup Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 mb-3">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tam Sistem Yedeği İndir (JSON)</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Tüm öğretmen hesaplarını, sınıfları, öğrencileri ve ödevleri tek tıkla şifreli ve güvenli formatta bilgisayarınıza dosya olarak indirir.
                </p>
              </div>
              <button
                onClick={handleDownloadBackup}
                className="mt-5 w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Tüm Verileri Bilgisayarıma İndir</span>
              </button>
            </div>

            {/* Restore Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Yedekten Geri Yükle (Restore)</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Daha önce indirdiğiniz JSON yedeğini yükleyerek tüm öğretmenleri, sınıfları ve öğrencileri sıfır veri kaybıyla anında geri getirin.
                </p>
                <form onSubmit={handleRestoreBackup} className="mt-4 space-y-3">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setRestoreFile(e.target.files[0])}
                    className="w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700 cursor-pointer"
                  />
                  <button
                    type="submit"
                    disabled={!restoreFile || restoring}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{restoring ? 'Geri Yükleniyor...' : 'Seçilen Yedeği Yükle ve Uygula'}</span>
                  </button>
                </form>
              </div>

              {restoreResult && (
                <div className="mt-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-200">
                  Geri yükleme başarılı: {restoreResult.stats?.new_users || 0} kullanıcı, {restoreResult.stats?.new_classrooms || 0} sınıf aktarıldı.
                </div>
              )}
            </div>
          </div>

          {/* Cloud Database Setup Guide */}
          <div className="bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span>Kalıcı PostgreSQL Bulut Veritabanı Bağlama Adımları (Render)</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
              Verilerin Render sunucusu uykuya geçse dahi hiçbir zaman silinmemesini sağlamak için aşağıdaki adımları 2 dakikada tamamlayabilirsiniz:
            </p>
            <ol className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 list-decimal list-inside">
              <li>
                <strong>Neon.tech</strong> (ücretsiz &amp; asla silinmeyen PostgreSQL) veya <strong>Render PostgreSQL</strong> üzerinden ücretsiz bir veritabanı oluşturun.
              </li>
              <li>
                Veritabanının bağlantı adresini (Connection String) kopyalayın (Örn: <code className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require</code>).
              </li>
              <li>
                Render.com kontrol panelinde <strong>pirireis-api</strong> servisinize girip <strong>Environment</strong> sekmesine tıklayın.
              </li>
              <li>
                Anahtar olarak <code className="font-mono font-bold text-zinc-900 dark:text-zinc-100">DATABASE_URL</code>, değer olarak da kopyaladığınız bağlantı adresini yapıştırıp <strong>Save Changes</strong> butonuna basın.
              </li>
              <li>
                Render otomatik yeniden başlatılacak ve sistem artık kalıcı bulut veritabanını kullanacaktır!
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Modal: New Classroom Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Yeni Sınıf Oluştur</h2>
              <button
                onClick={() => setShowClassModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClassroom} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sınıf / Şube Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 11-A Bilişim - Web Programlama"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                />
              </div>

              {isMaster && (
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sorumlu Öğretmen</label>
                  <select
                    value={newClassTeacherId}
                    onChange={(e) => setNewClassTeacherId(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                  >
                    <option value="">{user.full_name} (Kendim)</option>
                    {teachers.filter(t => t.id !== user.id).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name} (@{t.username})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sınıf Seviyesi</label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                >
                  <option value="9. Sınıf">9. Sınıf</option>
                  <option value="10. Sınıf">10. Sınıf</option>
                  <option value="11. Sınıf">11. Sınıf</option>
                  <option value="12. Sınıf">12. Sınıf</option>
                  <option value="Bilişim Teknolojileri">Bilişim Teknolojileri</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ders / Alan Açıklaması</label>
                <textarea
                  rows="2"
                  placeholder="Ders içeriği ve kazanımları hakkında kısa bilgi..."
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-3.5 py-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-medium transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-medium transition"
                >
                  Sınıfı Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Öğrencileri Yönet & PDF / Manuel Öğrenci Ekle */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-3xl shadow-xl relative max-h-[90vh] flex flex-col transition-colors duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedClass?.name} — Öğrenci Yönetimi
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Öğrencileri e-Okul PDF sınıf listesi yükleyerek veya manuel ekleyin.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteClass(selectedClassId, selectedClass?.name);
                    setShowStudentModal(false);
                  }}
                  className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-medium flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sınıfı Sil</span>
                </button>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Switch Tabs: PDF vs Manuel */}
            <div className="flex items-center gap-1.5 p-1 mt-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-fit border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setStudentModalTab('pdf')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  studentModalTab === 'pdf'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <FileUp className="w-3.5 h-3.5 text-school-600 dark:text-school-400" />
                <span>PDF ile Toplu Öğrenci Ekle (e-Okul)</span>
              </button>
              <button
                type="button"
                onClick={() => setStudentModalTab('manual')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  studentModalTab === 'manual'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Manuel Tek Öğrenci Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 overflow-y-auto flex-1">
              {/* Left Column: Form (PDF or Manual) */}
              <div>
                {studentModalTab === 'pdf' ? (
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-school-600 dark:text-school-400" />
                      <span>e-Okul PDF Sınıf Listesi Yükleme</span>
                    </h3>

                    <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 rounded-xl text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed space-y-1">
                      <p className="font-semibold">Otomatik Tanımlama Kuralları:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-blue-800 dark:text-blue-300">
                        <li><strong>Kullanıcı Adı:</strong> Okul No ve Ad bitişik (örn: <span className="font-mono font-bold">1042ahmet</span>)</li>
                        <li><strong>Standart Şifre:</strong> <span className="font-mono font-bold">1234</span></li>
                        <li>Numara ve Ad Soyad bilgileri PDF'ten otomatik okunur.</li>
                      </ul>
                    </div>

                    <form onSubmit={handlePdfUpload} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                          Sınıf Listesi PDF Dosyası
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          required
                          onChange={(e) => setPdfFile(e.target.files[0])}
                          className="w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-zinc-200 dark:file:bg-zinc-700 file:text-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-300 dark:hover:file:bg-zinc-600 cursor-pointer"
                        />
                      </div>

                      {pdfError && (
                        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                          {pdfError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={uploadingPdf || !pdfFile}
                        className="w-full py-2 bg-school-600 hover:bg-school-700 text-white font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        {uploadingPdf ? (
                          <span>PDF İşleniyor ve Öğrenciler Ekleniyor...</span>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>PDF'i Yükle ve Öğrencileri Ekle</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* PDF Result summary card */}
                    {pdfResult && (
                      <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{pdfResult.message}</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                            {pdfResult.students?.length} öğrenci oluşturuldu
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyCredentials}
                            className="px-2 py-1 bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-md text-[11px] font-medium flex items-center gap-1 hover:bg-emerald-50 transition"
                          >
                            {copiedCredentials ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCredentials ? 'Kopyalandı!' : 'Giriş Bilgilerini Kopyala'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Manual Student Add Form */
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl">
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Yeni Öğrenci Hesabı Aç</span>
                    </h3>
                    <form onSubmit={handleAddStudent} className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ad Soyad</label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: Caner Deniz"
                          value={studentFullName}
                          onChange={(e) => {
                            setStudentFullName(e.target.value);
                            // Auto-generate username suggestion if number exists
                            if (studentNumber) {
                              const parts = e.target.value.trim().split(/\s+/).filter(Boolean);
                              const namePart = parts.length >= 2 ? parts.slice(0, -1).join('') : (parts[0] || '');
                              const trMap = { 'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','Ç':'c','Ğ':'g','İ':'i','Ö':'o','Ş':'s','Ü':'u' };
                              const clean = namePart.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => trMap[m]).toLowerCase().replace(/[^a-z0-9]/g, '');
                              setStudentUsername(`${studentNumber.trim()}${clean}`);
                            }
                          }}
                          className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">Okul / Öğrenci No</label>
                        <input
                          type="text"
                          placeholder="Örn: 1045"
                          value={studentNumber}
                          onChange={(e) => {
                            setStudentNumber(e.target.value);
                            if (studentFullName) {
                              const parts = studentFullName.trim().split(/\s+/).filter(Boolean);
                              const namePart = parts.length >= 2 ? parts.slice(0, -1).join('') : (parts[0] || '');
                              const trMap = { 'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','Ç':'c','Ğ':'g','İ':'i','Ö':'o','Ş':'s','Ü':'u' };
                              const clean = namePart.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => trMap[m]).toLowerCase().replace(/[^a-z0-9]/g, '');
                              setStudentUsername(`${e.target.value.trim()}${clean}`);
                            }
                          }}
                          className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">Kullanıcı Adı (Giriş İçin)</label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: 1045caner"
                          value={studentUsername}
                          onChange={(e) => setStudentUsername(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">Giriş Şifresi</label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: 1234"
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white font-medium rounded-lg text-xs transition shadow-sm"
                      >
                        Öğrenciyi Ekle
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Right Column: Student List */}
              <div className="flex flex-col">
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center justify-between">
                  <span>Kayıtlı Öğrenciler ({classStudents.length})</span>
                </h3>

                {loadingStudents ? (
                  <div className="text-center py-8 text-xs text-zinc-400 dark:text-zinc-500">Öğrenciler yükleniyor...</div>
                ) : classStudents.length === 0 ? (
                  <div className="text-center py-10 text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    Bu sınıfa henüz öğrenci eklenmemiş.<br />
                    PDF yükleyerek veya soldaki formdan ekleyebilirsiniz.
                  </div>
                ) : (
                  <div className="space-y-1.5 overflow-y-auto max-h-80 pr-1">
                    {classStudents.map((st) => (
                      <div
                        key={st.id}
                        className="p-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{st.full_name}</div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Kullanıcı: <span className="font-mono text-zinc-800 dark:text-zinc-200 font-semibold">{st.username}</span>
                            {st.student_number && ` • No: ${st.student_number}`}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveStudent(st.id)}
                          title="Sınıftan Çıkar"
                          className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Yeni Ödev Gönder</h2>
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 pt-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Hedef Sınıf</label>
                <select
                  value={assignClassId || (classrooms[0]?.id?.toString() || '')}
                  onChange={(e) => setAssignClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.grade_level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ödev Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Hafta 3: CSS Flexbox Uygulaması"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ödev Açıklaması & Yönergeler</label>
                <textarea
                  rows="3"
                  placeholder="Öğrencilerin yapması gereken adımlar, teslim formatı (zip, pdf vb.)..."
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Son Teslim Tarihi (Opsiyonel)</label>
                  <input
                    type="datetime-local"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ek Dosya / Yönerge Belgesi</label>
                  <input
                    type="file"
                    onChange={(e) => setAssignFile(e.target.files[0])}
                    className="w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-3.5 py-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-medium transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-medium transition"
                >
                  Ödevi Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Review Submissions Modal */}
      {reviewAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-4xl shadow-xl relative max-h-[90vh] flex flex-col transition-colors duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  {reviewAssignment.classroom_name}
                </span>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {reviewAssignment.title} — Teslimat İnceleme ve Puanlama
                </h2>
              </div>
              <button
                onClick={() => setReviewAssignment(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1 space-y-4">
              {loadingSubmissions ? (
                <div className="py-12 text-center text-xs text-zinc-400">Teslimler yükleniyor...</div>
              ) : submissions.length === 0 ? (
                <div className="py-16 text-center text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  Henüz bu ödeve öğrenci teslimi yapılmamış.
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => {
                    const gState = gradingState[sub.id] || {};
                    return (
                      <div
                        key={sub.id}
                        className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                              {sub.student_name}
                            </span>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                              No: {sub.student_number || '-'}
                            </span>
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                              • {new Date(sub.submitted_at).toLocaleString('tr-TR')}
                            </span>
                          </div>

                          {sub.student_note && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-300 italic bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
                              "{sub.student_note}"
                            </p>
                          )}

                          {sub.file_path && (
                            <div>
                              <a
                                href={getFileUrl(sub.file_path)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-school-600 dark:text-school-400 font-medium hover:underline"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Teslim Edilen Dosyayı İndir ({sub.filename || 'Ek'})</span>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Grading Box */}
                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 self-end md:self-auto">
                          <div className="w-20">
                            <label className="block text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mb-0.5">Puan (0-100)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={gState.grade}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGradingState(prev => ({
                                  ...prev,
                                  [sub.id]: { ...prev[sub.id], grade: val }
                                }));
                              }}
                              placeholder="100"
                              className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100 text-center focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                            />
                          </div>

                          <div className="w-44">
                            <label className="block text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mb-0.5">Geri Bildirim / Not</label>
                            <input
                              type="text"
                              value={gState.feedback}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGradingState(prev => ({
                                  ...prev,
                                  [sub.id]: { ...prev[sub.id], feedback: val }
                                }));
                              }}
                              placeholder="Tebrikler, başarılı..."
                              className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400"
                            />
                          </div>

                          <div className="pt-3.5">
                            <button
                              type="button"
                              onClick={() => handleSaveGrade(sub.id)}
                              disabled={gState.saving}
                              className={`px-3 py-1 rounded text-xs font-medium transition ${
                                gState.success 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white'
                              }`}
                            >
                              {gState.saving ? '...' : (gState.success ? 'Kaydedildi!' : 'Kaydet')}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
