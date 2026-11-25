import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  RotateCcw,
  Info
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

/**
 * TodayPlanPage Component
 * 
 * 8-period chronological daily adaptation timeline. 
 * Allows users to filter actions, review physiological exposure reductions, and sync to external calendars.
 */
export const TodayPlanPage: React.FC = () => {
  const { 
    planActions, 
    completedActionsCount, 
    totalActionsCount,
    airData,
    setIsAIDrawerOpen,
    setAiSuggestedPrompt,
    addToast
  } = useApp();

  const [filterCostFreeOnly, setFilterCostFreeOnly] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [isAdjustPlanModalOpen, setIsAdjustPlanModalOpen] = useState(false);

  // Adjustment form states
  const [isWfhToday, setIsWfhToday] = useState(false);
  const [exerciseTimingOverride, setExerciseTimingOverride] = useState<'indoor' | 'early' | 'skip'>('indoor');

  const categories = ['all', 'Commute', 'Indoor Air', 'Health', 'Schedule', 'Routine'];

  const periods: { id: string; label: string }[] = [
    { id: 'all', label: 'All Windows' },
    { id: 'before-leaving', label: 'Before Leaving' },
    { id: 'commute-morning', label: 'Commute (AM)' },
    { id: 'work-study', label: 'Work & Study' },
    { id: 'lunch', label: 'Meals & Midday' },
    { id: 'outdoor-activities', label: 'Outdoor Activities' },
    { id: 'returning-home', label: 'Return Home (PM)' },
    { id: 'evening', label: 'Evening Living' },
    { id: 'sleep', label: 'Sleep & Night' }
  ];

  // Filter actions
  const filteredActions = planActions.filter((action) => {
    if (filterCostFreeOnly && action.cost !== '₹0 Free') return false;
    if (filterCategory !== 'all' && action.category !== filterCategory) return false;
    if (filterPeriod !== 'all' && action.period !== filterPeriod) return false;
    return true;
  });

  const handleApplyAdjustments = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdjustPlanModalOpen(false);
    addToast(
      'Plan Recalculated',
      isWfhToday 
        ? 'Commute actions paused; indoor air isolation enhanced.' 
        : 'Daily itinerary synchronized with current atmospheric dynamics.',
      'success'
    );
  };

  const handleConsultAI = () => {
    setAiSuggestedPrompt('Evaluate my active daily plan. Are there any hidden particulate risks I should prioritize right now?');
    setIsAIDrawerOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#91B49A]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#91B49A] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C7F36B]" />
            <span>Personalized Daily Air Protocol • {airData?.locationName}</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#F0F3EA] tracking-tight">
            Today’s Air Plan
          </h1>
          <p className="text-sm text-[#A3B1A6] mt-1">
            Synchronized with local diurnal dispersion and your daily routine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdjustPlanModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#11231B] hover:bg-[#162A20] border border-[#91B49A]/30 text-[#F0F3EA] text-xs font-semibold transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>Adjust my plan</span>
          </button>

          <button
            onClick={handleConsultAI}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C7F36B] hover:bg-[#A8D957] text-[#07110E] text-xs font-bold transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Review</span>
          </button>
        </div>
      </div>

      {/* METRIC STRIP: COMPLETION & COST STATUS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#11231B] border border-[#91B49A]/15 flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-mono uppercase text-[#A3B1A6]">
              Completion Progress
            </span>
            <span className="text-xl font-bold text-[#F0F3EA] font-interface">
              {completedActionsCount} of {totalActionsCount} Enacted
            </span>
          </div>
          <span className="font-mono text-sm px-2.5 py-1 rounded-full bg-[#3DD68C]/15 text-[#3DD68C] border border-[#3DD68C]/25">
            {totalActionsCount > 0 ? Math.round((completedActionsCount / totalActionsCount) * 100) : 0}%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11231B] border border-[#91B49A]/15 flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-mono uppercase text-[#A3B1A6]">
              Zero-Cost Protection
            </span>
            <span className="text-xl font-bold text-[#3DD68C] font-mono">
              100% Free Available
            </span>
          </div>
          <button
            onClick={() => setFilterCostFreeOnly(!filterCostFreeOnly)}
            className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              filterCostFreeOnly 
                ? 'bg-[#3DD68C] text-[#07110E] font-bold border-[#3DD68C]' 
                : 'bg-[#162A20] text-[#A3B1A6] border-[#91B49A]/20 hover:text-[#F0F3EA]'
            }`}
          >
            {filterCostFreeOnly ? '₹0 Active' : 'Filter to ₹0'}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#11231B] border border-[#91B49A]/15 flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-mono uppercase text-[#A3B1A6]">
              Calculated Exposure Reduction
            </span>
            <span className="text-xl font-bold text-[#C7F36B] font-editorial">
              -58% Today
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#91B49A]">
            vs Unadapted Day
          </span>
        </div>
      </div>

      {/* FILTER & PERIOD TABS */}
      <div className="p-4 rounded-2xl bg-[#0B1914] border border-[#91B49A]/15 space-y-3">
        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#91B49A]/10">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-mono text-[#A3B1A6] uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#C7F36B]" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors capitalize ${
                  filterCategory === cat
                    ? 'bg-[#C7F36B] text-[#07110E] font-bold'
                    : 'bg-[#11231B] text-[#A3B1A6] hover:text-[#F0F3EA] border border-[#91B49A]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setFilterCategory('all');
              setFilterPeriod('all');
              setFilterCostFreeOnly(false);
            }}
            className="text-[11px] font-mono text-[#A3B1A6] hover:text-[#C7F36B] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Chronological Time Window Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-mono text-[#A3B1A6] uppercase mr-1 whitespace-nowrap">
            Window:
          </span>
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPeriod(p.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                filterPeriod === p.id
                  ? 'bg-[#162A20] text-[#C7F36B] border border-[#C7F36B]/40 font-semibold'
                  : 'text-[#A3B1A6] hover:text-[#F0F3EA]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* CHRONOLOGICAL RECOMMENDATION CARDS LIST */}
      <div className="space-y-4">
        {filteredActions.length === 0 ? (
          <div className="text-center py-16 bg-[#11231B]/40 rounded-2xl border border-[#91B49A]/15 space-y-3">
            <Info className="w-8 h-8 text-[#A3B1A6] mx-auto opacity-40" />
            <h3 className="text-sm font-semibold text-[#F0F3EA]">No actions match current filters</h3>
            <p className="text-xs text-[#A3B1A6]">
              Try resetting your category or price filters to view recommendations.
            </p>
            <button
              onClick={() => {
                setFilterCategory('all');
                setFilterPeriod('all');
                setFilterCostFreeOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#162A20] text-[#C7F36B] text-xs font-mono"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredActions.map((action) => (
            <RecommendationCard key={action.id} action={action} />
          ))
        )}
      </div>

      {/* ADJUST MY PLAN MODAL */}
      <Modal
        isOpen={isAdjustPlanModalOpen}
        onClose={() => setIsAdjustPlanModalOpen(false)}
        title="Adjust Today's Schedule Parameters"
        subtitle="Airwise will instantaneously re-weight all 8 chronological actions."
      >
        <form onSubmit={handleApplyAdjustments} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#07110E] border border-[#91B49A]/15 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold text-[#F0F3EA] text-sm block">Working from Home Today</span>
                <span className="text-[#A3B1A6] text-xs">
                  Eliminates morning & evening commute windows, shifting focus to indoor micro-ventilation.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isWfhToday}
                onChange={(e) => setIsWfhToday(e.target.checked)}
                className="w-4 h-4 rounded text-[#C7F36B] focus:ring-0 cursor-pointer"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block font-mono uppercase text-[#A3B1A6] text-[11px]">
              Evening Exercise Decision
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setExerciseTimingOverride('indoor')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  exerciseTimingOverride === 'indoor'
                    ? 'bg-[#162A20] border-[#C7F36B] text-[#C7F36B]'
                    : 'bg-[#07110E] border-[#91B49A]/20 text-[#A3B1A6]'
                }`}
              >
                <div className="font-bold">Indoor Circuit</div>
                <div className="text-[10px] mt-0.5 opacity-80">Zero exposure</div>
              </button>

              <button
                type="button"
                onClick={() => setExerciseTimingOverride('early')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  exerciseTimingOverride === 'early'
                    ? 'bg-[#162A20] border-[#C7F36B] text-[#C7F36B]'
                    : 'bg-[#07110E] border-[#91B49A]/20 text-[#A3B1A6]'
                }`}
              >
                <div className="font-bold">1:30 PM Solar Lift</div>
                <div className="text-[10px] mt-0.5 opacity-80">Terrace walk</div>
              </button>

              <button
                type="button"
                onClick={() => setExerciseTimingOverride('skip')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  exerciseTimingOverride === 'skip'
                    ? 'bg-[#162A20] border-[#C7F36B] text-[#C7F36B]'
                    : 'bg-[#07110E] border-[#91B49A]/20 text-[#A3B1A6]'
                }`}
              >
                <div className="font-bold">Rest Today</div>
                <div className="text-[10px] mt-0.5 opacity-80">Full recovery</div>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#91B49A]/15">
            <button
              type="button"
              onClick={() => setIsAdjustPlanModalOpen(false)}
              className="px-4 py-2 rounded-xl text-[#A3B1A6] hover:bg-[#162A20]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C7F36B] text-[#07110E] font-bold hover:bg-[#A8D957]"
            >
              Re-weight Plan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
