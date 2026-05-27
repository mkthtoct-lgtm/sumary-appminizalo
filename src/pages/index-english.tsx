import React, { useEffect, useState } from 'react';
import { Page, SnackbarProvider as ZMPSnackbarProvider } from 'zmp-ui'; 
import { openWebview, openChat } from 'zmp-sdk';

const SnackbarProvider = ZMPSnackbarProvider as unknown as React.ComponentType<any>;

import Background from '../components/Background';
import Welcome from '../components/Welcome';
import Form from '../components/Form';
import LanguageSelect from '../components/LanguageSelect';
import LevelSelect from '../components/LevelSelect';
import Quiz from '../components/Quiz-english.jsx';
import Result from '../components/Result-english.jsx';
import Wheel from '../components/Wheel';

const STORAGE_KEY = 'global_citizen_user_v1';

type Screen =
  | 'welcome'
  | 'form'
  | 'language'
  | 'level'
  | 'quiz'
  | 'result'
  | 'wheel';

type ZaloData = {
  phoneNumber?: string;
  fullName?: string;
  name?: string;
  [key: string]: any;
};

type UserData = {
  [key: string]: any;
};

type QuizSettings = {
  lang: string;
  level: string;
};

type ResultAnalysis = any;

const HomePageEnglish = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [zaloData, setZaloData] = useState<ZaloData | null>(null); 

  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    lang: 'en',
    level: 'easy',
  });

  const [resultData, setResultData] = useState<{
    score: number;
    analysis: ResultAnalysis | null;
  }>({
    score: 0,
    analysis: null,
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData: UserData = JSON.parse(savedData);
        console.log("✅ Tìm thấy dữ liệu cũ:", parsedData);
        setUserData(parsedData);
      }
    } catch (e) {
      console.error("Lỗi đọc cache:", e);
    }
  }, []);
  
  const handleStart = (dataFromZalo: ZaloData) => {
    console.log("📞 Dữ liệu Zalo nhận được tại index.tsx:", dataFromZalo);

    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
      console.log("👉 Đã có thông tin lưu trữ, bỏ qua Form.");
      if (!userData) setUserData(JSON.parse(savedData));
      setCurrentScreen('language');
    } else {
      console.log("👉 Chưa có thông tin, lưu dữ liệu Zalo và hiện Form.");
        
      if (dataFromZalo?.phoneNumber) {
        console.log("✅ Đã lấy được SĐT thành công để truyền vào Form:", dataFromZalo.phoneNumber);
      } else {
        console.log("⚠️ Không có SĐT, Form sẽ để trống trường này.");
      }

      setZaloData(dataFromZalo); 
      setCurrentScreen('form');
    }
  };

  const handleFormSubmit = (data: UserData) => {
    console.log("💾 Đang lưu thông tin mới...", data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUserData(data); 
    setCurrentScreen('language');
  };

  const handleResetInfo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);
    setZaloData(null);
    setCurrentScreen('form');
  };

  const handleLanguageSelect = (langCode: string) => {
    setQuizSettings(prev => ({ ...prev, lang: langCode }));
    setCurrentScreen('level');
  };

  const handleLevelSelect = (levelCode: string) => {
    setQuizSettings(prev => ({ ...prev, level: levelCode }));
    setCurrentScreen('quiz');
  };

  const handleQuizFinish = (score: number, analysis: ResultAnalysis) => {
    setResultData({ score, analysis });
    setCurrentScreen('result');
  };

  const handleGoToWheel = () => setCurrentScreen('wheel');

  const handleRestart = () => {
    setResultData({ score: 0, analysis: null });
    setCurrentScreen('welcome');
  };

  const handleBackToResult = () => setCurrentScreen('result');

  const openMessenger = () => {
    openWebview({
      url: "https://m.me/100083047195100",
      config: { style: "bottomSheet", leftButton: "back" },
    });
  };

  const openZaloOA = async () => {
    try {
      await openChat({
        type: "oa",
        id: "2112176407138597287",
        message: "Xin chào, tôi cần tư vấn!",
      });
    } catch (error) {
      openWebview({ url: "https://zalo.me/2112176407138597287" });
    }
  };

  return (
    <Page className="page !p-0 bg-[#1e3a8a]">
      <SnackbarProvider>
        <div className="relative flex h-[100dvh] min-h-screen w-full flex-col overflow-hidden bg-glossy font-sans text-gray-800">
          <Background />

          <main className="relative z-10 flex-grow w-full overflow-x-hidden overflow-y-auto px-4 py-5 pb-safe no-scrollbar sm:px-6">
            <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center py-4 sm:max-w-lg sm:py-6">
              
              {currentScreen === 'welcome' && (
                <Welcome onStart={handleStart} />
              )}
              
              {currentScreen === 'form' && (
                <Form 
                  onSubmit={handleFormSubmit} 
                  initialData={zaloData} 
                />
              )}
              
              {currentScreen === 'language' && (
                <div className="flex flex-col items-center w-full">
                  <LanguageSelect onSelect={handleLanguageSelect} />
                  <button 
                    onClick={handleResetInfo}
                    className="mt-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/70 shadow-sm backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white"
                  >
                    (Nhập lại thông tin cá nhân)
                  </button>
                </div>
              )}
              
              {currentScreen === 'level' && <LevelSelect onSelect={handleLevelSelect} />}
              
              {currentScreen === 'quiz' && (
                <Quiz 
                  settings={quizSettings} 
                  userData={userData} 
                  onFinish={handleQuizFinish} 
                />
              )}
              
              {currentScreen === 'result' && (
                <Result 
                  score={resultData.score} 
                  analysis={resultData.analysis} 
                  onRestart={handleRestart}
                />
              )}
              
              {currentScreen === 'wheel' && <Wheel onBack={handleBackToResult} />}

            </div>
          </main>
        </div>
      </SnackbarProvider>
    </Page>
  );
};

export default HomePageEnglish;
