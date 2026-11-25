import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { TodayPlanPage } from './pages/TodayPlanPage';
import { AirIntelligencePage } from './pages/AirIntelligencePage';
import { MyRoutinePage } from './pages/MyRoutinePage';
import { IndoorCoachPage } from './pages/IndoorCoachPage';
import { WhatIfLabPage } from './pages/WhatIfLabPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* App Core Application Shell & Subroutes */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<OverviewPage />} />
            <Route path="today" element={<TodayPlanPage />} />
            <Route path="air-intelligence" element={<AirIntelligencePage />} />
            <Route path="my-routine" element={<MyRoutinePage />} />
            <Route path="indoor" element={<IndoorCoachPage />} />
            <Route path="what-if" element={<WhatIfLabPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
