import React, { useState } from 'react';
import { DataAuthorizationScreen } from './components/DataAuthorizationScreen';
import { ScreenId, UserProfile, Activity722State } from './types';
import { Scr00Landing } from './components/Scr00Landing';
import { Scr01Onboarding } from './components/Scr01Onboarding';
import { Scr02Nickname } from './components/Scr02Nickname';
import { Scr03Home } from './components/Scr03Home';
import { Scr04ExpertList } from './components/Scr04ExpertList';
import { ExpertProfile } from './components/ExpertProfile';
import { WaCareMessages } from './components/WaCareMessages';
import { RealNameVerification } from './components/RealNameVerification';
import { Scr08BloodPressure } from './components/Scr08BloodPressure';
import { HealthDataScreen } from './components/HealthDataScreen';

export function App() {
  // 預設登入狀態並直接進入「健康數據」頁面 ('HEALTH-DATA')
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('HEALTH-DATA');
  const [selectedExpertId, setSelectedExpertId] = useState<'aimee' | 'bliss'>('aimee');
  const [showBPModal, setShowBPModal] = useState(false);

  // User Profile State (預設已有登入帳號資料)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nickname: '陳小明',
    realName: '陳小明',
    birthday: '1985-06-15',
    gender: '男',
    idNumber: 'A123456789',
    phone: '0912345678',
    email: 'chen.xiaoming@example.com',
    height: '175',
    weight: '70',
    bloodType: 'O',
  });

  // Followed experts state (預設自動追蹤 Wa 邦尼人工智慧)
  const [followedExperts, setFollowedExperts] = useState<string[]>(['wa-bunny']);

  // Activity State
  const [activityState, setActivityState] = useState<Activity722State>({
    step1Authorized: false,
    authorizedExpert: null,
    step2RealNameCompleted: true,
    step3Eligible: true,
    step4RecordedToday: false,
    records: [],
  });

  const handleAuthorizeSuccess = (expId: 'aimee' | 'bliss') => {
    setActivityState((prev) => ({
      ...prev,
      step1Authorized: true,
      authorizedExpert: expId,
    }));
    setFollowedExperts((prev) => (prev.includes(expId) ? prev : [...prev, expId]));
  };

  const handleToggleFollow = (expertId: string) => {
    setFollowedExperts((prev) =>
      prev.includes(expertId) ? prev.filter((id) => id !== expertId) : [...prev, expertId]
    );
  };

  return (
    <div className="flex min-h-screen w-screen flex-col overflow-hidden bg-[var(--bg-base-secondary)] font-sans antialiased text-[var(--text-base-default)]">
      {/* Main Mobile App Frame Stage */}
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <div className="relative flex h-[852px] w-[393px] flex-col overflow-hidden bg-[var(--bg-base-default)] shadow-[var(--shadow-sm)]">
          
          {/* SCREEN ROUTING */}

          {currentScreen === 'SCR-00' && (
            <Scr00Landing
              onLoginRegister={() => setCurrentScreen('SCR-01')}
              onSkipToHome={() => setCurrentScreen('SCR-03')}
            />
          )}

          {currentScreen === 'SCR-01' && (
            <Scr01Onboarding
              onNavigateNext={() => setCurrentScreen('SCR-02')}
              onNavigateBack={() => setCurrentScreen('SCR-00')}
            />
          )}

          {currentScreen === 'SCR-02' && (
            <Scr02Nickname
              nickname={userProfile.nickname}
              setNickname={(val) => setUserProfile((prev) => ({ ...prev, nickname: val }))}
              onNavigateNext={() => setCurrentScreen('SCR-03')}
              onNavigateBack={() => setCurrentScreen('SCR-01')}
            />
          )}

          {currentScreen === 'SCR-03' && (
            <Scr03Home
              nickname={userProfile.nickname}
              onNavigate={setCurrentScreen}
              onOpenBloodPressure={() => setShowBPModal(true)}
              onOpenExperts={() => setCurrentScreen('SCR-04')}
            />
          )}

          {currentScreen === 'SCR-04' && (
            <Scr04ExpertList
              onNavigate={setCurrentScreen}
              onSelectExpert={(expId) => {
                setSelectedExpertId(expId);
                setCurrentScreen('EXPERT-DETAIL');
              }}
              step1Authorized={activityState.step1Authorized}
              authorizedExpert={activityState.authorizedExpert}
              followedExperts={followedExperts}
              onToggleFollow={handleToggleFollow}
            />
          )}

          {currentScreen === 'EXPERT-DETAIL' && (
            <ExpertProfile
              expertId={selectedExpertId}
              onNavigate={setCurrentScreen}
              activityState={activityState}
              onAuthorizeSuccess={handleAuthorizeSuccess}
            />
          )}

          {currentScreen === 'MESSAGES' && (
            <WaCareMessages
              onNavigate={setCurrentScreen}
              followedExperts={followedExperts}
              step1Authorized={activityState.step1Authorized}
              authorizedExpert={activityState.authorizedExpert}
            />
          )}

          {currentScreen === 'DATA-AUTHORIZATION' && (
            <DataAuthorizationScreen
              expertId={selectedExpertId}
              onNavigate={setCurrentScreen}
              onAuthorizeSuccess={handleAuthorizeSuccess}
            />
          )}

          {currentScreen === 'REAL-NAME' && (
            <RealNameVerification
              profile={userProfile}
              onUpdateProfile={(updated) => setUserProfile(updated)}
              onNavigateBack={() => setCurrentScreen('SCR-03')}
            />
          )}

          {currentScreen === 'HEALTH-DATA' && (
            <HealthDataScreen
              onNavigate={setCurrentScreen}
              nickname={userProfile.nickname}
            />
          )}

          {/* Blood Pressure Input Keypad Modal (SCR-08) */}
          {(showBPModal || currentScreen === 'SCR-08') && (
            <Scr08BloodPressure
              onCancel={() => {
                setShowBPModal(false);
                if (currentScreen === 'SCR-08') setCurrentScreen('SCR-03');
              }}
              onComplete={(data) => {
                setActivityState((prev) => ({
                  ...prev,
                  step4RecordedToday: true,
                  records: [data, ...prev.records],
                }));
                setShowBPModal(false);
                if (currentScreen === 'SCR-08') setCurrentScreen('SCR-03');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
