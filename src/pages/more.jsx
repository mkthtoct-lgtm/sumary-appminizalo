import React from "react";
import { Page, useNavigate } from "zmp-ui";

// ĐÃ THÊM: Import hàm openWebview từ bộ SDK chính thức của Zalo
import { openWebview } from "zmp-sdk/apis";

// Lưu ý: Cập nhật lại tên đường dẫn ảnh cho khớp với thư mục của bạn
import bgIndex from "../static/images/bg_home1.png"; 
import hito1 from "../static/images/hito1.png"; // Thay bằng ảnh thumbnail phù hợp nếu có
import hito2 from "../static/images/hito2.png";
import hito3 from "../static/images/hito3.png";
import hito4 from "../static/images/hito4.png";

const MorePage = () => {
  const navigate = useNavigate();

  // Danh sách các thẻ khám phá
  const exploreItems = [
    { 
      id: 1, 
      title: "Hito Adventure", 
      description: "Tham gia các trò chơi để mang lại phần quà giới hạn!",
      link: "/home-adventure"
    },
    { 
      id: 2, 
      title: "Trắc Nghiệm Năng Lực Bản Thân", 
      description: "Giải mã bản thân và định hướng tương lai qua những con số.",
      link: "/career"
    },
    { 
      id: 3, 
      title: "Đánh Giá Ngoại Ngữ", 
      description: "Kiểm tra trình độ nhanh chóng và nhận lộ trình cá nhân hóa.",
      link: "/english" 
    },
    { 
      id: 4, 
      title: "Đánh Giá Hồ Sơ Visa", 
      description: "Phân tích tỷ lệ đỗ và tư vấn hoàn thiện giấy tờ du học.",
      link: "/visa-test"
    },
  ];

  return (
    <Page className="relative isolate p-0 m-0 overflow-hidden font-['Be_Vietnam_Pro'] min-h-screen flex flex-col bg-[#d8eaf8]">
      
      {/* --- BACKGROUND --- */}
      <img
        src={bgIndex}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover opacity-60 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col h-screen w-full pt-[60px] pb-8 px-5">
        
        {/* --- TIÊU ĐỀ "Khám phá thêm" CÓ VIỀN TRẮNG --- */}
        <div className="text-center mb-6">
          <h1 
            className="text-[34px] font-black text-[#003570] tracking-tight uppercase"
            style={{
              WebkitTextStroke: "2px white",
              paintOrder: "stroke fill",
              filter: "drop-shadow(0px 4px 2px rgba(0,53,112,0.15))"
            }}
          >
            Khám phá thêm
          </h1>
        </div>

        {/* --- DANH SÁCH CARD CÓ THỂ CUỘN --- */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <style>{`::-webkit-scrollbar { display: none; }`}</style>

          {exploreItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-[20px] p-3 flex gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/60"
            >
              {/* Ảnh Thumbnail */}
              <div className="w-[105px] h-[105px] shrink-0 rounded-2xl overflow-hidden border border-gray-100 bg-[#eef5fc] flex items-center justify-center relative">
                <img 
                  src={(() => {
                    switch(item.id) {
                      case 1: return hito1;
                      case 2: return hito2;
                      case 3: return hito3;
                      case 4: return hito4;
                      default: return hito1;
                    }
                  })()}
                  alt="Thumbnail" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Nội dung bên phải Card */}
              <div className="flex flex-col justify-between flex-1 py-1 pr-1">
                <div>
                  <h3 className="text-[20px] font-bold text-[#003570] leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 font-medium leading-[1.3] line-clamp-2 pr-1">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={async () => {
                      if (item.link.startsWith("http")) {
                        // ĐÃ SỬA: Gọi API gốc của Zalo để mở link ngoài
                        try {
                          await openWebview({
                            url: item.link,
                            config: {
                              style: "normal", // Mở toàn màn hình
                            }
                          });
                        } catch (error) {
                          console.error("Lỗi khi mở link Zalo:", error);
                        }
                      } else {
                        // Link nội bộ vẫn dùng navigate bình thường
                        navigate(item.link);
                      }
                    }}
                    className="bg-[#003570] text-white px-6 py-[10px] rounded-[10px] font-semibold text-sm active:scale-95 transition-transform"
                  >
                    Vào ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- NÚT THOÁT NẰM Ở ĐÁY --- */}
        <div className="mt-4 shrink-0">
          <button 
            onClick={() => navigate("/")} 
            className="w-full bg-[#003570] text-white text-lg font-bold py-[18px] rounded-[14px] active:scale-95 transition-transform shadow-lg"
          >
            Thoát
          </button>
        </div>

      </div>
    </Page>
  );
};

export default MorePage;
