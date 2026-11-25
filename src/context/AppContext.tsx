import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { 
  AirQualityData, 
  HourlyForecast, 
  DailyForecast, 
  PlanAction, 
  UserRoutineProfile, 
  IndoorSourceCheck, 
  IndoorRecommendation, 
  WhatIfScenario, 
  CommunityMission, 
  AirwiseNotification,
  LocationOption 
} from '../types';
import { AirwiseApiService } from '../services/airwiseApi';
import { 
  DEMO_LOCATIONS, 
  INITIAL_AIR_DATA, 
  HOURLY_TIMELINE_DATA, 
  DAILY_FORECAST_DATA, 
  INITIAL_PLAN_ACTIONS, 
  INITIAL_USER_ROUTINE, 
  INDOOR_SOURCE_CHECKLIST, 
  INDOOR_PRACTICAL_ACTIONS, 
  WHAT_IF_SCENARIOS, 
  COMMUNITY_MISSIONS, 
  NOTIFICATIONS_DATA 
} from '../data/demoData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Location
  locations: LocationOption[];
  currentLocationId: string;
  setLocation: (locId: string) => void;
  airData: AirQualityData | null;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  isLoadingAir: boolean;

  // Plan
  planActions: PlanAction[];
  toggleCompleteAction: (id: string) => void;
  toggleSaveAction: (id: string) => void;
  skipAction: (id: string) => void;
  replaceAction: (id: string, title: string, alt: string) => void;
  completedActionsCount: number;
  totalActionsCount: number;

  // Routine
  routineProfile: UserRoutineProfile;
  updateRoutineProfile: (profile: Partial<UserRoutineProfile>) => Promise<void>;

  // Indoor
  indoorChecks: IndoorSourceCheck[];
  toggleIndoorCheck: (id: string) => void;
  indoorRecommendations: IndoorRecommendation[];
  toggleIndoorImplemented: (id: string) => void;
  isZeroBudgetOnly: boolean;
  setIsZeroBudgetOnly: (val: boolean) => void;

  // Scenarios
  scenarios: WhatIfScenario[];
  activeScenarioId: string;
  setActiveScenarioId: (id: string) => void;
  applyScenarioToToday: (scenarioId: string) => void;

  // Community
  missions: CommunityMission[];
  toggleJoinMission: (missionId: string) => void;
  completeMissionStep: (missionId: string) => void;

  // Notifications
  notifications: AirwiseNotification[];
  unreadNotifsCount: number;
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
  isNotifDrawerOpen: boolean;
  setIsNotifDrawerOpen: (open: boolean) => void;

  // AI Drawer
  isAIDrawerOpen: boolean;
  setIsAIDrawerOpen: (open: boolean) => void;
  aiSuggestedPrompt: string;
  setAiSuggestedPrompt: (prompt: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Demo Banner & Provenance
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  isLiveTelemetry: boolean;

  // View Mode: Simple View (Families) vs Detailed Air Science (Technical)
  viewMode: 'simple' | 'detailed';
  setViewMode: (mode: 'simple' | 'detailed') => void;
  toggleViewMode: () => void;

  // AI Routine Change Proposal & Undo
  lastUndoAction: { id: string; prevTitle: string; prevAlt: string } | null;
  applyAiRoutineChanges: (changes: { id: string; title: string; alternative: string }[]) => void;
  undoLastAiChange: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastCounterRef = useRef<number>(0);
  const [locations, setLocations] = useState<LocationOption[]>(DEMO_LOCATIONS);
  const [currentLocationId, setCurrentLocationId] = useState<string>('delhi');
  const [airData, setAirData] = useState<AirQualityData | null>(INITIAL_AIR_DATA['delhi']);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>(HOURLY_TIMELINE_DATA);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>(DAILY_FORECAST_DATA);
  const [isLoadingAir, setIsLoadingAir] = useState<boolean>(false);

  const [planActions, setPlanActions] = useState<PlanAction[]>(INITIAL_PLAN_ACTIONS);
  const [routineProfile, setRoutineProfile] = useState<UserRoutineProfile>(INITIAL_USER_ROUTINE);
  const [indoorChecks, setIndoorChecks] = useState<IndoorSourceCheck[]>(INDOOR_SOURCE_CHECKLIST);
  const [indoorRecommendations, setIndoorRecommendations] = useState<IndoorRecommendation[]>(INDOOR_PRACTICAL_ACTIONS);
  const [isZeroBudgetOnly, setIsZeroBudgetOnly] = useState<boolean>(false);

  const [scenarios, setScenarios] = useState<WhatIfScenario[]>(WHAT_IF_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('sc-1');

  const [missions, setMissions] = useState<CommunityMission[]>(COMMUNITY_MISSIONS);
  const [notifications, setNotifications] = useState<AirwiseNotification[]>(NOTIFICATIONS_DATA);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState<boolean>(false);
  const [aiSuggestedPrompt, setAiSuggestedPrompt] = useState<string>('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLiveTelemetry] = useState<boolean>(true);

  // View Mode: Simple vs Detailed Air Science
  const [viewMode, setViewModeState] = useState<'simple' | 'detailed'>(() => {
    return (localStorage.getItem('airwise_view_mode') as 'simple' | 'detailed') || 'simple';
  });

  const setViewMode = (mode: 'simple' | 'detailed') => {
    setViewModeState(mode);
    localStorage.setItem('airwise_view_mode', mode);
    addToast(
      mode === 'simple' ? 'Simple Family View' : 'Detailed Air Science',
      mode === 'simple' ? 'Switched to plain-language family recommendations.' : 'Technical criteria speciation & models enabled.',
      'info'
    );
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'simple' ? 'detailed' : 'simple');
  };

  // AI Routine Change Proposal & Undo State
  const [lastUndoAction, setLastUndoAction] = useState<{ id: string; prevTitle: string; prevAlt: string } | null>(null);

  const applyAiRoutineChanges = (changes: { id: string; title: string; alternative: string }[]) => {
    if (!changes.length) return;
    const firstChange = changes[0];
    const target = planActions.find(a => a.id === firstChange.id);
    if (target) {
      setLastUndoAction({
        id: target.id,
        prevTitle: target.title,
        prevAlt: target.alternative
      });
      replaceAction(firstChange.id, firstChange.title, firstChange.alternative);
      addToast('AI Routine Update Enacted', `Updated ${target.period}: "${firstChange.title}"`, 'success');
    }
  };

  const undoLastAiChange = () => {
    if (!lastUndoAction) return;
    replaceAction(lastUndoAction.id, lastUndoAction.prevTitle, lastUndoAction.prevAlt);
    addToast('Action Restored', `Restored previous schedule: "${lastUndoAction.prevTitle}"`, 'info');
    setLastUndoAction(null);
  };

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    toastCounterRef.current += 1;
    const id = `toast-${toastCounterRef.current}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    async function initData() {
      try {
        const [locs, air, fc, plan, routine, checks, indoorRecs, scens, comm, notifs] = await Promise.all([
          AirwiseApiService.getLocations(),
          AirwiseApiService.getAirQuality('delhi'),
          AirwiseApiService.getForecast('delhi'),
          AirwiseApiService.getDailyPlan(),
          AirwiseApiService.getRoutine(),
          AirwiseApiService.getIndoorChecks(),
          AirwiseApiService.getIndoorRecommendations(),
          AirwiseApiService.getScenarios(),
          AirwiseApiService.getCommunity(),
          AirwiseApiService.getNotifications()
        ]);

        setLocations(locs);
        setAirData(air);
        setHourlyForecast(fc.hourly);
        setDailyForecast(fc.daily);
        setPlanActions(plan);
        setRoutineProfile(routine);
        setIndoorChecks(checks);
        setIndoorRecommendations(indoorRecs);
        setScenarios(scens);
        setMissions(comm);
        setNotifications(notifs);
      } catch (err) {
        console.error('Failed to load initial Airwise intelligence data', err);
      } finally {
        setIsLoadingAir(false);
      }
    }

    initData();
  }, []);

  // Handle location changes
  const setLocation = async (locId: string) => {
    setIsLoadingAir(true);
    setCurrentLocationId(locId);
    try {
      const [newAir, newFc] = await Promise.all([
        AirwiseApiService.getAirQuality(locId),
        AirwiseApiService.getForecast(locId)
      ]);
      setAirData(newAir);
      setHourlyForecast(newFc.hourly);
      setDailyForecast(newFc.daily);
      addToast('Location Updated', `Active air intelligence synchronized with ${newAir.locationName}.`, 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAir(false);
    }
  };

  // Action methods
  const toggleCompleteAction = async (id: string) => {
    const target = planActions.find((a) => a.id === id);
    const updated = await AirwiseApiService.toggleActionComplete(id);
    setPlanActions(updated);
    if (target && !target.isCompleted) {
      addToast('Action Completed', `Completed "${target.title.slice(0, 36)}..."`, 'success');
    }
  };

  const toggleSaveAction = async (id: string) => {
    const updated = await AirwiseApiService.toggleActionSave(id);
    setPlanActions(updated);
    addToast('Preference Saved', 'Action saved to your permanent routine playbook.', 'info');
  };

  const skipAction = async (id: string) => {
    const updated = await AirwiseApiService.skipAction(id);
    setPlanActions(updated);
    addToast('Action Skipped', 'We have removed this recommendation from your active plan for today.', 'info');
  };

  const replaceAction = async (id: string, title: string, alt: string) => {
    const updated = await AirwiseApiService.replaceAction(id, title, alt);
    setPlanActions(updated);
    addToast('Plan Adjusted', 'Replacement action successfully added to schedule.', 'success');
  };

  // Routine
  const updateRoutineProfile = async (profile: Partial<UserRoutineProfile>) => {
    const updated = await AirwiseApiService.updateRoutine(profile);
    setRoutineProfile(updated);
    addToast('Routine Recalculated', 'Air plan adapted to match your updated travel and household settings.', 'success');
  };

  // Indoor
  const toggleIndoorCheck = async (id: string) => {
    const updated = await AirwiseApiService.toggleIndoorCheck(id);
    setIndoorChecks(updated);
  };

  const toggleIndoorImplemented = async (id: string) => {
    const updated = await AirwiseApiService.toggleIndoorRecommendationImplemented(id);
    setIndoorRecommendations(updated);
    addToast('Home Status Updated', 'Indoor environmental safeguard logged.', 'success');
  };

  // Scenarios
  const applyScenarioToToday = (scenarioId: string) => {
    const sc = scenarios.find((s) => s.id === scenarioId);
    if (!sc) return;
    const newAction: PlanAction = {
      id: 'sc-added-' + Date.now(),
      period: 'commute-morning',
      timeLabel: 'Scenario Choice',
      title: `Adopted: ${sc.optionB.name}`,
      whyToday: sc.aiVerdict,
      personalRelevance: sc.tradeoffAnalysis,
      cost: sc.optionB.costInr === 0 ? '₹0 Free' : 'Low-cost',
      costNumeric: sc.optionB.costInr,
      effort: 'Medium',
      alternative: sc.optionA.name,
      impact: `Yields ${sc.exposureReductionPercent}% reduced respiratory exposure today.`,
      category: sc.category === 'Commute' ? 'Commute' : 'Routine',
      isCompleted: false,
      isSaved: true,
      isSkipped: false
    };

    setPlanActions((prev) => [newAction, ...prev]);
    addToast('Added to Today’s Plan', `"${sc.optionB.name}" is now in your active schedule!`, 'success');
  };

  // Missions
  const toggleJoinMission = async (missionId: string) => {
    const updated = await AirwiseApiService.toggleJoinMission(missionId);
    setMissions(updated);
    const m = updated.find((item) => item.id === missionId);
    if (m?.joined) {
      addToast('Mission Joined!', `You joined "${m.title}". Let's protect our shared air.`, 'success');
    }
  };

  const completeMissionStep = async (missionId: string) => {
    const updated = await AirwiseApiService.completeMissionStep(missionId);
    setMissions(updated);
    addToast('Milestone Logged!', '+1 community action completed. Avoided emission recorded.', 'success');
  };

  // Notifications
  const markNotifRead = async (id: string) => {
    const updated = await AirwiseApiService.markNotificationRead(id);
    setNotifications(updated);
  };

  const markAllNotifsRead = async () => {
    const updated = await AirwiseApiService.markAllNotificationsRead();
    setNotifications(updated);
    addToast('Notifications Cleared', 'All active alerts marked as read.', 'info');
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
    addToast('Data Source Status', !isDemoMode ? 'Demo simulation mode enabled' : 'Live sensor feed connection simulated', 'info');
  };

  const completedActionsCount = useMemo(() => {
    return planActions.filter((a) => a.isCompleted).length;
  }, [planActions]);

  const totalActionsCount = useMemo(() => {
    return planActions.filter((a) => !a.isSkipped).length;
  }, [planActions]);

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <AppContext.Provider
      value={{
        locations,
        currentLocationId,
        setLocation,
        airData,
        hourlyForecast,
        dailyForecast,
        isLoadingAir,
        planActions,
        toggleCompleteAction,
        toggleSaveAction,
        skipAction,
        replaceAction,
        completedActionsCount,
        totalActionsCount,
        routineProfile,
        updateRoutineProfile,
        indoorChecks,
        toggleIndoorCheck,
        indoorRecommendations,
        toggleIndoorImplemented,
        isZeroBudgetOnly,
        setIsZeroBudgetOnly,
        scenarios,
        activeScenarioId,
        setActiveScenarioId,
        applyScenarioToToday,
        missions,
        toggleJoinMission,
        completeMissionStep,
        notifications,
        unreadNotifsCount,
        markNotifRead,
        markAllNotifsRead,
        isNotifDrawerOpen,
        setIsNotifDrawerOpen,
        isAIDrawerOpen,
        setIsAIDrawerOpen,
        aiSuggestedPrompt,
        setAiSuggestedPrompt,
        toasts,
        addToast,
        removeToast,
        isDemoMode,
        toggleDemoMode,
        isLiveTelemetry,
        viewMode,
        setViewMode,
        toggleViewMode,
        lastUndoAction,
        applyAiRoutineChanges,
        undoLastAiChange
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
