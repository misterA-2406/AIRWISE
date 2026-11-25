import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { DemoBanner } from '../common/DemoBanner';
import { ToastContainer } from '../common/Toast';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { ParticleAtmosphere } from '../visual/ParticleAtmosphere';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07110E] text-[#F0F3EA] flex flex-col font-interface selection:bg-[#C7F36B] selection:text-[#07110E] relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#C7F36B] focus:text-[#07110E] focus:font-bold focus:text-xs"
      >
        Skip to main content
      </a>
      <ParticleAtmosphere />
      <DemoBanner />
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        <Sidebar />
        <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 overflow-x-hidden focus:outline-none">
          <Outlet />
        </main>
      </div>

      <MobileNav />
      <ToastContainer />
      <AICopilotDrawer />
      <NotificationDrawer />
    </div>
  );
};
