import React, { useEffect, useState } from 'react';
import { Box, Page, Text, Modal, useNavigate } from 'zmp-ui';
import api from 'zmp-sdk';
import { followOA, getPhoneNumber, getAccessToken } from 'zmp-sdk/apis';
import { useVisaTest } from '../context/VisaTestContext';
import { decodeZaloPhone } from '../services/apiService'; 
import { globalFormMemory } from '../hooks/useFormState';

const OA_ID = '2112176407138597287';

const AVATAR_LIST = [
  "https://i.ibb.co/s9VTh77V/Thie-t-ke-chu-a-co-te-n-1.png",
  "https://i.ibb.co/Txsn49YN/Thie-t-ke-chu-a-co-te-n-2.png",
  "https://i.ibb.co/chT61x8t/Thie-t-ke-chu-a-co-te-n-3.png",
  "https://i.ibb.co/ds8Df2FS/Thie-t-ke-chu-a-co-te-n-4.png",
  "https://i.ibb.co/zV1HcpBy/Thie-t-ke-chu-a-co-te-n-5.png",
  "https://i.ibb.co/99GPrmnF/Thie-t-ke-chu-a-co-te-n-6.png",
];

const OceanBackground = () => {
  const skyObjects = [
    { id: 1, icon: '✈️', type: 'plane', top: '10%', size: '24px', dur: '18s', delay: '0s' },
    { id: 2, icon: '🕊️', type: 'bird',  top: '15%', size: '20px', dur: '22s', delay: '3s' },
    { id: 3, icon: '✈️', type: 'plane', top: '22%', size: '24px', dur: '25s', delay: '10s', flip: true },
    { id: 4, icon: '🕊️', type: 'bird',  top: '28%', size: '20px', dur: '20s', delay: '6s' },
    { id: 5, icon: '🕊️', type: 'bird',  top: '12%', size: '20px', dur: '16s', delay: '14s' },
  ];

  const clouds = [
    { top: '3%', left: '5%', size: '55px', dur: '15s' },
    { top: '19%', right: '15%', size: '60px', dur: '15s' },
    { top: '8%', right: '30%', size: '65px', dur: '15s' },
  ];

  return (
    <Box className="ocean-scene" style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', top: 0, left: 0, background: '#01579b' }}>
      <div className="ocean-sky"></div>
      {clouds.map((c, i) => (
        <Box key={`cloud-${i}`} style={{
          position: 'absolute', top: c.top, left: c.left, right: c.right,
          fontSize: c.size, opacity: 0.5, zIndex: 1,
          animation: `float-slow ${c.dur} ease-in-out infinite`
        }}>☁️</Box>
      ))}
      {skyObjects.map((obj) => (
        <Box key={obj.id} style={{
          position: 'absolute', top: obj.top, fontSize: obj.size, zIndex: 2,
          animation: `plane-fly ${obj.dur} linear infinite ${obj.delay}`,
          transform: obj.flip ? 'scaleX(-1)' : 'none',
          pointerEvents: 'none', opacity: 0.9
        }}>
          <span style={{ display: 'inline-block', animation: obj.type === 'bird' ? 'wing-flap 0.6s ease-in-out infinite' : 'none' }}>
            {obj.icon}
          </span>
        </Box>
      ))}
      <div className="wave-layer wave-back"></div>
      <div className="wave-layer wave-middle"></div>
      <div className="wave-layer wave-front"></div>
      <div className="sea-foam foam-1"></div>
      <div className="ocean-overlay"></div>
    </Box>
  );
};

function StartScreen() {
  const { setStep, setZaloData } = useVisaTest();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const getFirstFormData = () => {
    try {
      const saved = localStorage.getItem('hito_player_data');
      const parsed = saved ? JSON.parse(saved) : null;

      const parseMemoryValue = (value) => {
        if (!value) return '';
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      };

      return {
        name: parsed?.full_name || parsed?.fullName || parsed?.name || globalFormMemory['q1_name'] || '',
        phone: parsed?.phone || parsed?.phoneNumber || parsed?.phone_number || globalFormMemory['user_phone'] || '',
        email: parsed?.email || parsed?.userEmail || globalFormMemory['q1_email'] || '',
        avatar: parsed?.avatar || '',
      };
    } catch {
      return {
        name: globalFormMemory['q1_name'] || '',
        phone: globalFormMemory['user_phone'] || '',
        email: globalFormMemory['q1_email'] || '',
        avatar: '',
      };
    }
  };

  const normalizePhone = (rawPhone) => {
    if (!rawPhone) return '';
    let cleaned = rawPhone.replace(/\D/g, ''); 
    if (cleaned.startsWith('84')) cleaned = '0' + cleaned.substring(2);
    else if (cleaned.startsWith('+84')) cleaned = '0' + cleaned.substring(3);
    return cleaned;
  };

  const handleLogoClick = () => {
    if (isRotating) return;
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 600);
  };

  const handleStart = async () => {
    if (isStarting) return;
    setIsStarting(true);
    
    try {
      // 1. Theo dõi OA
      try { await followOA({ id: OA_ID }); } catch (e) {}

      // 2. Lấy Access Token - NẾU LỖI THÌ DỪNG LUỒN LẤY SĐT
      let actToken = null;
      try {
        actToken = await getAccessToken({});
      } catch (e) {
        console.error("❌ Lỗi -1401: App chưa kích hoạt trên Dashboard Zalo!");
        // Không có token thì không làm bước tiếp theo để tránh lỗi 400
        setIsStarting(false);
        setShowPopup(true); 
        return; 
      }
      
      // 3. Hiện Popup xin quyền SĐT
      const phoneRes = await getPhoneNumber({});

      if (phoneRes?.token && actToken) {
        // 4. Gửi xuống Backend giải mã
        const phoneData = await decodeZaloPhone({ 
          accessToken: actToken, 
          code: phoneRes.token 
        });

        if (phoneData) {
          const formattedPhone = normalizePhone(phoneData);
          setZaloData(prev => ({ ...prev, phone: formattedPhone }));
          console.log("✅ Lấy SĐT thành công:", formattedPhone);
        }
      }
    } catch (e) {
      console.error("❌ Lỗi quy trình:", e);
    } finally {
      setIsStarting(false);
      setShowPopup(true);
    }
  };

  const handleSelectAvatar = (url) => {
    const firstFormData = getFirstFormData();
    setZaloData(prev => ({
      ...prev,
      avatar: url,
      name: prev.name || firstFormData.name,
      phone: prev.phone || firstFormData.phone,
      email: prev.email || firstFormData.email,
    }));
    setShowPopup(false);
    setStep('user_info');
  };

  const roadmapSteps = [
    { id: '01', title: 'Kết Nối Cùng HTO', desc: 'Chia sẻ thông tin cơ bản để chúng mình biết bạn là ai và đang cần gì.' },
    { id: '02', title: 'Giải Mã Cơ Hội Visa', desc: 'Thực hiện bài trắc nghiệm nhỏ để AI "đọc vị" điểm mạnh trong hồ sơ của bạn.' },
    { id: '03', title: 'Nhận Lộ Trình Hạnh Phúc', desc: 'Sở hữu báo cáo chi tiết và giải pháp thực tế nhất từ chuyên gia HTO Group.' },
  ];

  return (
    <Page style={{ position: 'relative', overflow: 'hidden', background: '#e0f7fa' }}>
      <OceanBackground />

      <Modal 
        visible={showPopup} 
        onClose={() => setShowPopup(false)} 
        title={
            <Box style={{ textAlign: 'center', width: '100%' }}>
                <Text style={{ fontWeight: 900, color: '#01579b', fontSize: 18, letterSpacing: '1px' }}>
                    CHỌN NHÂN VẬT ĐẠI DIỆN
                </Text>
                <Box style={{ width: 40, height: 4, background: '#00acc1', margin: '4px auto', borderRadius: 10 }} />
            </Box>
        }
      >
        <Box className="avatar-grid-container" style={{ padding: '10px 0 20px' }}>
            <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {AVATAR_LIST.map((url, i) => (
                <Box 
                key={i} 
                onClick={() => handleSelectAvatar(url)} 
                className="avatar-card-item shine-effect"
                style={{ 
                    borderRadius: 22, 
                    overflow: 'hidden', 
                    border: '4px solid #01579b', 
                    cursor: 'pointer', 
                    background: 'linear-gradient(135deg, #fff, #e0f7fa)', 
                    boxShadow: '0 8px 15px rgba(1, 87, 155, 0.15)',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    animation: `floating-subtle ${3 + i*0.2}s ease-in-out infinite`
                }}
                >
                <img src={url} alt={`avatar-${i}`} style={{ width: '100%', display: 'block', transition: 'transform 0.4s' }} className="avatar-img" />
                <Box className="select-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0, 172, 193, 0.2)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
                    <Text style={{ color: '#fff', fontWeight: 900, fontSize: 12 }}>CHỌN</Text>
                </Box>
                </Box>
            ))}
            </Box>
            <Text style={{ textAlign: 'center', fontSize: 13, color: '#546e7a', fontWeight: 700, marginTop: 20 }}>
                Nhân vật này sẽ đồng hành cùng bạn <br/> trong suốt lộ trình đánh giá Visa!
            </Text>
        </Box>
      </Modal>

      <Box style={{ padding: '60px 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', position: 'relative', zIndex: 10 }}>
        <Box className="app-card card-deep-sea anim-fade-up floating-card" style={{ 
          width: '100%', maxWidth: 460, textAlign: 'center', padding: '40px 18px', 
          borderRadius: 55, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', background: 'rgba(255, 255, 255, 0.98)',
          position: 'relative', border: '5px solid #01579b', backdropFilter: 'blur(10px)'
        }}>
          
          <Box onClick={handleLogoClick} style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 15px', cursor: 'pointer', perspective: '1000px' }}>
            <Box className="pulse-ring-inner" style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '2px solid rgba(0, 172, 193, 0.4)' }} />
            <Box className="logo-shiny-container" style={{ 
              width: '100%', height: '100%', borderRadius: '50%', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #01579b',
              overflow: 'hidden', position: 'relative', zIndex: 2,
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isRotating ? 'rotateY(360deg) scale(1.1)' : 'scale(1)',
              boxShadow: isRotating ? '0 0 30px rgba(0, 172, 193, 0.6)' : '0 10px 25px rgba(0,0,0,0.1)',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)', 
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}>
               <Box style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, #ffffff 0%, #c3e0f6 100%)', zIndex: 1 }} />
               <img 
                 src="https://i.ibb.co/spWWgyp2/Gemini-Generated-Image-ouu4cuouu4cuouu4.png" 
                 alt="Logo_HITO" 
                 style={{ 
                   width: '100%', 
                   height: '100%', 
                   objectFit: 'contain', 
                   zIndex: 2, 
                   mixBlendMode: 'multiply',
                   position: 'relative'
                 }} 
               />
               <Box className="logo-shine" style={{ position: 'absolute', top: 0, left: '-150%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', transform: 'skewX(-20deg)', zIndex: 3 }} />
            </Box>
          </Box>

          <Box style={{ marginBottom: 15, position: 'relative', overflow: 'hidden' }}>
            <Box className="text-shiny-mask">
                <Text style={{ fontSize: 37, fontWeight: 900, color: '#01579b', lineHeight: 1.5 }}>
                    ĐÁNH GIÁ <span className="visa-cyan" style={{ color: '#01579b' }}>VISA</span>
                </Text>
            </Box>
            <Box className="title-line" style={{ width: 80, height: 4, background: 'linear-gradient(90deg, #01579b, #01579b)', margin: '5px auto', borderRadius: 10 }} />
          </Box>

          <Box style={{ textAlign: 'left', marginBottom: 10 }}>
            {roadmapSteps.map((step, i) => (
              <Box key={i} style={{ display: 'flex', gap: 10, position: 'relative', marginBottom: i !== roadmapSteps.length - 1 ? 5 : 0 }}>
                {i !== roadmapSteps.length - 1 && <Box style={{ position: 'absolute', left: 16, top: 15, height: '100%', width: 5, borderLeft: '2px dashed #01579b' }} />}
                <Box style={{ width: 38, height: 38, borderRadius: 14, background: 'linear-gradient(135deg, #01579b, #01579b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2, color: '#fff', fontWeight: 900 }}>{step.id}</Box>
                <Box>
                  <Text style={{ fontSize: 16, fontWeight: 800, color: '#01579b' }}>{step.title}</Text>
                  <Text style={{ fontSize: 14, color: '#546e7a' }}>{step.desc}</Text>
                </Box>
              </Box>
            ))}
          </Box>

          <button onClick={handleStart} className="btn-start-shiny" style={{ 
            width: '100%', padding: '16px', borderRadius: 20, border: 'none', 
            background: 'linear-gradient(90deg, #01579b, #00acc1, #01579b)', 
            backgroundSize: '200% auto', color: '#fff', fontSize: 19, fontWeight: 900, 
            boxShadow: '0 12px 30px rgba(0, 172, 193, 0.4)', cursor: 'pointer', overflow: 'hidden'
          }}>
            {isStarting ? <Box className="anim-spin" style={{ width: 20, height: 20, border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} /> : "🚀 BẮT ĐẦU NGAY"}
          </button>

          <button
            onClick={() => navigate('/more')}
            style={{
              width: '100%',
              padding: '10px 15px',
              marginTop: 10,
              borderRadius: 15,
              border: '1px solid rgba(1, 87, 155, 0.18)',
              background: 'rgba(255, 255, 255, 0.75)',
              color: '#01579b',
              fontSize: 15,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 18px rgba(1, 87, 155, 0.08)',
            }}
          >
            Quay lại khám phá
          </button>
          
          <Text style={{ fontSize: 14, color: '#90a4ae', marginTop: 20, fontWeight: 600 }}>
             Phát triển bởi <span className="hto-link" style={{ color: '#01579b', textDecoration: 'none', cursor: 'pointer', padding: '5px', position: 'relative' }}>HTO Group</span>
          </Text>
        </Box>
      </Box>

      <style>{`
        .avatar-card-item:hover { transform: scale(1.08) translateY(-5px); border-color: #00acc1; box-shadow: 0 12px 25px rgba(0, 172, 193, 0.3); }
        .avatar-card-item:active { transform: scale(0.95); }
        .avatar-card-item:hover .avatar-img { transform: scale(1.1); }
        .avatar-card-item:hover .select-overlay { opacity: 1; }
        
        @keyframes floating-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }

        .shine-effect::after {
            content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
            transform: skewX(-25deg); animation: shine 4s infinite;
        }
        @keyframes shine { 0% { left: -150%; } 20% { left: 150%; } 100% { left: 150%; } }

        .logo-shiny-container::after { 
            content: ''; position: absolute; top: 0; left: -150%; width: 80%; height: 100%; 
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent); 
            transform: skewX(-20deg); z-index: 4; 
            animation: shine-sweep 4s infinite ease-in-out; 
        }

        .text-shiny-mask::after { content: ''; position: absolute; top: 0; left: -150%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent); transform: skewX(-30deg); animation: shine-sweep-text 5s infinite; z-index: 3; }
        
        @keyframes floating { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .floating-card { animation: floating 4s ease-in-out infinite; }
        
        @keyframes shine-btn { to { background-position: 200% center; } }
        .btn-start-shiny { animation: shine-btn 3s linear infinite; }
        .btn-start-shiny:active { transform: scale(0.96); }
        
        @keyframes shine-sweep { 0% { left: -150%; } 20% { left: 150%; opacity: 1; } 100% { left: 150%; opacity: 0; } }
        @keyframes shine-sweep-text { 0% { left: -150%; } 15% { left: 150%; opacity: 1; } 100% { left: 150%; opacity: 0; } }
        @keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 0.8; } 100% { transform: scale(1.2); opacity: 0; } }
        .pulse-ring-inner { animation: pulse-ring 2.5s infinite; }
        .anim-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .hto-link:hover { color: #00acc1; transition: 0.3s; }
      `}</style>
    </Page>
  );
}

export default StartScreen;
