import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { BottomNav } from './components/navigation/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { DiscoverScreen } from './components/discover/DiscoverScreen';
import { ActivitiesScreen } from './components/activities/ActivitiesScreen';
import { MessagesScreen } from './components/chat/MessagesScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CreateRequestModal } from './components/modals/CreateRequestModal';
import { ExpressInterestModal } from './components/modals/ExpressInterestModal';
import { ReportBlockModal } from './components/modals/ReportBlockModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { SafetyModal } from './components/modals/SafetyModal';
import { PremiumModal } from './components/premium/PremiumModal';
import { CheckoutModal } from './components/premium/CheckoutModal';
import { OtherUserProfileModal } from './components/profile/OtherUserProfileModal';
import { StoryViewerModal } from './components/story/StoryViewerModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { AuthModal } from './components/auth/AuthModal';
import { Toast } from './components/ui/Toast';
import { LoadingSplashScreen } from './components/ui/LoadingSplashScreen';

const AppContent: React.FC = () => {
  const {
    currentView,
    isSettingsModalOpen,
    closeSettingsModal,
    settingsInitialTab,
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    showLoadingScreen,
    setShowLoadingScreen
  } = useApp();

  return (
    <div className="min-h-screen bg-[#F0F6FF] text-[#172033] flex flex-col relative font-sans">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <HomeScreen />}
        {currentView === 'discover' && <DiscoverScreen />}
        {currentView === 'activities' && <ActivitiesScreen />}
        {currentView === 'messages' && <MessagesScreen />}
        {currentView === 'profile' && <ProfileScreen />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <BottomNav />

      {/* Global Interactive Modals & Drawers */}
      <CreateRequestModal />
      <ExpressInterestModal />
      <ReportBlockModal />
      <NotificationDrawer />
      <SafetyModal />
      <PremiumModal />
      <CheckoutModal />
      <OtherUserProfileModal />
      <StoryViewerModal />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        initialTab={settingsInitialTab}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
      <Toast />

      {/* 🚀 Initial 2-Second MEMA Loading Splash Screen */}
      {showLoadingScreen && (
        <LoadingSplashScreen
          durationMs={2000}
          onFinish={() => setShowLoadingScreen(false)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
