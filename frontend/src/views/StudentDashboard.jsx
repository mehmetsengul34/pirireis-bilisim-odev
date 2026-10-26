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
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium mb-2 border border-zinc-200">
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span>Öğrenci Portalı</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Merhaba, {user.full_name}
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Bilişim derslerinize ait ödevleri inceleyin, çalışmalarınızı yükleyin ve öğretmeninizin değerlendirmesini takip edin.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center min-w-[120px]">
              <span className="text-[11px] text-zinc-500 block">Öğrenci No</span>
              <span className="text-sm font-semibold text-zinc-900 font-mono">
                {user.student_number || user.username}
              </span>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center min-w-[120px]">
              <span className="text-[11px] text-zinc-500 block">Aktif Ödev</span>
              <span className="text-sm font-semibold text-zinc-900">
                {assignments.length} Ödev
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-600" />
            <span>Ders Ödevleri ve Görevler</span>
          </h2>
          <span className="text-xs text-zinc-400">
            Toplam {assignments.length} ödev
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-zinc-400">Ödevler yükleniyor...</div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-16 bg-white border border-zinc-200 rounded-2xl p-8">
            <CheckCircle2 className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-zinc-900">Bekleyen Ödeviniz Yok</h3>
            <p className="text-xs text-zinc-500 mt-1">
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
                  className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5 transition"
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-medium border border-zinc-200">
                        {assignment.classroom_name}
                      </span>

                      {/* Status Badge */}
                      {isGraded ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>Puan: {mySub.grade} / 100</span>
                        </span>
                      ) : hasSubmitted ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>İnceleme Bekleniyor</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium">
                          Teslim Edilmedi
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-zinc-900 mb-1.5">
                      {assignment.title}
                    </h3>

                    <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                      {assignment.description || 'Bu ödev için özel bir açıklama girilmemiş.'}
                    </p>

                    {/* Teacher's Attachment */}
                    {assignment.attachment_path && (
                      <div className="mt-2.5">
                        <a
                          href={getFileUrl(assignment.attachment_path)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-900 font-medium bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200 transition"
                        >
                          <Download className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Öğretmenin Eklediği Belgeyi İndir ({assignment.attachment_filename})</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Teacher Feedback Card (If Graded!) */}
                  {isGraded && (
                    <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                          <Award className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Öğretmen Değerlendirmesi</span>
                        </div>
                        <span className="text-base font-bold text-emerald-800 font-mono">
                          {mySub.grade} <span className="text-xs text-emerald-600 font-sans">/ 100</span>
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-2.5 border border-emerald-200/60">
                        <span className="text-[11px] font-medium text-zinc-500 block mb-0.5 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-zinc-400" />
                          <span>Geri Bildirim:</span>
                        </span>
                        <p className="text-xs text-zinc-800 italic leading-relaxed">
                          "{mySub.feedback || 'Öğretmen ek bir görüş belirtmedi, tebrikler!'}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submission Info or Upload Form */}
                  <div className="border-t border-zinc-100 pt-3.5">
                    {hasSubmitted && (
                      <div className="mb-3 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-medium text-emerald-700 flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Ödeviniz Teslim Edildi</span>
                          </span>
                          <span className="text-[11px] text-zinc-400 block mt-0.5">
                            Tarih: {new Date(mySub.submitted_at).toLocaleString('tr-TR')}
                          </span>
                        </div>

                        {mySub.file_path && (
                          <a
                            href={mySub.file_path}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-700 hover:text-zinc-900 font-medium flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Dosyam</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Homework Upload Box */}
                    <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-2.5">
                      <span className="text-xs font-semibold text-zinc-800 block">
                        {hasSubmitted ? 'Ödevinizi Güncellemek / Yeniden Yüklemek İster misiniz?' : 'Ödevinizi Sisteme Yükleyin:'}
                      </span>

                      <div>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(assignment.id, e.target.files[0])}
                          className="w-full text-xs text-zinc-500 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-zinc-200 file:text-zinc-800 hover:file:bg-zinc-300 cursor-pointer"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Öğretmene iletmek istediğiniz not (opsiyonel)..."
                          value={studentNotes[assignment.id] || ''}
                          onChange={(e) => handleNoteChange(assignment.id, e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
                        />
                      </div>

                      {successMessage[assignment.id] && (
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{successMessage[assignment.id]}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleSubmitHomework(assignment.id)}
                        disabled={submitting[assignment.id]}
                        className="w-full py-2 px-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
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
