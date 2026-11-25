import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Activity, 
  Sliders, 
  Menu, 
  X,
  Clock,
  Home,
  Users,
  UserCheck
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { completedActionsCount } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const primaryItems = [
    { to: '/app', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/app/today', label: 'Plan', icon: CalendarCheck, badge: completedActionsCount },
    { to: '/app/what-if', label: 'What-if', icon: Sliders },
    { to: '/app/air-intelligence', label: 'Air Intel', icon: Activity },
  ];

  const secondaryItems = [
    { to: '/app/my-routine', label: 'My Routine & Schedule', icon: Clock },
    { to: '/app/indoor', label: 'Indoor Air Coach', icon: Home },
    { to: '/app/community', label: 'Community Missions', icon: Users },
    { to: '/app/profile', label: 'Personalization & Settings', icon: UserCheck },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1914]/95 backdrop-blur-md border-t border-[#91B49A]/20 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {primaryItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `
                flex flex-col items-center justify-center w-16 py-1 text-[10px] font-medium transition-colors relative
                ${isActive ? 'text-[#C7F36B] font-bold' : 'text-[#A3B1A6]'}
              `}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="absolute top-1 right-2.5 w-3.5 h-3.5 rounded-full bg-[#C7F36B] text-[#07110E] text-[9px] font-bold flex items-center justify-center font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* More Drawer Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center justify-center w-16 py-1 text-[10px] font-medium text-[#A3B1A6] hover:text-[#F0F3EA]"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Secondary Drawer */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div 
            className="fixed inset-0 bg-[#07110E]/80 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative bg-[#11231B] border-t border-[#91B49A]/30 rounded-t-3xl p-6 shadow-2xl z-10 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#91B49A]/15">
              <span className="text-xs font-mono uppercase text-[#A3B1A6] tracking-wider">
                Additional Modules
              </span>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-lg text-[#A3B1A6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {secondaryItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-3.5 rounded-xl bg-[#0B1914] border border-[#91B49A]/15 flex flex-col items-start gap-2 hover:border-[#C7F36B]/40 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-[#C7F36B]" />
                  <span className="text-xs font-semibold text-[#F0F3EA] text-left leading-tight">
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
