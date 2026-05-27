import React, { useState } from "react";
// Nhớ import thêm Icon
import { Page, useNavigate, Modal, Icon } from "zmp-ui";

import mascotThinkingImg from "../static/images/sticker_hito_15 1.png"; 
import bgIndex from "../static/images/bg_home1.png"; 

const Quiz2_1Page = () => {
  const navigate = useNavigate();
  
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [currentOption, setCurrentOption] = useState({ label: "", path: "" });

  const handleOptionClick = (label, path) => {
    setCurrentOption({ label, path });
    setIsConfirmVisible(true);
  };

  const handleConfirm = () => {
    setIsConfirmVisible(false);
    navigate(currentOption.path); 
  };

  return (
    <Page className="relative p-0 m-0 overflow-hidden font-['Be_Vietnam_Pro'] min-h-screen flex flex-col">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={bgIndex} alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* ================= NÚT ĐIỀU HƯỚNG NỔI (Chỉ có nút Lùi) ================= */}
      <div className="absolute top-[42px] left-4 z-[100]">
        <div 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-white/70 backdrop-blur-md shadow-sm border border-white/50 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <Icon icon="zi-chevron-left" className="text-[#11397b] text-xl font-black pr-0.5" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-screen w-full">
        
        {/* Header Progress Bar - Đã chỉnh px-16 và pt-[50px] để né nút Lùi */}
        <div className="flex justify-around px-16 pt-[50px] gap-2 shrink-0">
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-white rounded-full shadow-sm opacity-80"></div>
        </div>

        {/* Mascot Area */}
        <div className="flex justify-center items-end pt-20 -mb-10 relative z-0 pointer-events-none">
          <div className="w-52 md:w-60">
             <img src={mascotThinkingImg} className="w-full h-auto object-contain object-bottom drop-shadow-lg" alt="mascot suy nghĩ" />
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-4 pb-12 relative z-10 flex flex-col justify-end">
          <div className="bg-white/95 backdrop-blur-md rounded-[35px] shadow-2xl p-6 pb-10 flex flex-col border border-white">
            
            {/* Khung câu hỏi (Glassmorphism Effect) */}
            <div className="bg-gradient-to-b from-[#e2ebf5]/80 to-[#ffffff]/90 backdrop-blur-sm border border-white rounded-3xl p-8 shadow-inner mb-6 flex items-center justify-center min-h-[140px]">
              <h2 className="text-[28px] md:text-[30px] font-black text-[#11397b] text-center leading-tight tracking-tighter drop-shadow-sm">
                Sau tốt nghiệp, bạn dự định <br /> học tập ở đâu?
              </h2>
            </div>

            {/* Các nút tùy chọn */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleOptionClick("Trong nước", "/quiz2_2")} 
                className="w-full py-5 bg-[#003570] text-white text-[19px] font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
              >
                Trong nước
              </button>

              <button 
                onClick={() => handleOptionClick("Ngoài nước (Du học)", "/quiz2_3")} 
                className="w-full py-5 bg-[#003570] text-white text-[19px] font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
              >
                Ngoài nước (Du học)
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Hộp thoại xác nhận (Modal) */}
      <Modal
        visible={isConfirmVisible}
        title="Xác nhận"
        onClose={() => setIsConfirmVisible(false)}
        verticalActions
      >
        <div className="text-center mb-6 text-[#11397b] font-medium text-base">
          Bạn chắc chắn muốn chọn <br/>
          <span className="font-bold text-lg text-[#ff4d4f]">"{currentOption.label}"</span> chứ?
        </div>
        <div className="flex gap-3">
          <button 
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform"
            onClick={() => setIsConfirmVisible(false)}
          >
            Không
          </button>
          <button 
            className="flex-1 py-3 bg-[#003570] text-white font-bold rounded-xl active:scale-95 transition-transform"
            onClick={handleConfirm}
          >
            Có
          </button>
        </div>
      </Modal>

    </Page>
  );
};

export default Quiz2_1Page;
