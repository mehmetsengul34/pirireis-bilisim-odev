import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Plus, CheckCircle2, Clock, FileText, Download, 
  Send, UserPlus, Trash2, Award, MessageSquare, ChevronRight, AlertCircle, X
} from 'lucide-react';
import { classroomService, assignmentService, submissionService } from '../services/api';

export default function TeacherDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'classrooms'
  const [classrooms, setClassrooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('11. Sınıf');
  const [newClassDesc, setNewClassDesc] = useState('');

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [studentFullName, setStudentFullName] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [classStudents, setClassStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

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
  const [gradingState, setGradingState] = useState({}); // { [subId]: { grade: '', feedback: '', saving: false, success: false } }

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

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Class Creation
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      await classroomService.create({
        name: newClassName.trim(),
        grade_level: newClassGrade,
        description: newClassDesc.trim()
      });
      setShowClassModal(false);
      setNewClassName('');
      setNewClassDesc('');
      fetchData();
    } catch (err) {
      alert('Sınıf oluşturulurken hata oluştu.');
    }
  };

  // Open Student Modal for a Class
  const handleOpenStudentModal = async (classroomId) => {
    setSelectedClassId(classroomId);
    setShowStudentModal(true);
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

  // Handle Add Student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentUsername.trim() || !studentPassword.trim() || !studentFullName.trim()) {
      alert('Lütfen öğrenci adı, kullanıcı adı ve şifresini eksiksiz giriniz.');
      return;
    }
    try {
      await classroomService.addStudent(selectedClassId, {
        full_name: studentFullName.trim(),
        username: studentUsername.trim(),
        password: studentPassword.trim(),
        student_number: studentNumber.trim()
      });
      setStudentFullName('');
      setStudentUsername('');
      setStudentPassword('');
      setStudentNumber('');
      const updated = await classroomService.getStudents(selectedClassId);
      setClassStudents(updated);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Öğrenci eklenirken hata oluştu.');
    }
  };

  // Handle Remove Student
  const handleRemoveStudent = async (studentId) => {
    if (!confirm('Öğrenciyi sınıftan çıkarmak istediğinize emin misiniz?')) return;
    try {
      await classroomService.removeStudent(selectedClassId, studentId);
      const updated = await classroomService.getStudents(selectedClassId);
      setClassStudents(updated);
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
    if (!assignTitle.trim() || !assignClassId) {
      alert('Lütfen sınıf ve ödev başlığı giriniz.');
      return;
    }

    const formData = new FormData();
    formData.append('classroom_id', assignClassId);
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
      alert('Ödev oluşturulurken hata oluştu.');
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
      alert('Puan kaydedilirken hata oluştu.');
      setGradingState(prev => ({
        ...prev,
        [submissionId]: { ...prev[submissionId], saving: false }
      }));
    }
  };

  const selectedClass = classrooms.find(c => c.id === selectedClassId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Öğretmen Yönetim Paneli</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hoş Geldiniz, {user.full_name}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Sınıflarınızı yönetin, öğrencilere yeni hesaplar ve ödevler tanımlayın, teslim edilen ödevleri puanlayıp geri bildirimde bulunun.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowClassModal(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Yeni Sınıf Aç</span>
            </button>
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Yeni Ödev Gönder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${
            activeTab === 'assignments'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Verilen Ödevler & Teslimler ({assignments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('classrooms')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${
            activeTab === 'classrooms'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Sınıflar & Öğrenciler ({classrooms.length})</span>
        </button>
      </div>

      {/* Tab 1: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Ödevler yükleniyor...</div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">Henüz Gönderilen Ödev Yok</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Öğrencilerinize proje, uygulama veya araştırma ödevi göndermek için yukarıdaki butonu kullanın.
              </p>
              <button
                onClick={() => setShowAssignmentModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 transition"
              >
                <Plus className="w-4 h-4" />
                <span>İlk Ödevi Oluştur</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-semibold">
                        {assignment.classroom_name}
                      </span>
                      {assignment.due_date && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{new Date(assignment.due_date).toLocaleDateString('tr-TR')}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition line-clamp-2">
                      {assignment.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {assignment.description || 'Açıklama belirtilmemiş.'}
                    </p>

                    {assignment.attachment_path && (
                      <div className="mt-3">
                        <a
                          href={assignment.attachment_path}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Ek Dosya: {assignment.attachment_filename}</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div>
                        <span className="font-bold text-slate-200">{assignment.submission_count}</span> Teslim
                      </div>
                      <div className="text-slate-600">•</div>
                      <div>
                        <span className="font-bold text-emerald-400">{assignment.graded_count}</span> Puanlandı
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id, assignment.title)}
                        title="Ödevi Sil"
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenSubmissions(assignment)}
                        className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <span>İncele & Puanla</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classrooms.map((cls) => (
              <div
                key={cls.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                      {cls.grade_level || 'Bilişim'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {cls.student_count} Öğrenci
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">{cls.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {cls.description || 'Açıklama girilmemiş.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {cls.assignment_count} Aktif Ödev
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      title="Sınıfı Sil"
                      className="px-2.5 py-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Sil</span>
                    </button>
                    <button
                      onClick={() => handleOpenStudentModal(cls.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Öğrencileri Yönet</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Yeni Sınıf Aç */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowClassModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white mb-1">Yeni Sınıf Oluştur</h2>
            <p className="text-xs text-slate-400 mb-5">
              Bilişim Teknolojileri alanına ait yeni bir ders veya sınıf açın.
            </p>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sınıf / Şube Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 11-B Web Programlama"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sınıf Seviyesi</label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="9. Sınıf">9. Sınıf (Temel Bilişim)</option>
                  <option value="10. Sınıf">10. Sınıf</option>
                  <option value="11. Sınıf">11. Sınıf</option>
                  <option value="12. Sınıf">12. Sınıf (İleri / Proje)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Açıklama (Opsiyonel)</label>
                <textarea
                  rows="3"
                  placeholder="Ders hakkında kısa bilgi..."
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Sınıfı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Öğrencileri Yönet & Yeni Öğrenci Ekle */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {selectedClass?.name} — Öğrenci Yönetimi
                </h2>
                <p className="text-xs text-slate-400">
                  Öğrencilere kullanıcı adı ve şifre tanımlayarak bu sınıfa kaydedin.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteClass(selectedClassId, selectedClass?.name);
                    setShowStudentModal(false);
                  }}
                  className="px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sınıfı Sil</span>
                </button>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 overflow-y-auto">
              {/* Form: Add Student */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4" />
                  <span>Yeni Öğrenci Hesabı Aç</span>
                </h3>
                <form onSubmit={handleAddStudent} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Caner Deniz"
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Okul / Öğrenci No</label>
                    <input
                      type="text"
                      placeholder="Örn: 1045"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Kullanıcı Adı (Giriş İçin)</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: caner1045"
                      value={studentUsername}
                      onChange={(e) => setStudentUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Giriş Şifresi</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: 123456"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
                  >
                    Öğrenciyi Ekle & Şifreyi Kaydet
                  </button>
                </form>
              </div>

              {/* Student List */}
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center justify-between">
                  <span>Kayıtlı Öğrenciler ({classStudents.length})</span>
                </h3>

                {loadingStudents ? (
                  <div className="text-center py-8 text-xs text-slate-500">Öğrenciler yükleniyor...</div>
                ) : classStudents.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                    Bu sınıfa henüz öğrenci eklenmemiş.
                  </div>
                ) : (
                  <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
                    {classStudents.map((st) => (
                      <div
                        key={st.id}
                        className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-100">{st.full_name}</div>
                          <div className="text-[11px] text-slate-400">
                            Kullanıcı Adı: <span className="text-cyan-400 font-mono">{st.username}</span>
                            {st.student_number && ` • No: ${st.student_number}`}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveStudent(st.id)}
                          title="Sınıftan Çıkar"
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal: Yeni Ödev Gönder */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowAssignmentModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white mb-1">Yeni Ödev Gönder</h2>
            <p className="text-xs text-slate-400 mb-5">
              Seçtiğiniz sınıftaki öğrencilere yönerge ve teslim tarihi ile ödev atayın.
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hedef Sınıf</label>
                <select
                  required
                  value={assignClassId}
                  onChange={(e) => setAssignClassId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.grade_level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ödev Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: CSS Grid İle Responsive Sayfa Tasarımı"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ödev Açıklaması ve Yönergeler</label>
                <textarea
                  rows="4"
                  placeholder="Öğrencilerin yapması gerekenler, kurallar, teslim kriterleri..."
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Son Teslim Tarihi</label>
                  <input
                    type="datetime-local"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ek Dosya (PDF / Kod / ZIP)</label>
                  <input
                    type="file"
                    onChange={(e) => setAssignFile(e.target.files[0])}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Ödevi Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ödev Teslimlerini İnceleme & Puanlama & Görüş Bildirme */}
      {reviewAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-4xl shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {reviewAssignment.classroom_name}
                </span>
                <h2 className="text-lg font-bold text-white">
                  {reviewAssignment.title} — Teslimatlar ve Değerlendirme
                </h2>
              </div>
              <button
                onClick={() => setReviewAssignment(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 space-y-4">
              {loadingSubmissions ? (
                <div className="text-center py-12 text-xs text-slate-500">Teslimler yükleniyor...</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800 p-8">
                  <Clock className="w-10 h-10 text-amber-500/50 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">Henüz Bu Ödevi Teslim Eden Öğrenci Yok</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Öğrenciler portallarından dosya yükleyip teslim ettikçe burada listelenecektir.
                  </p>
                </div>
              ) : (
                submissions.map((sub) => {
                  const state = gradingState[sub.id] || { grade: '', feedback: '', saving: false, success: false };
                  return (
                    <div
                      key={sub.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4"
                    >
                      {/* Top Student Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 text-sm">{sub.student_name}</span>
                            <span className="text-xs text-slate-400 font-mono">(@{sub.student_username})</span>
                            {sub.student_number && (
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                No: {sub.student_number}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Teslim Zamanı: {new Date(sub.submitted_at).toLocaleString('tr-TR')}
                          </span>
                        </div>

                        {sub.file_path && (
                          <a
                            href={sub.file_path}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition"
                          >
                            <Download className="w-4 h-4" />
                            <span>Ödev Dosyasını İndir ({sub.file_name || 'Dosya'})</span>
                          </a>
                        )}
                      </div>

                      {/* Student's Note */}
                      {sub.student_note && (
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                            Öğrencinin Notu:
                          </span>
                          <p className="text-xs text-slate-200">{sub.student_note}</p>
                        </div>
                      )}

                      {/* Teacher Grading and Feedback Section */}
                      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                          <Award className="w-4 h-4" />
                          <span>Öğretmen Değerlendirmesi ve Notu</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-start">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-400 mb-1">
                              Puan (0 - 100)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Örn: 90"
                              value={state.grade}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGradingState(prev => ({
                                  ...prev,
                                  [sub.id]: { ...prev[sub.id], grade: val }
                                }));
                              }}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-medium text-slate-400 mb-1">
                              Öğretmen Görüşü / Geri Bildirim
                            </label>
                            <textarea
                              rows="2"
                              placeholder="Öğrencinin çalışması hakkında yorumunuz, eksikler veya tebrik notu..."
                              value={state.feedback}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGradingState(prev => ({
                                  ...prev,
                                  [sub.id]: { ...prev[sub.id], feedback: val }
                                }));
                              }}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            ></textarea>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-slate-500">
                            {sub.graded_at ? `Son güncelleme: ${new Date(sub.graded_at).toLocaleString('tr-TR')}` : 'Henüz puanlanmadı'}
                          </span>
                          <div className="flex items-center gap-2">
                            {state.success && (
                              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Kaydedildi!
                              </span>
                            )}
                            <button
                              onClick={() => handleSaveGrade(sub.id)}
                              disabled={state.saving}
                              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-50"
                            >
                              {state.saving ? 'Kaydediliyor...' : 'Puanı ve Görüşü Kaydet'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
