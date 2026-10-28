import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, Check, CheckCheck, Send, BookOpen, Award, AlertCircle, 
  MessageSquare, X, ChevronRight, Sparkles 
} from 'lucide-react';
import { notificationService, classroomService } from '../services/api';

export default function NotificationCenter({ user, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Send notification form states
  const [targetClassId, setTargetClassId] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [sending, setSending] = useState(false);

  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.list();
      setNotifications(data);
    } catch (err) {
      console.error('Bildirimler yüklenemedi:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenSendModal = async () => {
    setShowSendModal(true);
    setIsOpen(false);
    try {
      const classes = await classroomService.list();
      setClassrooms(classes);
      if (classes.length > 0 && !targetClassId) {
        setTargetClassId(classes[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    setSending(true);
    try {
      await notificationService.send({
        classroom_id: targetClassId ? parseInt(targetClassId, 10) : null,
        title: notifTitle,
        message: notifMessage,
        notification_type: 'general'
      });
      setShowSendModal(false);
      setNotifTitle('');
      setNotifMessage('');
      fetchNotifications();
      alert('Bildirim başarıyla gönderildi!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Bildirim gönderilemedi.');
    } finally {
      setSending(false);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'exam_assigned':
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case 'exam_graded':
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Bildirimler"
        className="relative p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition flex items-center justify-center border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Drawer Dropdown */}
      {isOpen && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[520px] transition-all">
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Bildirimler</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full">
                  {unreadCount} yeni
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Tümünü Okundu Say"
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs flex items-center gap-1 transition"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden sm:inline">Tümünü Oku</span>
                </button>
              )}
              {user.role === 'teacher' && (
                <button
                  onClick={handleOpenSendModal}
                  title="Yeni Bildirim Gönder"
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg text-[11px] font-medium flex items-center gap-1 transition"
                >
                  <Send className="w-3 h-3" />
                  <span>Gönder</span>
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-xs">
                Henüz hiç bildiriminiz bulunmuyor.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    handleMarkAsRead(notif.id);
                    if (onNavigate && notif.link_path) {
                      onNavigate(notif.link_path);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition flex items-start gap-3 ${
                    !notif.is_read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    {getNotifIcon(notif.notification_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        {new Date(notif.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      <p className={`whitespace-pre-wrap break-words ${
                        expandedId === notif.id || notif.message.length <= 130 ? '' : 'line-clamp-3'
                      }`}>
                        {notif.message}
                      </p>
                      {notif.message.length > 130 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(prev => prev === notif.id ? null : notif.id);
                          }}
                          className="mt-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                        >
                          {expandedId === notif.id ? 'Daha az göster' : 'Tamamını Gör'}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-400">
                      <span>{notif.sender_name}</span>
                      {notif.classroom_name && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-zinc-500 dark:text-zinc-300">{notif.classroom_name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {!notif.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      title="Okundu olarak işaretle"
                      className="p-1 text-zinc-400 hover:text-indigo-600 rounded-md transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Send Notification Modal (Teacher Only) */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-500" />
                Öğrencilere Bildirim Gönder
              </h3>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Hedef Sınıf
                </label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Tüm Sınıflar ve Öğrenciler</option>
                  {classrooms.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.grade_level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Bildirim Başlığı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: YKS Matematik Denemesi Yayında!"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Bildirim Mesajı
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Öğrencilerinize iletmek istediğiniz detaylı duyuru, hatırlatma veya motivasyon mesajı..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 flex items-center gap-1.5 transition"
                >
                  {sending ? 'Gönderiliyor...' : 'Bildirimi İlet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
