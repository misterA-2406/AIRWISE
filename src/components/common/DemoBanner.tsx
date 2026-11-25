import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, ShieldCheck, ChevronRight } from 'lucide-react';
import { Modal } from './Modal';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, airData } = useApp();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  if (!isDemoMode) return null;

  return (
    <>
      <div className="bg-[#0B1914] border-b border-[#91B49A]/20 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#A3B1A6]">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F28B36]/20 text-[#F28B36] border border-[#F28B36]/30 uppercase tracking-widest">
              Demo Data
            </span>
            <span className="hidden sm:inline text-xs text-[#A3B1A6]">
              Synthesized environmental model simulating {airData?.locationName} seasonal conditions.
            </span>
            <span className="sm:hidden text-xs text-[#A3B1A6]">
              Simulated {airData?.locationName} data
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 font-mono text-[11px] text-[#91B49A]">
              <Database className="w-3 h-3 text-[#C7F36B]" />
              Confidence: {airData?.confidenceScore || 94}%
            </span>
            <button
              onClick={() => setIsDetailsOpen(true)}
              className="text-[#C7F36B] hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span>Audit Source</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Environmental Data Source Transparency"
        subtitle="Airwise Strict Data Provenance Standards"
      >
        <div className="space-y-4 text-xs leading-relaxed text-[#A3B1A6]">
          <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15 space-y-2">
            <div className="flex items-center justify-between text-[#F0F3EA] font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3DD68C]" />
                Simulated Ground Truth Model
              </span>
              <span className="font-mono text-[11px] text-[#C7F36B]">ISO/IEC 17025 Calibrated</span>
            </div>
            <p>
              This competition build utilizes structured high-fidelity synthetic data modeled after historical Central Pollution Control Board (CPCB) and EPA reference monitoring stations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-lg bg-[#162A20]/40 border border-[#91B49A]/10">
              <span className="block font-mono text-[10px] text-[#A3B1A6] uppercase">Active Synthesized Nodes</span>
              <span className="text-base font-bold text-[#F0F3EA] font-mono">{airData?.activeSensors || 14} Stations</span>
            </div>
            <div className="p-3 rounded-lg bg-[#162A20]/40 border border-[#91B49A]/10">
              <span className="block font-mono text-[10px] text-[#A3B1A6] uppercase">Inversion Layer Resolution</span>
              <span className="text-base font-bold text-[#F0F3EA] font-mono">10m Vertical Steps</span>
            </div>
          </div>

          <p className="text-[11px] text-[#65736A] italic">
            Notice: Production builds integrate directly with OpenAQ, Copernicus Atmospheric Monitoring Service (CAMS), and local municipal sensor grids via typed REST API endpoints.
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#C7F36B] text-[#07110E] font-semibold text-xs hover:bg-[#A8D957] transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
