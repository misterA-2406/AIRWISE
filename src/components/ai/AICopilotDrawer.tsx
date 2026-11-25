import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AirwiseApiService } from '../../services/airwiseApi';
import { 
  Sparkles, 
  X, 
  Send, 
  ShieldAlert, 
  ArrowRight, 
  Compass, 
  CheckCircle, 
  HelpCircle, 
  Zap, 
  Info,
  RotateCcw,
  Check,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionableCard?: {
    id?: string;
    title: string;
    category: string;
    actionText: string;
    reductionImpact: string;
    alternativeProposal?: string;
  };
  confidenceScore?: number;
  sourceCitation?: string;
  medicalDisclaimer?: string;
  time: string;
}

export const AICopilotDrawer: React.FC = () => {
  const { 
    isAIDrawerOpen, 
    setIsAIDrawerOpen, 
    aiSuggestedPrompt, 
    setAiSuggestedPrompt,
    airData,
    routineProfile,
    addToast,
    applyAiRoutineChanges,
    undoLastAiChange,
    lastUndoAction
  } = useApp();

  const location = useLocation();

  // Screen Context Awareness
  const screenContext = {
    '/': { name: 'Landing Page', tag: 'Overview & Philosophy' },
    '/app': { name: 'Overview Briefing', tag: 'Daily Priority & Schedule' },
    '/app/today': { name: 'Daily Air Plan', tag: '8-Period Itinerary' },
    '/app/what-if': { name: 'What-If Decision Lab', tag: 'Scenario Simulation' },
    '/app/indoor': { name: 'Indoor Air Coach', tag: 'Combustion & Zero-Budget' },
    '/app/air-intelligence': { name: 'Air Intelligence Radar', tag: 'Chemical Speciation' },
    '/app/community': { name: 'Community Missions', tag: 'Collective Civic Action' },
    '/app/profile': { name: 'Profile & Settings', tag: 'Household Vulnerabilities' }
  }[location.pathname] || { name: 'Airwise App', tag: 'Personal Adaptation' };

  // Contextual Suggested Prompts
  const contextualPrompts = {
    '/app/what-if': [
      'Why does switching to Metro save 68% exposure?',
      'How does ambient wind alter commute risk?',
      'What are the trade-offs of cycling vs bus today?'
    ],
    '/app/indoor': [
      'What are the top combustion hazards in my kitchen?',
      'How do I ventilate without letting street smog inside?',
      'Is wet mopping really better than sweeping?'
    ],
    '/app/today': [
      'Evaluate my 8 periods for hidden particulate spikes',
      'Can I do a light outdoor walk at 1:30 PM?',
      'How should I seal my bedroom before sleeping tonight?'
    ],
    '/app': [
      'Why is moving my 6 PM workout indoors critical today?',
      'When is the cleanest window to step outside?',
      'How does today’s ground inversion trap diesel soot?'
    ]
  }[location.pathname] || [
    'What is the single most important change today?',
    'How can I protect my family without spending money?',
    'Explain the difference between PM2.5 and AQI'
  ];

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello ${routineProfile?.name ? routineProfile.name.split(' ')[0] : 'there'}. I am synced with live conditions in ${airData?.locationName || 'Delhi NCR'} (AQI ${airData?.aqi || 284}). I notice you are viewing the ${screenContext.name}. What can I clarify or calculate for you?`,
      time: 'Just now',
      confidenceScore: 95,
      sourceCitation: 'Copernicus CAMS Reanalysis + Airwise Deterministic Engine'
    }
  ]);

  // Auto-send when suggested prompt is passed from external buttons
  useEffect(() => {
    if (aiSuggestedPrompt && isAIDrawerOpen) {
      handleSendPrompt(aiSuggestedPrompt);
      setAiSuggestedPrompt('');
    }
  }, [aiSuggestedPrompt, isAIDrawerOpen]);

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await AirwiseApiService.queryAirwiseAI(textToSend, {
        location: airData?.locationName || 'Delhi NCR',
        aqi: airData?.aqi || 284,
        routine: routineProfile,
        activeScreen: screenContext.name
      });

      const aiMsg: AIMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: response.answer,
        actionableCard: response.actionableCard ? {
          id: 'action-rec-6',
          title: response.actionableCard.title,
          category: response.actionableCard.category,
          actionText: response.actionableCard.actionText,
          reductionImpact: response.actionableCard.reductionImpact,
          alternativeProposal: 'Indoor core mobility circuit in sealed bedroom with air circulation.'
        } : undefined,
        confidenceScore: response.confidenceScore,
        sourceCitation: response.sourceCitation,
        medicalDisclaimer: response.medicalDisclaimer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyProposedAction = (card: NonNullable<AIMessage['actionableCard']>) => {
    applyAiRoutineChanges([{
      id: card.id || 'action-rec-6',
      title: card.title,
      alternative: card.alternativeProposal || 'Indoor routine substitution'
    }]);
  };

  if (!isAIDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#07110E]/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAIDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-[#0B1914] border-l border-[#91B49A]/25 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[#91B49A]/15 bg-[#11231B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C7F36B]/15 border border-[#C7F36B]/30 flex items-center justify-center text-[#C7F36B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F0F3EA] flex items-center gap-2 font-interface">
                AIRWISE Copilot
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C7F36B]/20 text-[#C7F36B]">
                  Grounded AI
                </span>
              </h3>
              <p className="text-[11px] text-[#A3B1A6]">
                Syncing with {airData?.locationName} • AQI {airData?.aqi} ({airData?.riskLevel})
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAIDrawerOpen(false)}
            className="p-1.5 rounded-lg text-[#A3B1A6] hover:text-[#F0F3EA] hover:bg-[#162A20] transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Context Banner */}
        <div className="px-4 py-2 bg-[#07110E] border-b border-[#91B49A]/10 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[#91B49A] text-[11px]">Viewing:</span>
            <span className="px-2 py-0.5 rounded bg-[#11231B] border border-[#91B49A]/15 text-[#F0F3EA] text-[11px] font-bold">
              {screenContext.name}
            </span>
          </div>

          {lastUndoAction && (
            <button
              onClick={() => undoLastAiChange()}
              className="text-[#F5C842] hover:underline flex items-center gap-1 text-[11px]"
              title="Undo last routine alteration"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo AI change</span>
            </button>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#C7F36B] text-[#07110E] font-medium rounded-br-none'
                    : 'bg-[#11231B] border border-[#91B49A]/20 text-[#F0F3EA] rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                {/* Structured Routine Change Proposal Preview Card */}
                {msg.actionableCard && (
                  <div className="mt-3.5 p-3.5 rounded-2xl bg-[#07110E] border border-[#C7F36B]/40 space-y-2.5">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="uppercase text-[#C7F36B] font-bold flex items-center gap-1">
                        <SlidersHorizontal className="w-3 h-3" />
                        Proposed Routine Adjustment
                      </span>
                      <span className="text-[#3DD68C] px-2 py-0.5 rounded-full bg-[#3DD68C]/15 border border-[#3DD68C]/30 font-semibold">
                        {msg.actionableCard.reductionImpact}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#F0F3EA] leading-snug">
                      {msg.actionableCard.title}
                    </div>

                    {msg.actionableCard.alternativeProposal && (
                      <p className="text-[11px] text-[#A3B1A6]">
                        Contingency: {msg.actionableCard.alternativeProposal}
                      </p>
                    )}

                    {/* Preview Decision Buttons */}
                    <div className="pt-2 border-t border-[#91B49A]/15 flex items-center gap-2">
                      <button
                        onClick={() => handleApplyProposedAction(msg.actionableCard!)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#C7F36B] hover:bg-[#A8D957] text-[#07110E] text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Enact Change</span>
                      </button>

                      <button
                        onClick={() => addToast('Change Dismissed', 'Your routine remains unchanged.', 'info')}
                        className="py-2 px-3 rounded-xl bg-[#162A20] hover:bg-[#1D3529] text-[#A3B1A6] hover:text-[#F0F3EA] text-xs font-mono transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Grounding Provenance & Confidence */}
                {msg.sender === 'assistant' && msg.confidenceScore && (
                  <div className="mt-3 pt-2.5 border-t border-[#91B49A]/10 text-[10px] font-mono text-[#A3B1A6] flex flex-wrap items-center justify-between gap-1">
                    <span>Model Confidence: {msg.confidenceScore}%</span>
                    <span className="truncate max-w-[220px]" title={msg.sourceCitation}>
                      {msg.sourceCitation}
                    </span>
                  </div>
                )}
              </div>

              {/* Medical Disclaimer */}
              {msg.medicalDisclaimer && (
                <div className="mt-1.5 max-w-[90%] text-[10px] text-[#65736A] flex items-center gap-1 px-1">
                  <Info className="w-3 h-3 shrink-0 text-[#91B49A]" />
                  <span>{msg.medicalDisclaimer}</span>
                </div>
              )}

              <span className="text-[10px] text-[#65736A] font-mono mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#A3B1A6] font-mono p-3.5 rounded-2xl bg-[#11231B] border border-[#91B49A]/15 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#C7F36B] animate-ping" />
              <span>Analyzing atmospheric inversion and personal schedule...</span>
            </div>
          )}
        </div>

        {/* Contextual Suggested Queries */}
        <div className="px-4 py-2.5 border-t border-[#91B49A]/10 bg-[#07110E]/60 space-y-1.5">
          <div className="text-[10px] uppercase font-mono text-[#A3B1A6] flex items-center justify-between">
            <span>Contextual Queries for {screenContext.name}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {contextualPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(qp)}
                className="text-[11px] px-3 py-1 rounded-full bg-[#11231B] hover:bg-[#162A20] text-[#A3B1A6] hover:text-[#F0F3EA] border border-[#91B49A]/15 transition-colors text-left"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#91B49A]/15 bg-[#11231B]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about your commute, air, or routine..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#07110E] border border-[#91B49A]/20 text-xs text-[#F0F3EA] placeholder-[#65736A] focus:outline-none focus:border-[#C7F36B]/60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#C7F36B] text-[#07110E] hover:bg-[#A8D957] disabled:opacity-40 disabled:hover:bg-[#C7F36B] transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
