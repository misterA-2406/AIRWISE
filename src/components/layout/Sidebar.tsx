import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Activity, 
  Clock, 
  Home, 
  Sliders, 
  Users, 
  UserCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { completedActionsCount, totalActionsCount, setIsAIDrawerOpen } = useApp();

  const navItems = [
    { to: '/app', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/app/today', label: "Today's Plan", icon: CalendarCheck, badge: `${completedActionsCount}/${totalActionsCount}` },
    { to: '/app/air-intelligence', label: 'Air Intelligence', icon: Activity },
    { to: '/app/my-routine', label: 'My Routine', icon: Clock },
    { to: '/app/indoor', label: 'Indoor Air', icon: Home },
    { to: '/app/what-if', label: 'What-if Lab', icon: Sliders, highlight: true },
    { to: '/app/community', label: 'Community', icon: Users },
    { to: '/app/profile', label: 'Profile & Settings', icon: UserCheck },
  ];

  const progressPercent = totalActionsCount > 0 ? Math.round((completedActionsCount / totalActionsCount) * 100) : 0;

  return (
    <aside className="w-64 bg-[#0B1914] border-r border-[#91B49A]/15 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex flex-col justify-between p-4 overflow-y-auto">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase text-[#A3B1A6]/80 tracking-widest">
          Decision System
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `
              flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group
              ${isActive 
                ? 'bg-[#162A20] text-[#C7F36B] font-semibold shadow-sm border border-[#C7F36B]/25' 
                : 'text-[#A3B1A6] hover:text-[#F0F3EA] hover:bg-[#11231B]'
              }
              ${item.highlight && !location.pathname.includes('what-if') ? 'relative' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#11231B] text-[#91B49A] border border-[#91B49A]/15">
                {item.badge}
              </span>
            )}

            {item.highlight && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#C7F36B]/20 text-[#C7F36B] border border-[#C7F36B]/30 uppercase">
                Core
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Health & Daily Resilience Widget */}
      <div className="pt-4 border-t border-[#91B49A]/15 space-y-3">
        <div className="p-3.5 rounded-2xl bg-[#11231B] border border-[#91B49A]/20">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 text-[#F0F3EA] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#3DD68C]" />
              Day Protection
            </span>
            <span className="font-mono text-[11px] text-[#C7F36B]">
              {progressPercent}%
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-1.5 rounded-full bg-[#07110E] overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-[#5D9279] to-[#C7F36B] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[10px] text-[#A3B1A6] leading-tight">
            {completedActionsCount} of {totalActionsCount} protective actions enacted today.
          </p>
        </div>

        {/* AI Quick Callout */}
        <button
          onClick={() => setIsAIDrawerOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#162A20] to-[#11231B] hover:from-[#1D3529] hover:to-[#162A20] border border-[#C7F36B]/25 text-[#C7F36B] text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Airwise Copilot</span>
        </button>
      </div>
    </aside>
  );
};
