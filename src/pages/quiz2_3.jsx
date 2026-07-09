import React from "react";
import { Page, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useFormState, globalFormMemory } from "../hooks/useFormState";
import { isSuccessfulSurveyResponse, submitSurveyPayload } from "../utils/surveySubmit";

import mascotStudyAbroadImg from "../static/images/Mascot Hito_2 3.png"; 
import bgIndex from "../static/images/bg_home1.png"; 

const Quiz2_3Page = () => {
  const navigate = useNavigate();
  
  // --- States cho Quốc gia ---
  const [studyCountry, setStudyCountry] = useFormState("q3_studyCountry", "");
  const [isCountryOpen, setIsCountryOpen] = useFormState("q3_isCountryOpen", false);
  const countryOptions = ["Mỹ", "Nhật Bản", "Hàn Quốc", "Úc", "Canada", "Anh", "Singapore", "Khác"];

  // --- States cho Ngành học ---
  const [major, setMajor] = useFormState("q3_major", "");
  const [isMajorOpen, setIsMajorOpen] = useFormState("q3_isMajorOpen", false);
  const majorOptions = ["Kinh tế", "Kỹ thuật", "Công nghệ thông tin (IT)", "Y Dược", "Nghệ thuật - Thiết kế", "Khác"];

  // Modal xác nhận đã gỡ: gửi dữ liệu ngay khi bấm Ghi nhận

  // Xử lý Ghi nhận
  const handleRecord = () => {
    if (!studyCountry || !major) {
      alert("Vui lòng nhập/chọn đầy đủ Quốc gia và Ngành học!");
      return;
    }
    // Gửi trực tiếp (không hiển thị modal xác nhận)
    handleConfirm();
  };

  const handleConfirm = async () => {
    // Không cần set modal visibility
    const normalizedPhone = String(globalFormMemory["user_phone"] || "").trim();
    if (!/^0\d{9}$/.test(normalizedPhone)) {
      alert("Vui lòng quay lại bước Thông tin cá nhân để nhập số điện thoại hợp lệ trước khi ghi nhận!");
      navigate("/quiz1");
      return;
    }

    // 1. Gom toàn bộ dữ liệu từ các bước trước
    const payload = {
      sheet_name: "KHAO_SAT_HITO_V1",
      
  name: globalFormMemory["q1_name"] || "",
  full_name: globalFormMemory["q1_name"] || "",            // Backup thêm 'full_name' cho chắc chắn
      // name: globalFormMemory["q1_name"] || "",
      email: globalFormMemory["q1_email"] || "",
      gender: globalFormMemory["q1_gender"] || "",
      province: globalFormMemory["q1_province"] || "",
      school: globalFormMemory["q1_school"] || "",
      className: globalFormMemory["q1_class"] || "",
      selectedBlock: globalFormMemory["selectedBlock"] || "",
      pathway: "Ngoài nước (Du học)", 
      
      // BIẾN QUỐC GIA ĐÃ ĐƯỢC CHUẨN HÓA THÀNH studyCountry
      studyCountry: studyCountry,  
      major: major,
      phone: normalizedPhone,
    };

    console.log("📤 [Quiz2_3] Payload gửi đi:", JSON.stringify(payload, null, 2));
    console.log("🎯 Pathway:", payload.pathway);
    console.log("🎯 School:", payload.school);
    console.log("🎯 SelectedBlock:", payload.selectedBlock);

    try {
      const { response, result, responseText, endpoint } = await submitSurveyPayload(payload);
      console.log("📥 [Quiz2_3] Response từ server (%s):", endpoint, result);
      console.log("💾 Bảng lưu vào:", result.sheet || "Không xác định");

      if (isSuccessfulSurveyResponse(result, responseText)) {
        console.log("✅ Gửi thành công! Lưu vào:", result.sheet);
        navigate("/thanks");
      } else {
        alert("Lỗi: " + (result.message || responseText || "Không thể lưu dữ liệu"));
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ Backend!");
      console.error("❌ [Quiz2_3] Lỗi gửi dữ liệu:", error);
    }
  };

  // SVG Icon Tam giác Dropdown
  const SolidCaret = ({ isOpen, onClick }) => (
    <div 
      className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center cursor-pointer z-20"
      onClick={onClick}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`w-3 h-3 text-[#11397b] transition-transform duration-300 mt-2 ${isOpen ? "rotate-180" : ""}`} 
        viewBox="0 0 320 512" 
        fill="currentColor"
      >
        <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
      </svg>
    </div>
  );

  const toggleCountry = () => { setIsCountryOpen(!isCountryOpen); setIsMajorOpen(false); };
  const toggleMajor = () => { setIsMajorOpen(!isMajorOpen); setIsCountryOpen(false); };

  return (
    <Page className="relative p-0 m-0 overflow-hidden font-['Be_Vietnam_Pro'] min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={bgIndex} alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="absolute top-[42px] left-0 w-full px-4 flex justify-between z-[100]">
        <div 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-white/70 backdrop-blur-md shadow-sm border border-white/50 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <Icon icon="zi-chevron-left" className="text-[#11397b] text-xl font-black pr-0.5" />
        </div>

        <div 
          onClick={handleRecord} 
          className="w-10 h-10 bg-white/70 backdrop-blur-md shadow-sm border border-white/50 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <Icon icon="zi-chevron-right" className="text-[#11397b] text-xl font-black pl-0.5" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-screen w-full">
        <div className="flex justify-around px-16 pt-[50px] gap-2 shrink-0 relative z-0">
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
        </div>

        <div className="flex justify-center items-end pt-12 -mb-8 relative z-0 pointer-events-none">
          <div className="w-64 md:w-72">
             <img src={mascotStudyAbroadImg} className="w-full h-auto object-contain drop-shadow-lg" alt="mascot du học" />
          </div>
        </div>

        <div className="flex-1 px-4 pb-12 relative z-10 flex flex-col justify-start">
          <div className="bg-white/95 backdrop-blur-md rounded-[35px] shadow-2xl p-6 pb-8 flex flex-col border border-white h-full">
            
            <div className="bg-gradient-to-b from-[#e2ebf5]/80 to-[#ffffff]/90 backdrop-blur-sm border border-white rounded-3xl p-6 shadow-inner mb-8 flex items-center justify-center min-h-[110px]">
              <h2 className="text-[22px] md:text-[26px] font-black text-[#11397b] text-center leading-tight tracking-tighter px-2 drop-shadow-sm">
                Quốc gia <br /> và ngành học<br/>bạn quan tâm là gì?
              </h2>
            </div>

            <div className="flex flex-col gap-5 overflow-visible">
              
              <fieldset className="border-2 border-[#11397b] rounded-xl px-3 pb-1 relative bg-white z-50">
                <legend className="text-[#11397b] font-bold px-2 ml-2 text-xs">Quốc Gia</legend>
                <input 
                  type="text"
                  value={studyCountry}
                  onChange={(e) => setStudyCountry(e.target.value)}
                  onClick={toggleCountry}
                  placeholder="Mỹ, Nhật Bản,..." 
                  className="w-full bg-transparent outline-none text-[#11397b] font-medium py-1 pr-8 relative z-10" 
                />
                <SolidCaret isOpen={isCountryOpen} onClick={toggleCountry} />
                
                {isCountryOpen && (
                  <ul className="absolute left-0 right-0 top-[110%] bg-white border-2 border-[#11397b] rounded-xl shadow-xl max-h-48 overflow-y-auto z-[99]">
                    {countryOptions.map((opt, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => { setStudyCountry(opt); setIsCountryOpen(false); }}
                        className="px-4 py-2 text-[#11397b] font-medium hover:bg-slate-100 cursor-pointer border-b border-gray-100 last:border-none"
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>

              <fieldset className="border-2 border-[#11397b] rounded-xl px-3 pb-1 relative bg-white z-40">
                <legend className="text-[#11397b] font-bold px-2 ml-2 text-xs">Ngành học</legend>
                <input 
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  onClick={toggleMajor}
                  placeholder="Kinh tế, Kĩ thuật" 
                  className="w-full bg-transparent outline-none text-[#11397b] font-medium py-1 pr-8 relative z-10" 
                />
                <SolidCaret isOpen={isMajorOpen} onClick={toggleMajor} />
                
                {isMajorOpen && (
                  <ul className="absolute left-0 right-0 top-[110%] bg-white border-2 border-[#11397b] rounded-xl shadow-xl max-h-48 overflow-y-auto z-[99]">
                    {majorOptions.map((opt, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => { setMajor(opt); setIsMajorOpen(false); }}
                        className="px-4 py-2 text-[#11397b] font-medium hover:bg-slate-100 cursor-pointer border-b border-gray-100 last:border-none"
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>

              <button 
                onClick={handleRecord}
                className="w-full py-4 bg-[#003570] text-white text-lg font-bold rounded-2xl shadow-xl active:scale-95 transition-all mt-4 relative z-10"
              >
                Ghi nhận
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận đã gỡ — gửi dữ liệu ngay khi bấm Ghi nhận */}
    </Page>
  );
};

export default Quiz2_3Page;
