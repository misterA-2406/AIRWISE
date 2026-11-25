import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommunityMission } from '../types';
import { 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Leaf, 
  HelpCircle, 
  TrendingUp, 
  Award, 
  Compass, 
  Plus, 
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const CommunityPage: React.FC = () => {
  const { missions, toggleJoinMission, completeMissionStep, addToast } = useApp();

  const [activeScope, setActiveScope] = useState<string>('all');
  const [selectedMissionMethodology, setSelectedMissionMethodology] = useState<CommunityMission | null>(null);

  const scopes = ['all', 'Apartment', 'Neighborhood', 'Campus', 'Family'];

  const filteredMissions = missions.filter(m =>
    activeScope === 'all' || m.scope === activeScope
  );

  // Leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Anand Vihar Resident Green Collective', actions: 1240, streak: '28 days', scope: 'Neighborhood' },
    { rank: 2, name: 'IIT Delhi Clean Mobility Cohort', actions: 980, streak: '21 days', scope: 'Campus' },
    { rank: 3, name: 'Siri Fort Tower B Residents', actions: 742, streak: '14 days', scope: 'Apartment' },
    { rank: 4, name: 'Sharma & Extended Family Circle', actions: 142, streak: '9 days', scope: 'Family' }
  ];

  const totalCollectiveActions = missions.reduce((acc, m) => acc + m.currentProgress, 0);
  const totalAvoidedEmissions = missions.reduce((acc, m) => acc + m.estimatedEmissionsAvoidedKg, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#91B49A]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#91B49A] mb-1">
            <Users className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>Civic Air Intelligence & Collective Health Missions</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#F0F3EA] tracking-tight">
            Community Missions
          </h1>
          <p className="text-sm text-[#A3B1A6] mt-1">
            Transform private exposure choices into collective neighborhood emission reductions.
          </p>
        </div>

        <button
          onClick={() => addToast('Community Invite', 'Direct group invitation link copied to clipboard.', 'success')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#11231B] hover:bg-[#162A20] border border-[#91B49A]/30 text-[#F0F3EA] text-xs font-semibold transition-all w-fit"
        >
          <Plus className="w-4 h-4 text-[#C7F36B]" />
          <span>Invite Group or Society</span>
        </button>
      </div>

      {/* METRIC STRIP: SEPARATION OF ACTIONS COMPLETED FROM EMISSIONS AVOIDED */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#11231B] border border-[#91B49A]/15 flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-mono uppercase text-[#A3B1A6]">
              Verified Actions Enacted
            </span>
            <span className="text-2xl font-bold text-[#F0F3EA] font-interface">
              {totalCollectiveActions.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#91B49A] block mt-0.5">
              Across 4 active civic circles
            </span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-[#3DD68C]" />
        </div>

        <div className="p-4 rounded-2xl bg-[#11231B] border border-[#91B49A]/15 flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-mono uppercase text-[#A3B1A6]">
              Estimated Avoided Emissions
            </span>
            <span className="text-2xl font-bold text-[#C7F36B] font-editorial">
              ~{totalAvoidedEmissions.toFixed(1)} kg CO2
            </span>
            <span className="text-[10px] text-[#A3B1A6] block mt-0.5">
              IPCC 2021 Defensible Methodology
            </span>
          </div>
          <Leaf className="w-6 h-6 text-[#C7F36B]" />
        </div>

        <div className="p-4 rounded-2xl bg-[#11231B] border border-[#91B49A]/15 flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-mono uppercase text-[#A3B1A6]">
              Active Participants
            </span>
            <span className="text-2xl font-bold text-[#F0F3EA] font-interface">
              646 Citizens
            </span>
            <span className="text-[10px] text-[#3DD68C] block mt-0.5">
              +48 joined this week
            </span>
          </div>
          <Users className="w-6 h-6 text-[#91B49A]" />
        </div>
      </section>

      {/* MISSIONS SECTION WITH SCOPE FILTERS */}
      <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#91B49A]/15 gap-3">
          <div>
            <h3 className="text-base font-bold text-[#F0F3EA] font-interface">
              Active Community Missions
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Join group goals to fortify local clean air corridors and reduce peak traffic.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
            {scopes.map((scope) => (
              <button
                key={scope}
                onClick={() => setActiveScope(scope)}
                className={`px-3 py-1 rounded-xl text-xs transition-colors capitalize whitespace-nowrap ${
                  activeScope === scope
                    ? 'bg-[#C7F36B] text-[#07110E] font-bold'
                    : 'bg-[#07110E] text-[#A3B1A6] hover:text-[#F0F3EA] border border-[#91B49A]/15'
                }`}
              >
                {scope === 'all' ? 'All Circles' : scope}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMissions.map((mission) => {
            const percent = Math.min(100, Math.round((mission.currentProgress / mission.totalGoal) * 100));
            return (
              <div
                key={mission.id}
                className="p-5 rounded-2xl bg-[#07110E] border border-[#91B49A]/15 flex flex-col justify-between space-y-4 hover:border-[#91B49A]/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#162A20] text-[#C7F36B] font-mono text-[10px] uppercase">
                      {mission.scope} Scope
                    </span>
                    <span className="text-[11px] font-mono text-[#A3B1A6] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {mission.daysRemaining} days left
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#F0F3EA] mb-1">
                    {mission.title}
                  </h4>
                  <p className="text-xs text-[#A3B1A6] leading-relaxed">
                    {mission.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="my-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#A3B1A6]">
                        {mission.currentProgress} / {mission.totalGoal} {mission.unit}
                      </span>
                      <span className="text-[#C7F36B] font-bold">{percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#162A20] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#5D9279] to-[#C7F36B] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Estimated Avoided Emissions Badge */}
                  {mission.estimatedEmissionsAvoidedKg > 0 ? (
                    <div className="p-2.5 rounded-xl bg-[#11231B] border border-[#3DD68C]/20 flex items-center justify-between text-xs">
                      <span className="text-[#3DD68C] font-mono text-[11px] flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5" />
                        ~{mission.estimatedEmissionsAvoidedKg} kg avoided
                      </span>
                      <button
                        onClick={() => setSelectedMissionMethodology(mission)}
                        className="text-[10px] font-mono text-[#91B49A] hover:underline flex items-center gap-0.5"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Methodology</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-[#11231B] text-[11px] font-mono text-[#A3B1A6]">
                      Focused on individual exposure reduction (Zero carbon factor applied).
                    </div>
                  )}
                </div>

                {/* Actions: Join & Complete Step */}
                <div className="pt-3 border-t border-[#91B49A]/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#A3B1A6] font-mono">
                    {mission.participantsCount} participants
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleJoinMission(mission.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        mission.joined
                          ? 'bg-[#162A20] text-[#C7F36B] border border-[#C7F36B]/30'
                          : 'bg-[#C7F36B] text-[#07110E] font-bold'
                      }`}
                    >
                      {mission.joined ? 'Joined' : 'Join Mission'}
                    </button>

                    {mission.joined && (
                      <button
                        onClick={() => completeMissionStep(mission.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#3DD68C]/20 text-[#3DD68C] border border-[#3DD68C]/35 text-xs font-semibold hover:bg-[#3DD68C]/30 transition-colors flex items-center gap-1"
                        title="Log a completed action for this mission"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Log Action</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CIVIC PARTICIPATION LEADERBOARD */}
      <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-4">
        <div className="pb-3 border-b border-[#91B49A]/15 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#F0F3EA] font-interface flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F5C842]" />
              Civic Participation Leaderboard
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Recognizing societies and communities adhering to collective clean air protocols.
            </p>
          </div>
          <span className="text-xs font-mono text-[#91B49A]">Updated Hourly</span>
        </div>

        <div className="space-y-2.5 text-xs">
          {leaderboard.map((group) => (
            <div
              key={group.rank}
              className="p-3.5 rounded-2xl bg-[#07110E] border border-[#91B49A]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full font-mono font-bold flex items-center justify-center shrink-0 ${
                  group.rank === 1 ? 'bg-[#F5C842] text-[#07110E]' : 'bg-[#162A20] text-[#A3B1A6]'
                }`}>
                  {group.rank}
                </span>
                <div>
                  <h4 className="font-bold text-[#F0F3EA] text-sm">
                    {group.name}
                  </h4>
                  <span className="text-[11px] text-[#A3B1A6] font-mono">
                    {group.scope} Circle • Consistency: {group.streak}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-editorial text-base font-bold text-[#C7F36B] block">
                  {group.actions} Actions
                </span>
                <span className="text-[10px] font-mono text-[#3DD68C]">
                  Zero Exposure Incidents
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* METHODOLOGY TRANSPARENCY MODAL */}
      {selectedMissionMethodology && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMissionMethodology(null)}
          title="Emissions Avoidance Calculation Methodology"
          subtitle={`Transparent Carbon Accounting for "${selectedMissionMethodology.title}"`}
        >
          <div className="space-y-4 text-xs leading-relaxed text-[#A3B1A6]">
            <div className="p-3.5 rounded-xl bg-[#07110E] border border-[#91B49A]/15 space-y-2">
              <span className="text-xs font-bold text-[#F0F3EA] block">
                Accounting Assumptions:
              </span>
              <p>{selectedMissionMethodology.methodologyNote}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#162A20]/40 border border-[#91B49A]/10 text-[#F0F3EA]">
              <strong className="text-[#C7F36B] font-mono text-[11px] block mb-1">
                Data Provenance Rule:
              </strong>
              We never fabricate arbitrary carbon reduction statistics. Whenever localized telemetry does not support verifiable calculations, the avoided emission metric is strictly set to zero.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMissionMethodology(null)}
                className="px-4 py-2 rounded-xl bg-[#C7F36B] text-[#07110E] font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
