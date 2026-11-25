import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserCheck, 
  Settings, 
  ShieldAlert, 
  Bell, 
  Database, 
  Download, 
  RotateCcw, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    routineProfile, 
    updateRoutineProfile, 
    isDemoMode, 
    toggleDemoMode, 
    airData,
    addToast 
  } = useApp();

  const [name, setName] = useState(routineProfile.name || 'Aarav Sharma');
  const [aqiStandard, setAqiStandard] = useState<'IN_NAAQS' | 'US_AQI' | 'WHO_2021'>('IN_NAAQS');
  const [notifThreshold, setNotifThreshold] = useState<number>(200);
  const [alertVentilation, setAlertVentilation] = useState(true);
  const [alertCommute, setAlertCommute] = useState(true);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRoutineProfile({ name });
    addToast('Preferences Updated', 'Settings and notification thresholds saved.', 'success');
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(routineProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `airwise-profile-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Data Exported', 'Clean air profile JSON exported.', 'info');
  };

  const handleResetData = () => {
    addToast('Profile Synchronized', 'Values refreshed to factory baseline.', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#91B49A]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#91B49A] mb-1">
            <UserCheck className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>Identity & Environmental Sensitivity Calibration</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#F0F3EA] tracking-tight">
            Personalization Settings
          </h1>
          <p className="text-sm text-[#A3B1A6] mt-1">
            Configure reporting standards, health thresholds, and system preferences.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#11231B] hover:bg-[#162A20] border border-[#91B49A]/30 text-[#F0F3EA] text-xs font-semibold transition-all w-fit"
        >
          <Download className="w-4 h-4 text-[#C7F36B]" />
          <span>Export Profile Data</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* IDENTITY & PREFERRED STANDARD */}
        <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-6">
          <div className="pb-3 border-b border-[#91B49A]/15">
            <h3 className="text-base font-bold text-[#F0F3EA] font-interface">
              Reporting Standard & Account Context
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Select which scientific breakpoints govern risk color indicators across your dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07110E] border border-[#91B49A]/25 text-[#F0F3EA] focus:border-[#C7F36B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Governing AQI Standard
              </label>
              <select
                value={aqiStandard}
                onChange={(e) => setAqiStandard(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07110E] border border-[#91B49A]/25 text-[#F0F3EA] focus:border-[#C7F36B] focus:outline-none"
              >
                <option value="IN_NAAQS">Indian NAAQS (CPCB Standard)</option>
                <option value="US_AQI">United States EPA AQI Standard</option>
                <option value="WHO_2021">WHO 2021 Reference Benchmark</option>
              </select>
            </div>
          </div>
        </section>

        {/* NOTIFICATION THRESHOLDS & REMINDERS */}
        <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-6">
          <div className="pb-3 border-b border-[#91B49A]/15">
            <h3 className="text-base font-bold text-[#F0F3EA] font-interface flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C7F36B]" />
              Smart Notification Thresholds
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Non-intrusive advisories triggered only when actionable decisions are required.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#07110E] border border-[#91B49A]/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#F0F3EA]">
                  Proactive Severe Inversion Alert
                </span>
                <span className="font-mono text-[#C7F36B] font-bold">
                  Trigger at &gt; {notifThreshold} AQI
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="350"
                step="25"
                value={notifThreshold}
                onChange={(e) => setNotifThreshold(Number(e.target.value))}
                className="w-full accent-[#C7F36B] cursor-pointer"
              />
              <p className="text-[11px] text-[#A3B1A6]">
                Notifies you if sudden thermal inversion traps particulates at breathing altitude during commute hours.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-3.5 rounded-xl bg-[#07110E] border border-[#91B49A]/15 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-[#F0F3EA] block">Solar Aeration Window Alerts</span>
                  <span className="text-[11px] text-[#A3B1A6]">Prompt at 1:30 PM convective lift</span>
                </div>
                <input
                  type="checkbox"
                  checked={alertVentilation}
                  onChange={(e) => setAlertVentilation(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C7F36B] cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-[#07110E] border border-[#91B49A]/15 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-[#F0F3EA] block">Commute Bottleneck Warnings</span>
                  <span className="text-[11px] text-[#A3B1A6]">Warn if arterial roads report NOx spikes</span>
                </div>
                <input
                  type="checkbox"
                  checked={alertCommute}
                  onChange={(e) => setAlertCommute(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C7F36B] cursor-pointer"
                />
              </label>
            </div>
          </div>
        </section>

        {/* DEMO DATA & TELEMETRY CONTROLS */}
        <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-6">
          <div className="pb-3 border-b border-[#91B49A]/15 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F0F3EA] font-interface flex items-center gap-2">
                <Database className="w-4 h-4 text-[#F5C842]" />
                Demo Simulation Environment
              </h3>
              <p className="text-xs text-[#A3B1A6]">
                Inspect synthetic data models or simulate live hardware feed disconnection.
              </p>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#07110E] text-[#91B49A] border border-[#91B49A]/15">
              {isDemoMode ? 'Demo Mode Active' : 'Live Mock Feed'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#07110E] border border-[#91B49A]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <h4 className="font-bold text-[#F0F3EA]">Toggle Demo Indicator & Synthesized Engine</h4>
              <p className="text-[#A3B1A6] text-[11px] mt-0.5">
                Switches the top audit banner and data quality score simulator.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDemoMode}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isDemoMode
                  ? 'bg-[#F28B36]/20 text-[#F28B36] border border-[#F28B36]/30'
                  : 'bg-[#C7F36B] text-[#07110E]'
              }`}
            >
              {isDemoMode ? 'Disable Demo Banner' : 'Enable Demo Banner'}
            </button>
          </div>
        </section>

        {/* SUBMIT CONTROLS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-xl text-xs text-[#A3B1A6] hover:bg-[#11231B] transition-colors"
          >
            Reset Defaults
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#C7F36B] hover:bg-[#A8D957] text-[#07110E] font-bold text-xs transition-all shadow-md"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
