import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Wind, 
  MapPin, 
  Bell, 
  Sparkles, 
  ChevronDown, 
  Check, 
  Menu, 
  X
} from 'lucide-react';
import { RiskBadge } from '../visual/RiskBadge';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  const { 
    locations, 
    currentLocationId, 
    setLocation, 
    airData,
    unreadNotifsCount,
    setIsNotifDrawerOpen,
    setIsAIDrawerOpen
  } = useApp();

  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeLoc = locations.find(l => l.id === currentLocationId) || locations[0];

  return (
    <header className="sticky top-0 z-40 bg-[#07110E]/90 backdrop-blur-md border-b border-[#91B49A]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand logo & tagline */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#11231B] border border-[#C7F36B]/40 flex items-center justify-center text-[#C7F36B] shadow-inner group-hover:border-[#C7F36B] transition-colors">
              <Wind className="w-4 h-4 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-editorial text-xl font-bold tracking-wider text-[#F0F3EA] uppercase">
                  Airwise
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
              </div>
              <span className="block text-[9px] font-mono tracking-widest text-[#A3B1A6] uppercase -mt-1 hidden sm:block">
                Personal Air Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Global Context Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Location Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#11231B] border border-[#91B49A]/20 hover:border-[#91B49A]/40 text-xs text-[#F0F3EA] transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C7F36B]" />
              <div className="text-left hidden xs:block">
                <span className="font-medium">{activeLoc?.name || 'Delhi NCR'}</span>
              </div>
              {airData && (
                <RiskBadge level={airData.riskLevel} label={`${airData.aqi} AQI`} size="sm" showDot={false} />
              )}
              <ChevronDown className="w-3 h-3 text-[#A3B1A6]" />
            </button>

            {isLocDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsLocDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#11231B] border border-[#91B49A]/30 p-2 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-[#A3B1A6] tracking-wider border-b border-[#91B49A]/10 mb-1">
                    Select Environmental Station
                  </div>
                  <div className="space-y-1">
                    {locations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setLocation(loc.id);
                          setIsLocDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                          loc.id === currentLocationId
                            ? 'bg-[#162A20] text-[#C7F36B] font-semibold'
                            : 'hover:bg-[#162A20]/60 text-[#F0F3EA]'
                        }`}
                      >
                        <div className="text-left">
                          <div>{loc.name}</div>
                          <div className="text-[10px] text-[#A3B1A6] truncate max-w-[130px]">
                            {loc.subArea}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RiskBadge level={loc.riskLevel} label={`${loc.aqi}`} size="sm" showDot={false} />
                          {loc.id === currentLocationId && (
                            <Check className="w-3.5 h-3.5 text-[#C7F36B]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Copilot Trigger */}
          <button
            onClick={() => setIsAIDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C7F36B]/15 hover:bg-[#C7F36B]/25 border border-[#C7F36B]/40 text-[#C7F36B] text-xs font-semibold transition-all hover:scale-[1.02]"
            title="Open Contextual AI Copilot"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Airwise Copilot</span>
          </button>

          {/* Notification Center Trigger */}
          <button
            onClick={() => setIsNotifDrawerOpen(true)}
            className="relative p-2 rounded-xl bg-[#11231B] border border-[#91B49A]/20 hover:bg-[#162A20] text-[#A3B1A6] hover:text-[#F0F3EA] transition-colors"
            aria-label="Environmental notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E64848] text-[#F0F3EA] text-[10px] font-bold flex items-center justify-center font-mono">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Enter App or Landing link */}
          {!isAppRoute ? (
            <Link
              to="/app"
              className="px-4 py-1.5 rounded-xl bg-[#C7F36B] hover:bg-[#A8D957] text-[#07110E] text-xs font-bold transition-all shadow-md hidden sm:inline-block"
            >
              Enter App
            </Link>
          ) : (
            <Link
              to="/"
              className="px-3 py-1.5 rounded-xl bg-[#162A20] hover:bg-[#1D3529] text-[#A3B1A6] hover:text-[#F0F3EA] text-xs transition-colors hidden md:inline-block"
            >
              Public Vision
            </Link>
          )}

          {/* Mobile menu hamburger (for landing navigation) */}
          {!isAppRoute && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-[#A3B1A6] hover:text-[#F0F3EA]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Landing Menu dropdown */}
      {isMobileMenuOpen && !isAppRoute && (
        <div className="sm:hidden border-t border-[#91B49A]/15 bg-[#0B1914] p-4 space-y-3">
          <Link
            to="/app"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full block py-2.5 px-4 rounded-xl bg-[#C7F36B] text-[#07110E] text-center font-bold text-sm"
          >
            Launch Airwise Platform
          </Link>
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-[#A3B1A6]">
            <a href="#why-aqi" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded bg-[#11231B]">
              Air Is Not a Number
            </a>
            <a href="#decision-impact" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded bg-[#11231B]">
              Everyday Decisions
            </a>
            <a href="#day-recalculated" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded bg-[#11231B]">
              Day Recalculated
            </a>
            <a href="#community-preview" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded bg-[#11231B]">
              Community Missions
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
