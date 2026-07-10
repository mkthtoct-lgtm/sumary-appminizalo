import React, { useEffect } from "react";
import { Page, useNavigate, Icon } from "zmp-ui";

// Lưu ý: Thay đổi tên file hình ảnh mascot tung hoa giấy cho phù hợp với dự án
import mascotThanksImg from "../static/images/arigato.png"; 
import bgIndex from "../static/images/bg_home1.png"; 

// ================= NHÚNG CÁC ICON CỦA BẠN VÀO ĐÂY =================
import iconNumerology from "../static/icons/brain.png"; // Thay bằng tên file icon Thần số học của bạn
import iconGame from "../static/icons/game.png";        // Thay bằng tên file icon Game của bạn
import iconWeb from "../static/icons/world.png";        // Thay bằng tên file icon Website của bạn
import iconContact from "../static/icons/phone.png";      // Thay bằng tên file icon Liên hệ của bạn
// =================================================================

const ThanksPage = () => {
  const navigate = useNavigate();

  // Tự động chuyển sang trang 'more' sau 3 giây
  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/more");
    }, 2000);
    return () => clearTimeout(t);
  }, [navigate]);

  // Danh sách các nút link
  const menuLinks = [
    { label: "Website chính thức", path: "/website", img: iconWeb },
    { label: "Liên hệ tư vấn", path: "/contact", img: iconContact },
  ];

  return (
    <Page className="relative p-0 m-0 overflow-hidden font-['Be_Vietnam_Pro'] min-h-screen flex flex-col items-center">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src={bgIndex} 
          alt="Background" 
          className="w-full h-full object-cover opacity-80" 
        />
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

      <div className="flex flex-col h-screen w-full max-w-md mx-auto relative z-10 px-8 pt-10">
        
        {/* Mascot lớn */}
        <div className="w-[85%] mx-auto mb-2 mt-4 pointer-events-none">
          <img 
            src={mascotThanksImg} 
            alt="Hoàn thành" 
            className="w-full h-auto object-contain drop-shadow-2xl" 
          />
        </div>

        <h1 className="text-[36px] md:text-[40px] font-black text-[#11397b] text-center leading-tight tracking-tighter mb-8 uppercase drop-shadow-md">
          Bạn đã <br /> hoàn thành!
        </h1>

        <div className="flex flex-col gap-4 w-full px-2">
          {menuLinks.map((item, index) => (
            <div 
              key={index} 
              onClick={() => navigate(item.path)}
              className="flex items-center group cursor-pointer w-full active:scale-95 transition-transform"
            >
              {/* Box chứa Icon màu hồng */}
              <div className="bg-[#ffadad] w-[60px] h-[52px] flex items-center justify-center z-10 rounded-l-[18px] shadow-md">
                <img 
                  src={item.img} 
                  alt={item.label} 
                  className="w-6 h-6 object-contain drop-shadow-sm" 
                />
              </div>

              {/* Box chứa Text Glassmorphism */}
              <div className="flex-1 bg-white/30 backdrop-blur-xl py-[14px] px-5 rounded-r-[18px] border border-white/50 text-white font-semibold text-[16px] ml-[-4px] tracking-wide shadow-sm">
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Tự động chuyển tiếp sang /more sau 5s; modal gỡ khỏi UI */}

    </Page>
  );
};

export default ThanksPage;
