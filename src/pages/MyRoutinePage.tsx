import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoutineActivity } from '../types';
import { 
  Clock, 
  Heart, 
  Plus, 
  Trash2, 
  Save
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const MyRoutinePage: React.FC = () => {
  const { routineProfile, updateRoutineProfile, addToast } = useApp();

  const [name] = useState(routineProfile.name || 'Aarav Sharma');
  const [homeLocation, setHomeLocation] = useState(routineProfile.homeLocation || 'South Extension, Delhi');
  const [workLocation, setWorkLocation] = useState(routineProfile.workLocation || 'Cyber Hub / Connaught Place');
  const [primaryTransport, setPrimaryTransport] = useState(routineProfile.primaryTransport || 'Metro');
  const [commuteMinutes, setCommuteMinutes] = useState(routineProfile.commuteMinutes || 38);
  const [exerciseTime] = useState(routineProfile.exerciseTime || 'Evening');
  const [exerciseType] = useState(routineProfile.exerciseType || 'Running');
  
  // Vulnerable members
  const [vulnerable, setVulnerable] = useState(routineProfile.vulnerableMembers || {
    children: true,
    elderly: true,
    asthmaOrAllergies: true,
    cardiacHistory: false
  });

  // Home specifics
  const [homeVentilation, setHomeVentilation] = useState(routineProfile.homeVentilation || 'Cross-ventilation windows');
  const [airPurifierOwned, setAirPurifierOwned] = useState(routineProfile.airPurifierOwned ?? true);
  const [cookingFuel] = useState(routineProfile.cookingFuel || 'LPG Gas');
  const [budgetPreference, setBudgetPreference] = useState(routineProfile.budgetPreference || 'zero-budget');

  // Activities list
  const [activities, setActivities] = useState<RoutineActivity[]>(routineProfile.activities || []);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  // New activity form
  const [newTime, setNewTime] = useState('17:00 - 18:00');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<RoutineActivity['type']>('outdoor');
  const [newLocation, setNewLocation] = useState('');
  const [newTransport] = useState<RoutineActivity['transport']>('Walking');
  const [newFlexible, setNewFlexible] = useState(true);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRoutineProfile({
      name,
      homeLocation,
      workLocation,
      primaryTransport,
      commuteMinutes,
      exerciseTime,
      exerciseType,
      vulnerableMembers: vulnerable,
      homeVentilation,
      airPurifierOwned,
      cookingFuel,
      budgetPreference,
      activities
    });
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const item: RoutineActivity = {
      id: 'act-' + Date.now(),
      time: newTime,
      name: newName,
      type: newType,
      location: newLocation || 'Local Area',
      transport: newTransport,
      isFlexible: newFlexible,
      exposureRisk: newType === 'outdoor' ? 'high' : 'low'
    };

    setActivities((prev) => [...prev, item]);
    setIsAddActivityOpen(false);
    setNewName('');
    setNewLocation('');
    addToast('Activity Added', `Added "${item.name}" to daily schedule.`, 'success');
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    addToast('Activity Removed', 'Timeline updated.', 'info');
  };

  const handleToggleFlexible = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isFlexible: !a.isFlexible } : a))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#91B49A]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#91B49A] mb-1">
            <Clock className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>Lifestyle Modeling & Exposure Sensitivity Calibration</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#F0F3EA] tracking-tight">
            My Routine & Lifestyle Profile
          </h1>
          <p className="text-sm text-[#A3B1A6] mt-1">
            AIRWISE tailors each daily recommendation to your actual transit choices, household members, and schedule flexibility.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7F36B] hover:bg-[#A8D957] text-[#07110E] text-xs font-bold transition-all shadow-md w-fit"
        >
          <Save className="w-4 h-4" />
          <span>Save & Recalculate Day</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* SECTION: TRANSIT & CORE LOCATIONS */}
        <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-6">
          <div className="pb-3 border-b border-[#91B49A]/15">
            <h3 className="text-base font-bold text-[#F0F3EA] font-interface">
              Commute & Geographic Anchors
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Your daily travel vectors determine your peak black-carbon and NOx inhalation load.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Home Neighborhood
              </label>
              <input
                type="text"
                value={homeLocation}
                onChange={(e) => setHomeLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07110E] border border-[#91B49A]/25 text-[#F0F3EA] focus:border-[#C7F36B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Work / Campus Destination
              </label>
              <input
                type="text"
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07110E] border border-[#91B49A]/25 text-[#F0F3EA] focus:border-[#C7F36B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Primary Transport Mode
              </label>
              <select
                value={primaryTransport}
                onChange={(e) => setPrimaryTransport(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07110E] border border-[#91B49A]/25 text-[#F0F3EA] focus:border-[#C7F36B] focus:outline-none"
              >
                <option value="Metro">Underground / Elevated Metro (Filtered)</option>
                <option value="Bus">Public City Bus</option>
                <option value="Cycling">Bicycle / Cycle Rickshaw (Open air)</option>
                <option value="Walking">Walking / Pedestrian Commute</option>
                <option value="Car">Personal Automobile (Cabin AC Recirculation)</option>
                <option value="Motorbike">Two-Wheeler / Motorbike / Scooter</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Typical One-Way Commute (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={commuteMinutes}
                onChange={(e) => setCommuteMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07110E] border border-[#91B49A]/25 text-[#F0F3EA] focus:border-[#C7F36B] focus:outline-none font-mono"
              />
            </div>
          </div>
        </section>

        {/* SECTION: HOUSEHOLD & VULNERABILITIES */}
        <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-6">
          <div className="pb-3 border-b border-[#91B49A]/15">
            <h3 className="text-base font-bold text-[#F0F3EA] font-interface flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#E64848]" />
              Household Profile & Vulnerabilities
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Optional health indicators ensure recommendations account for infant lung development and elderly cardiovascular stress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <label className="p-3.5 rounded-xl bg-[#07110E] border border-[#91B49A]/15 flex items-center justify-between cursor-pointer hover:border-[#91B49A]/30 transition-colors">
              <div>
                <span className="font-bold text-[#F0F3EA] block">Infants / Children</span>
                <span className="text-[11px] text-[#A3B1A6]">Higher respiratory rate</span>
              </div>
              <input
                type="checkbox"
                checked={vulnerable.children}
                onChange={(e) => setVulnerable({ ...vulnerable, children: e.target.checked })}
                className="w-4 h-4 rounded text-[#C7F36B] cursor-pointer"
              />
            </label>

            <label className="p-3.5 rounded-xl bg-[#07110E] border border-[#91B49A]/15 flex items-center justify-between cursor-pointer hover:border-[#91B49A]/30 transition-colors">
              <div>
                <span className="font-bold text-[#F0F3EA] block">Elderly Members</span>
                <span className="text-[11px] text-[#A3B1A6]">Vascular sensitivity</span>
              </div>
              <input
                type="checkbox"
                checked={vulnerable.elderly}
                onChange={(e) => setVulnerable({ ...vulnerable, elderly: e.target.checked })}
                className="w-4 h-4 rounded text-[#C7F36B] cursor-pointer"
              />
            </label>

            <label className="p-3.5 rounded-xl bg-[#07110E] border border-[#91B49A]/15 flex items-center justify-between cursor-pointer hover:border-[#91B49A]/30 transition-colors">
              <div>
                <span className="font-bold text-[#F0F3EA] block">Asthma / Allergies</span>
                <span className="text-[11px] text-[#A3B1A6]">Hyper-reactive airways</span>
              </div>
              <input
                type="checkbox"
                checked={vulnerable.asthmaOrAllergies}
                onChange={(e) => setVulnerable({ ...vulnerable, asthmaOrAllergies: e.target.checked })}
                className="w-4 h-4 rounded text-[#C7F36B] cursor-pointer"
              />
            </label>

            <label className="p-3.5 rounded-xl bg-[#07110E] border border-[#91B49A]/15 flex items-center justify-between cursor-pointer hover:border-[#91B49A]/30 transition-colors">
              <div>
                <span className="font-bold text-[#F0F3EA] block">Cardiac History</span>
                <span className="text-[11px] text-[#A3B1A6]">Ischemic sensitivity</span>
              </div>
              <input
                type="checkbox"
                checked={vulnerable.cardiacHistory}
                onChange={(e) => setVulnerable({ ...vulnerable, cardiacHistory: e.target.checked })}
                className="w-4 h-4 rounded text-[#C7F36B] cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Home Ventilation Architecture
              </label>
              <select
                value={homeVentilation}
                onChange={(e) => setHomeVentilation(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/25 text-[#F0F3EA] focus:outline-none"
              >
                <option value="Cross-ventilation windows">Cross-ventilation (Windows on opposite walls)</option>
                <option value="Single side windows">Single-side windows only</option>
                <option value="Central HVAC">Central HVAC / Mechanical air handling</option>
                <option value="Balcony doors only">Balcony doors only</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Air Purifier Availability
              </label>
              <select
                value={airPurifierOwned ? 'yes' : 'no'}
                onChange={(e) => setAirPurifierOwned(e.target.value === 'yes')}
                className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/25 text-[#F0F3EA] focus:outline-none"
              >
                <option value="yes">Yes — HEPA Purifier in at least 1 bedroom</option>
                <option value="no">No — Relying purely on natural passive ventilation</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Budgetary Optimization Mode
              </label>
              <select
                value={budgetPreference}
                onChange={(e) => setBudgetPreference(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/25 text-[#F0F3EA] focus:outline-none font-semibold text-[#C7F36B]"
              >
                <option value="zero-budget">Zero-Budget Mode (Prioritize ₹0 free tactics)</option>
                <option value="practical">Practical Mode (Low-cost accessories under ₹500)</option>
                <option value="unrestricted">Unrestricted (Hardware upgrades welcome)</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION: VISUAL ROUTINE TIMELINE BUILDER */}
        <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#91B49A]/15 gap-2">
            <div>
              <h3 className="text-base font-bold text-[#F0F3EA] font-interface">
                Visual Routine Timeline
              </h3>
              <p className="text-xs text-[#A3B1A6]">
                Mark activities as "Flexible" so AIRWISE can recommend shifting them to cleaner atmospheric windows.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddActivityOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#162A20] hover:bg-[#1D3529] text-[#C7F36B] text-xs font-semibold border border-[#C7F36B]/25 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Daily Block</span>
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-[#07110E] border border-[#91B49A]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs text-[#C7F36B] font-bold w-28 shrink-0">
                    {act.time}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F0F3EA] text-sm">
                      {act.name}
                    </h4>
                    <p className="text-[11px] text-[#A3B1A6]">
                      {act.location} {act.transport ? `• Transit: ${act.transport}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleFlexible(act.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-colors ${
                      act.isFlexible
                        ? 'bg-[#3DD68C]/15 text-[#3DD68C] border-[#3DD68C]/30'
                        : 'bg-[#162A20] text-[#65736A] border-[#91B49A]/10'
                    }`}
                  >
                    {act.isFlexible ? 'Flexible Timing' : 'Fixed Window'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteActivity(act.id)}
                    className="p-1.5 text-[#65736A] hover:text-[#E64848] rounded-lg transition-colors"
                    aria-label="Remove routine item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </form>

      {/* ADD ACTIVITY MODAL */}
      <Modal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        title="Add Schedule Activity"
        subtitle="Insert a customized daily block into your exposure timeline"
      >
        <form onSubmit={handleAddActivity} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
              Time Window (e.g. 17:00 - 18:00)
            </label>
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/30 text-[#F0F3EA] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
              Activity Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Evening Dog Walk / Outdoor Jog"
              className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/30 text-[#F0F3EA] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Environment Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/30 text-[#F0F3EA]"
              >
                <option value="indoor">Indoor Enclosure</option>
                <option value="outdoor">Outdoor / Ambient Air</option>
                <option value="commute">Transit / Commute</option>
                <option value="exercise">Aerobic Exercise</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
                Flexibility
              </label>
              <select
                value={newFlexible ? 'yes' : 'no'}
                onChange={(e) => setNewFlexible(e.target.value === 'yes')}
                className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/30 text-[#F0F3EA]"
              >
                <option value="yes">Can shift if air is bad</option>
                <option value="no">Fixed mandatory schedule</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase text-[#A3B1A6] text-[11px] mb-1">
              Location Name
            </label>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="e.g. Neighborhood Park / Gym"
              className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/30 text-[#F0F3EA] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#91B49A]/15">
            <button
              type="button"
              onClick={() => setIsAddActivityOpen(false)}
              className="px-4 py-2 rounded-xl text-[#A3B1A6] hover:bg-[#162A20]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#C7F36B] text-[#07110E] font-bold"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
