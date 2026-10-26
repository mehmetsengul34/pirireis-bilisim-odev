import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, CheckCircle2, Clock, Download, Award, 
  MessageSquare, BookOpen, FileCheck
} from 'lucide-react';
import { assignmentService, submissionService, getFileUrl } from '../services/api';

export default function StudentDashboard({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submission State per assignment
  const [uploadFiles, setUploadFiles] = useState({}); // { [assignId]: File }
  const [studentNotes, setStudentNotes] = useState({}); // { [assignId]: string }
  const [submitting, setSubmitting] = useState({}); // { [assignId]: boolean }
  const [successMessage, setSuccessMessage] = useState({}); // { [assignId]: string }

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const list = await assignmentService.list();
      setAssignments(list);
    } catch (err) {
      console.error('Ödevler yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

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

      // Refresh to show updated submission
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.detail || 'Ödev teslim edilirken bir hata oluştu.');
    } finally {
      setSubmitting(prev => ({ ...prev, [assignId]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium mb-2 border border-zinc-200 dark:border-zinc-700">
              <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>Öğrenci Portalı</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Merhaba, {user.full_name}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Bilişim derslerinize ait ödevleri inceleyin, çalışmalarınızı yükleyin ve öğretmeninizin değerlendirmesini takip edin.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-3 text-center min-w-[120px]">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Öğrenci No</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                {user.student_number || user.username}
              </span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-3 text-center min-w-[120px]">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Aktif Ödev</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {assignments.length} Ödev
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Section */}
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

        {loading ? (
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
                  {/* Top Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700">
                        {assignment.classroom_name}
                      </span>

                      {/* Status Badge */}
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

                    {/* Teacher's Attachment */}
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

                  {/* Teacher Feedback Card (If Graded!) */}
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

                  {/* Submission Info or Upload Form */}
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

                    {/* Homework Upload Box */}
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
    </div>
  );
}
