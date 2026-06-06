import React, { useState, useEffect, useCallback } from "react";
import { Box, Page, Text } from "zmp-ui";
import api from "zmp-sdk";
import { getUserInfo } from "zmp-sdk/apis";
import { useVisaTest } from "../context/VisaTestContext";

const LOADING_TIMEOUT_MS = 6000;
const FISH_HTO_URL = "https://i.ibb.co/ZRBsM4Xw/sticker-hito-06-removebg-preview-1.png";

const OceanBackground = () => {
  return (
    <Box className="ocean-scene" style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden", top: 0, left: 0, background: "#01579b" }}>
      <div className="ocean-sky"></div>
      <div className="wave-layer wave-back"></div>
      <div className="wave-layer wave-middle"></div>
      <div className="wave-layer wave-front"></div>
      <div className="sea-foam foam-1"></div>
      <div className="ocean-overlay"></div>
    </Box>
  );
};

function UserInfoForm() {
  const { setUserInfo, setStep, zaloData, setZaloData } = useVisaTest();

  const readPrefillData = () => {
    try {
      const candidates = [
        localStorage.getItem('hito_player_data'),
        localStorage.getItem('global_citizen_user_v1'),
      ].filter(Boolean);

      const parsed = candidates.map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      }).find(Boolean);

      const quizMemory = {
        name: localStorage.getItem('globalFormMemory:q1_name'),
        email: localStorage.getItem('globalFormMemory:q1_email'),
        phone: localStorage.getItem('globalFormMemory:user_phone'),
        school: localStorage.getItem('globalFormMemory:q1_school'),
      };

      const normalizeStoredValue = (value) => {
        if (!value) return '';
        try {
          const decoded = JSON.parse(value);
          return typeof decoded === 'string' ? decoded : '';
        } catch {
          return String(value);
        }
      };

      return {
        name:
          parsed?.full_name ||
          parsed?.fullName ||
          parsed?.name ||
          normalizeStoredValue(quizMemory.name),
        phone:
          parsed?.phone ||
          parsed?.phone_number ||
          parsed?.phoneNumber ||
          normalizeStoredValue(quizMemory.phone),
        email:
          parsed?.email ||
          parsed?.userEmail ||
          parsed?.user_email ||
          normalizeStoredValue(quizMemory.email),
        school:
          parsed?.school_name ||
          parsed?.schoolName ||
          parsed?.school ||
          normalizeStoredValue(quizMemory.school),
      };
    } catch {
      return { name: '', phone: '', email: '', school: '' };
    }
  };

  const prefillData = readPrefillData();
  useEffect(() => {
    // If there is prefill data from earlier forms, ensure zaloData has it as fallback
    try {
      if (prefillData && (prefillData.name || prefillData.phone || prefillData.email)) {
        setZaloData(prev => ({
          ...(prev || {}),
          name: prev?.name || prefillData.name || '',
          phone: prev?.phone || prefillData.phone || '',
          email: prev?.email || prefillData.email || '',
        }));
      }
    } catch (e) {
      // ignore
    }
  }, []);
  const [phase, setPhase] = useState(zaloData.fetched ? "form" : "loading");
  const [formData, setFormData] = useState({
    full_name: prefillData.name || zaloData.name || "",
    birth_date: "",
    phone: prefillData.phone || zaloData.phone || "",
    email: prefillData.email || "",
  });

  const [lockedFields, setLockedFields] = useState({ full_name: false });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  useEffect(() => { if (api.setStatusBar) api.setStatusBar({ type: "hidden" }); }, []);

  useEffect(() => {
    if (zaloData.fetched) return;
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await getUserInfo({});
        const info = res?.userInfo || res;
        if (mounted) {
          setZaloData(prev => ({ ...prev, name: info?.name || prefillData.name || "", avatar: prev.avatar || info?.avatar || "", fetched: true }));
          setFormData(prev => ({
            ...prev,
            full_name: info?.name || prefillData.name || prev.full_name,
            phone: prev.phone || prefillData.phone,
            email: prev.email || prefillData.email,
          }));
          setLockedFields({ full_name: false });
          setPhase("form");
        }
      } catch (e) { 
        if (mounted) setPhase("form"); 
      }
    };
    const timeoutId = setTimeout(() => { if (mounted) setPhase("form"); }, LOADING_TIMEOUT_MS);
    fetchData();
    return () => { mounted = false; clearTimeout(timeoutId); };
  }, [zaloData.fetched]);

  const isValidEmail = (e) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
    const e = {};
    if (!formData.full_name?.trim()) e.full_name = "Vui lòng nhập Họ và Tên";
    if (!isValidEmail(formData.email)) e.email = "Email không hợp lệ";
    if (!formData.birth_date) e.birth_date = "Vui lòng chọn Ngày sinh";
    if (!agreed) e.agreed = "Bạn cần đồng ý để tiếp tục";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    
    setUserInfo(prev => ({ 
        ...prev, 
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        birth_date: formData.birth_date,
        zaloAvatar: zaloData.avatar 
    }));
    setStep("visa_type");
  };

  const inputStyle = (hasError, isLocked) => ({
    width: "100%", 
    minHeight: "56px", 
    padding: "0 18px", 
    borderRadius: 18, 
    fontSize: 16, 
    border: `2px solid ${hasError ? "#ef4444" : "#01579b"}`,
    background: isLocked ? "#f8fafc" : "#fff", 
    color: isLocked ? "#64748b" : "#01579b", 
    outline: "none", 
    fontWeight: 700,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    WebkitAppearance: "none",
    appearance: "none",
    position: "relative" // Đảm bảo position relative để ::before hoạt động đúng
  });

  if (phase === "loading") {
    return (
      <Page>
        <OceanBackground />
        <Box style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10 }}>
            <Box className="anim-spin" style={{ width: 40, height: 40, border: "4px solid #fff", borderTopColor: "#00acc1", borderRadius: "50%" }} />
        </Box>
      </Page>
    );
  }

  const fields = [
    { name: "full_name", label: "Họ và Tên", type: "text", placeholder: "Nhập họ và tên", icon: "👤", locked: lockedFields.full_name },
    { name: "birth_date", label: "Ngày sinh", type: "date", placeholder: "Chọn ngày sinh", icon: "📅", locked: false, className: "input-date-custom" },
    { name: "email", label: "Email", type: "email", placeholder: "example@gmail.com", icon: "📧", locked: false },
  ];

  return (
    <Page style={{ position: "relative", overflow: "hidden", background: "#e0f7fa" }}>
      <OceanBackground />
      
      <Box style={{ position: "relative", zIndex: 10, padding: "28px 14px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box style={{ position: "relative", width: "100%", maxWidth: 420 }}>
          
          <Box style={{ position: "absolute", top: -80, right: -10, width: 120, height: 120, zIndex: 15, animation: "fish-float 3s ease-in-out infinite" }}>
            <img src={FISH_HTO_URL} style={{ width: "100%", objectFit: "contain" }} />
          </Box>

          <Box className="app-card" style={{ padding: '24px 16px', borderRadius: 45, background: 'rgba(255,255,255,0.95)', border: "3px solid #01579b", backdropFilter: "blur(10px)" }}>
            
            <Box style={{ textAlign: "center", marginBottom: 18 }}>
              <Box style={{ display: "inline-block", background: "#01579b", padding: "6px 20px", borderRadius: 20, marginBottom: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "1px" }}>HỒ SƠ THÀNH VIÊN</Text>
              </Box>
              <Text style={{ fontSize: 28, fontWeight: 900, color: "#01579b" }}>Thông Tin Cá Nhân</Text>
            </Box>

            <Box style={{ display: "flex", alignItems: "center", gap: 12, background: "#f0f9ff", borderRadius: 24, padding: "12px", border: "1px solid #bae6fd", marginBottom: 18 }}>
              <img src={zaloData.avatar || "https://via.placeholder.com/150"} style={{ width: 60, height: 60, borderRadius: 20, border: "2px solid #fff", objectFit: "cover" }} />
              <Box>
                <Text style={{ fontSize: 18, fontWeight: 900, color: "#01579b" }}>{formData.full_name || zaloData.name || "Khách hàng"}</Text>
                <Text style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>📱 {formData.phone || "Thành viên"}</Text>
              </Box>
            </Box>

            <Box style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
              {fields.map((f) => (
                <Box key={f.name}>
                  <Box style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, paddingLeft: 6 }}>
                    <Text style={{ fontSize: 14 }}>{f.icon}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 800, color: "#01579b", textTransform: 'uppercase' }}>{f.label}</Text>
                  </Box>
                      <input 
                        type={f.type} 
                        name={f.name} 
                        value={formData[f.name]} 
                        onChange={f.locked ? undefined : handleChange} 
                        readOnly={f.locked} 
                        placeholder={f.placeholder} 
                        className={`custom-input-modern ${f.className || ''}`}
                        style={{
                          ...inputStyle(errors[f.name], f.locked),
                          ...(f.type === 'date'
                            ? { color: formData.birth_date ? '#01579b' : 'transparent' }
                            : {}),
                        }}
                      />
                  {errors[f.name] && <Text style={{ color: "#ef4444", fontSize: 11, fontWeight: 800, marginTop: 4, marginLeft: 8 }}>⚠️ {errors[f.name]}</Text>}
                </Box>
              ))}
            </Box>

            <Box 
              onClick={() => { setAgreed(!agreed); setErrors(p => ({...p, agreed: ""})) }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", borderRadius: 20, background: agreed ? "#f0fdf4" : "#f8fafc", border: `1.5px solid ${agreed ? "#86efac" : "#e2e8f0"}`, cursor: "pointer", marginBottom: 18 }}
            >
              <Box style={{ width: 24, height: 24, borderRadius: 8, border: `2px solid ${agreed ? "#10b981" : "#cbd5e1"}`, background: agreed ? "#10b981" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {agreed && <Text style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>✓</Text>}
              </Box>
              <Text style={{ fontSize: 13, fontWeight: 700, color: agreed ? "#166534" : "#64748b" }}>Tôi đồng ý để HTO Group tư vấn visa.</Text>
            </Box>

            <Box style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep("start")} style={{ flex: 1, padding: "14px", borderRadius: 18, border: "none", background: "#f1f5f9", color: "#475569", fontWeight: 800 }}>QUAY LẠI</button>
              <button onClick={handleSubmit} style={{ flex: 2, padding: "14px", borderRadius: 18, border: "none", background: agreed ? "linear-gradient(90deg, #01579b, #00acc1)" : "#cbd5e1", color: "#fff", fontWeight: 800, transition: "0.3s" }}>TIẾP TỤC →</button>
            </Box>
          </Box>
        </Box>
      </Box>

      <style>{`
        .custom-input-modern {
            line-height: normal;
        }

        /* CHỈ SỬA PHẦN NÀY ĐỂ FIX LỖI OVERLAP */
        .input-date-custom::-webkit-calendar-picker-indicator {
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
            -webkit-appearance: none;
            z-index: 2;
        }

        .input-date-custom::before {
            content: "Ngày sinh";
            width: 100%;
            color: #94a3b8;
            font-weight: 500;
            display: ${formData.birth_date ? 'none' : 'block'};
            position: absolute;
            pointer-events: none;
            z-index: 1;
        }

        @keyframes fish-float { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
        .anim-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </Page>
  );
}

export default UserInfoForm;
