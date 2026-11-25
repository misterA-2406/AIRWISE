import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, ShieldAlert, Wind, Calendar, Users, Settings2 } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotifDrawerOpen, 
    setIsNotifDrawerOpen, 
    notifications, 
    markNotifRead, 
    markAllNotifsRead,
    unreadNotifsCount 
  } = useApp();

  if (!isNotifDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#07110E]/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotifDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0B1914] border-l border-[#91B49A]/25 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[#91B49A]/15 bg-[#11231B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#162A20] flex items-center justify-center text-[#C7F36B]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F0F3EA] font-interface">
                Air Reminders & Advisories
              </h3>
              <p className="text-[11px] text-[#A3B1A6]">
                {unreadNotifsCount} unread proactive environmental alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadNotifsCount > 0 && (
              <button
                onClick={markAllNotifsRead}
                className="text-[11px] font-mono text-[#C7F36B] hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => setIsNotifDrawerOpen(false)}
              className="p-1.5 rounded-lg text-[#A3B1A6] hover:text-[#F0F3EA] hover:bg-[#162A20] transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-[#65736A]">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No active environmental notifications.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const isAlert = item.severity === 'alert';
              return (
                <div
                  key={item.id}
                  onClick={() => markNotifRead(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    item.read
                      ? 'bg-[#11231B]/60 border-[#91B49A]/10 opacity-75'
                      : isAlert
                      ? 'bg-[#11231B] border-[#F28B36]/40 shadow-sm'
                      : 'bg-[#11231B] border-[#C7F36B]/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {item.type === 'peak_alert' && (
                        <ShieldAlert className="w-4 h-4 text-[#F28B36]" />
                      )}
                      {item.type === 'ventilation' && (
                        <Wind className="w-4 h-4 text-[#C7F36B]" />
                      )}
                      {item.type === 'plan_ready' && (
                        <Calendar className="w-4 h-4 text-[#3DD68C]" />
                      )}
                      {item.type === 'community' && (
                        <Users className="w-4 h-4 text-[#91B49A]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-semibold text-[#F0F3EA] truncate">
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-[#C7F36B] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#A3B1A6] mt-1 leading-relaxed">
                        {item.message}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#91B49A]/10 text-[10px] font-mono text-[#65736A]">
                        <span>{item.time}</span>
                        <span className="text-[#91B49A] hover:underline">
                          Tap to acknowledge
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#11231B] border-t border-[#91B49A]/15 text-xs text-[#A3B1A6] flex items-center justify-between">
          <span className="text-[11px] font-mono">Notification Frequency: Smart Thresholds</span>
          <span className="text-[11px] text-[#C7F36B] flex items-center gap-1 font-mono">
            <Settings2 className="w-3 h-3" />
            Configured
          </span>
        </div>
      </div>
    </div>
  );
};
