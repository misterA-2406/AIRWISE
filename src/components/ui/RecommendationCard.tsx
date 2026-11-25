import React, { useState } from 'react';
import { PlanAction } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Bookmark, 
  BookmarkCheck, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Ban, 
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock,
  Check
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface RecommendationCardProps {
  action: PlanAction;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ action }) => {
  const { 
    toggleCompleteAction, 
    toggleSaveAction, 
    skipAction, 
    replaceAction,
    setIsAIDrawerOpen,
    setAiSuggestedPrompt
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState(action.title);
  const [customAlt, setCustomAlt] = useState(action.alternative);

  const costBadgeColor = {
    '₹0 Free': 'text-[#3DD68C] bg-[#3DD68C]/10 border-[#3DD68C]/30',
    'Low-cost': 'text-[#F5C842] bg-[#F5C842]/10 border-[#F5C842]/30',
    'Optional Expense': 'text-[#91B49A] bg-[#91B49A]/10 border-[#91B49A]/30'
  }[action.cost] || 'text-[#A3B1A6] bg-[#162A20]';

  const handleAskWhy = () => {
    setAiSuggestedPrompt(`Why do you recommend "${action.title}" for my ${action.period} window today? Explain the atmospheric mechanism.`);
    setIsAIDrawerOpen(true);
  };

  const handleSaveReplacement = (e: React.FormEvent) => {
    e.preventDefault();
    replaceAction(action.id, customTitle, customAlt);
    setIsReplaceModalOpen(false);
  };

  if (action.isSkipped) {
    return (
      <div className="p-3.5 rounded-2xl bg-[#0B1914]/40 border border-[#91B49A]/10 flex items-center justify-between text-xs text-[#65736A] transition-all">
        <span className="line-through font-mono">Skipped: {action.title}</span>
        <button
          onClick={() => replaceAction(action.id, action.title, action.alternative)}
          className="text-[#91B49A] hover:text-[#C7F36B] text-[11px] font-mono underline"
        >
          Restore Action
        </button>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
          action.isCompleted 
            ? 'bg-[#0B1914]/60 border-[#3DD68C]/25 opacity-80' 
            : 'bg-[#11231B] border-[#91B49A]/20 hover:border-[#C7F36B]/35 shadow-md'
        }`}
      >
        {/* COMPACT MAIN HEADER & ACTION BAR */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Time Period & Title */}
          <div className="flex items-start gap-3.5">
            <button
              onClick={() => toggleCompleteAction(action.id)}
              className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                action.isCompleted
                  ? 'bg-[#3DD68C] border-[#3DD68C] text-[#07110E]'
                  : 'bg-[#07110E] hover:bg-[#162A20] border-[#91B49A]/30 text-[#91B49A] hover:border-[#C7F36B]'
              }`}
              title={action.isCompleted ? 'Mark Pending' : 'Mark Completed'}
            >
              {action.isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : null}
            </button>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-[#C7F36B] text-xs">
                  {action.timeLabel}
                </span>
                <span className="text-[#65736A]">•</span>
                <span className="font-mono text-[10px] text-[#A3B1A6] uppercase tracking-wider">
                  {action.period.replace('-', ' ')}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${costBadgeColor}`}>
                  {action.cost}
                </span>
                <span className="text-[10px] font-mono text-[#91B49A]">
                  Effort: {action.effort}
                </span>
              </div>

              <h3 className={`text-base font-semibold leading-snug ${
                action.isCompleted ? 'line-through text-[#65736A]' : 'text-[#F0F3EA]'
              }`}>
                {action.title}
              </h3>
            </div>
          </div>

          {/* Right: Exposure Benefit & Action Buttons */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#91B49A]/10">
            <span className="px-2.5 py-1 rounded-full bg-[#3DD68C]/15 border border-[#3DD68C]/30 text-[#3DD68C] text-xs font-mono font-semibold">
              {action.impact}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toggleSaveAction(action.id)}
                className={`p-2 rounded-xl border transition-all ${
                  action.isSaved 
                    ? 'bg-[#C7F36B]/20 border-[#C7F36B] text-[#C7F36B]' 
                    : 'bg-[#162A20] hover:bg-[#1D3529] border-[#91B49A]/20 text-[#91B49A]'
                }`}
                title={action.isSaved ? 'Saved to Routine' : 'Save to Routine'}
              >
                {action.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-1.5 rounded-xl bg-[#162A20] hover:bg-[#1D3529] border border-[#91B49A]/20 text-[#A3B1A6] hover:text-[#F0F3EA] text-xs font-mono flex items-center gap-1 transition-all"
              >
                <span>{isExpanded ? 'Less' : 'Details'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE: EXPANDABLE DETAILS */}
        {isExpanded && (
          <div className="px-5 pb-5 pt-3 border-t border-[#91B49A]/15 bg-[#07110E]/40 space-y-4 animate-in fade-in duration-200">
            {/* Why & Alternative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0B1914] border border-[#91B49A]/15 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#91B49A] block">
                  Meteorological & Health Rationale
                </span>
                <p className="text-[#A3B1A6] leading-relaxed">
                  {action.whyToday}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B1914] border border-[#F5C842]/25 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5C842] block">
                  Zero-Budget / Contingency Alternative
                </span>
                <p className="text-[#F0F3EA] leading-relaxed">
                  {action.alternative}
                </p>
              </div>
            </div>

            {/* Utility Actions Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAskWhy}
                  className="text-[#C7F36B] hover:underline flex items-center gap-1.5 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain Trade-offs with AI</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsReplaceModalOpen(true)}
                  className="text-[#91B49A] hover:text-[#F0F3EA] flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace Option</span>
                </button>

                <button
                  onClick={() => skipAction(action.id)}
                  className="text-[#65736A] hover:text-[#E64848] flex items-center gap-1"
                >
                  <Ban className="w-3 h-3" />
                  <span>Skip for Today</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* REPLACE ACTION MODAL */}
      <Modal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        title="Replace Action for Today"
        subtitle={`Adjust the scheduled adaptation for the ${action.period} window.`}
      >
        <form onSubmit={handleSaveReplacement} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#91B49A] uppercase mb-1">
              Custom Adapted Action Title
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/20 text-[#F0F3EA] text-sm focus:outline-none focus:border-[#C7F36B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#91B49A] uppercase mb-1">
              Contingency Plan / Alternative
            </label>
            <textarea
              value={customAlt}
              onChange={(e) => setCustomAlt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/20 text-[#F0F3EA] text-sm focus:outline-none focus:border-[#C7F36B]"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsReplaceModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-[#A3B1A6] hover:text-[#F0F3EA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C7F36B] hover:bg-[#A8D957] text-[#07110E] text-xs font-bold font-mono"
            >
              Update Action
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
