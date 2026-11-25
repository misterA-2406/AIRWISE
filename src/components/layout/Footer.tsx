import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, Shield, HeartHandshake, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#91B49A]/15 bg-[#07110E] text-[#A3B1A6] py-12 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 text-[#F0F3EA]">
            <Wind className="w-5 h-5 text-[#C7F36B]" />
            <span className="font-editorial text-lg font-bold tracking-wide">AIRWISE</span>
          </div>
          <p className="text-xs text-[#A3B1A6] leading-relaxed">
            Personal Air Intelligence. Transforming raw environmental telemetry into actionable everyday health decisions.
          </p>
          <div className="text-[11px] font-mono text-[#65736A]">
            "Understand your air. Adapt your day. Protect your people."
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-mono uppercase text-[#F0F3EA] tracking-wider mb-3">
            Platform Modules
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/app" className="hover:text-[#C7F36B] transition-colors">Overview Dashboard</Link></li>
            <li><Link to="/app/today" className="hover:text-[#C7F36B] transition-colors">Today’s Air Plan</Link></li>
            <li><Link to="/app/what-if" className="hover:text-[#C7F36B] transition-colors">What-if Decision Simulator</Link></li>
            <li><Link to="/app/air-intelligence" className="hover:text-[#C7F36B] transition-colors">Air Intelligence & Radar</Link></li>
            <li><Link to="/app/indoor" className="hover:text-[#C7F36B] transition-colors">Indoor Air Coach</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-mono uppercase text-[#F0F3EA] tracking-wider mb-3">
            Public Good & Safety
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/app/community" className="hover:text-[#C7F36B] transition-colors">Community Missions</Link></li>
            <li><Link to="/app/my-routine" className="hover:text-[#C7F36B] transition-colors">Lifestyle Routine Calibration</Link></li>
            <li><Link to="/app/profile" className="hover:text-[#C7F36B] transition-colors">Vulnerable Family Profiles</Link></li>
            <li className="text-[#65736A]">EPA & CPCB Telemetry Sync</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-[11px] font-mono uppercase text-[#F0F3EA] tracking-wider mb-1">
            Data Ethics & Medical Disclaimer
          </h4>
          <p className="text-[11px] text-[#65736A] leading-relaxed">
            AIRWISE offers environmental decision assistance based on atmospheric modeling. It is not intended to provide clinical diagnosis or supersede physician directives for chronic pulmonary conditions.
          </p>
          <div className="text-[10px] font-mono text-[#91B49A]">
            AIRWISE Climate Intelligence • Competition Build 2026
          </div>
        </div>
      </div>
    </footer>
  );
};
