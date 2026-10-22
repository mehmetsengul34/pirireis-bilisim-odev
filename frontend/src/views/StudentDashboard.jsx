import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, CheckCircle2, Clock, Download, Award, 
  MessageSquare, AlertCircle, BookOpen, Sparkles, Send, FileCheck
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

      setSuccessMessage(prev => ({ ...prev, [assignId]: 'Ödeviniz başarıyla yüklendi ve öğretmene iletildi!' }));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Öğrenci Portalı</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Merhaba, {user.full_name}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Bilişim Teknolojileri derslerinize ait ödevleri inceleyin, yaptığınız çalışmaları sisteme yükleyin, öğretmeninizin verdiği puanı ve geri bildirimleri anında görün.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-center min-w-[140px]">
              <span className="text-xs text-slate-500 block">Öğrenci No</span>
              <span className="text-base font-bold text-cyan-400 font-mono">
                {user.student_number || user.username}
              </span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-center min-w-[140px]">
              <span className="text-xs text-slate-500 block">Aktif Ödev Sayısı</span>
              <span className="text-base font-bold text-amber-400">
                {assignments.length} Ödev
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Ders Ödevleri ve Görevler</span>
          </h2>
          <span className="text-xs text-slate-500">
            Toplam {assignments.length} ödev listeleniyor
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500">Ödevler yükleniyor...</div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">Bekleyen Ödeviniz Yok</h3>
            <p className="text-xs text-slate-500 mt-1">
              Öğretmeniniz yeni bir ödev verdiğinde burada listelenecektir.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assignments.map((assignment) => {
              const mySub = assignment.my_submission;
              const hasSubmitted = !!mySub;
              const isGraded = mySub && mySub.grade !== null && mySub.grade !== undefined;

              return (
                <div
                  key={assignment.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 transition"
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
                        {assignment.classroom_name}
                      </span>

                      {/* Status Badge */}
                      {isGraded ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                          <Award className="w-3.5 h-3.5" />
                          <span>Puanlandı: {mySub.grade} / 100</span>
                        </span>
                      ) : hasSubmitted ? (
                        <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Öğretmen İncelemesi Bekleniyor</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium">
                          Teslim Edilmedi
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-2">
                      {assignment.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                      {assignment.description || 'Bu ödev için özel bir açıklama girilmemiş.'}
                    </p>

                    {/* Teacher's Attachment */}
                    {assignment.attachment_path && (
                      <div className="mt-3">
                        <a
                          href={getFileUrl(assignment.attachment_path)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 transition"
                        >
                          <Download className="w-4 h-4" />
                          <span>Öğretmenin Eklediği Belgeyi İndir ({assignment.attachment_filename})</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Teacher Feedback Card (If Graded!) */}
                  {isGraded && (
                    <div className="bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                          <Award className="w-4 h-4" />
                          <span>Öğretmen Değerlendirmesi</span>
                        </div>
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          {mySub.grade} <span className="text-xs text-slate-400 font-sans">/ 100</span>
                        </span>
                      </div>

                      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                        <span className="text-[11px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Öğretmen Görüşü / Notu:</span>
                        </span>
                        <p className="text-xs text-slate-200 italic leading-relaxed">
                          "{mySub.feedback || 'Öğretmen ek bir görüş belirtmedi, tebrikler!'}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submission Info or Upload Form */}
                  <div className="border-t border-slate-800 pt-4">
                    {hasSubmitted && (
                      <div className="mb-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-emerald-400 flex items-center gap-1">
                            <FileCheck className="w-4 h-4" />
                            <span>Ödeviniz Teslim Edildi</span>
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Tarih: {new Date(mySub.submitted_at).toLocaleString('tr-TR')}
                          </span>
                        </div>

                        {mySub.file_path && (
                          <a
                            href={mySub.file_path}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Yüklediğim Dosya</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Homework Upload Box */}
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                      <span className="text-xs font-bold text-slate-200 block">
                        {hasSubmitted ? 'Ödevinizi Güncellemek / Yeniden Yüklemek İster misiniz?' : 'Ödevinizi Sisteme Yükleyin:'}
                      </span>

                      <div>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(assignment.id, e.target.files[0])}
                          className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-300 hover:file:bg-cyan-500/20 cursor-pointer"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Öğretmene iletmek istediğiniz not (opsiyonel)..."
                          value={studentNotes[assignment.id] || ''}
                          onChange={(e) => handleNoteChange(assignment.id, e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {successMessage[assignment.id] && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{successMessage[assignment.id]}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleSubmitHomework(assignment.id)}
                        disabled={submitting[assignment.id]}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                      >
                        {submitting[assignment.id] ? (
                          <span>Yükleniyor...</span>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>{hasSubmitted ? 'Ödevi Güncelle & Tekrar Gönder' : 'Ödevi Yükle ve Teslim Et'}</span>
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
