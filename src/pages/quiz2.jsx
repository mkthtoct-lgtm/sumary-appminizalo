import React, { useState } from "react";
// Đã thêm Icon vào phần import
import { Page, useNavigate, Modal, Icon } from "zmp-ui";
import { useFormState } from "../hooks/useFormState";
import mascotImg from "../static/images/Mascot Hito_10 2.png"; 
import bgIndex from "../static/images/bg_home1.png"; 

const Quiz2Page = () => {
  const navigate = useNavigate();
  
  // State quản lý lựa chọn tổ hợp
  const [selectedBlock, setSelectedBlock] = useFormState("selectedBlock", null);
  const [isConfirmVisible, setIsConfirmVisible] = useFormState("isConfirmVisible", false);

  const examBlocks = [
    { id: "A", label: "Khối A (Toán, Lý, Hóa)" },
    { id: "A1", label: "Khối A1 (Toán, Lý, Anh)" },
    { id: "D", label: "Khối D (Toán, Văn, Anh)" },
    { id: "B", label: "Khối B (Toán, Hóa, Sinh)" },
    { id: "C", label: "Khối C (Văn, Sử, Địa)" },
  ];

  // Hàm xử lý khi bấm nút Ghi nhận
  const handleRecord = () => { 
    if (!selectedBlock) return alert("Vui lòng chọn khối!"); 
    setIsConfirmVisible(true); 
  };

  return (
    <Page className="relative p-0 m-0 overflow-hidden font-['Be_Vietnam_Pro'] min-h-screen flex flex-col">
      
      {/* Background Image */}
      <div className="absolute -inset-10 z-0 pointer-events-none">
        <img src={bgIndex} alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* ================= NÚT ĐIỀU HƯỚNG NỔI ================= */}
      <div className="absolute top-[42px] left-0 w-full px-4 flex justify-between z-[100]">
        
        {/* Nút Trở về */}
        <div 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-white/70 backdrop-blur-md shadow-sm border border-white/50 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <Icon icon="zi-chevron-left" className="text-[#11397b] text-xl font-black pr-0.5" />
        </div>

        {/* Nút Tiếp theo (Gọi hàm handleRecord để validate trước khi đi tiếp) */}
        <div 
          onClick={handleRecord} 
          className="w-10 h-10 bg-white/70 backdrop-blur-md shadow-sm border border-white/50 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <Icon icon="zi-chevron-right" className="text-[#11397b] text-xl font-black pl-0.5" />
        </div>

      </div>
       
      <div className="relative z-10 flex flex-col h-screen w-full">
        
        {/* Header Progress Bar - Đã sáng 2 thanh */}
        <div className="flex justify-around px-16 pt-[50px] gap-2 shrink-0">
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-white rounded-full shadow-sm opacity-80"></div>
          <div className="h-2 flex-1 bg-white rounded-full shadow-sm opacity-80"></div>
        </div>

        {/* Tiêu đề */}
        <h1 className="mt-8 text-[34px] md:text-[38px] font-black text-[#11397b] text-center leading-tight tracking-tighter px-4 shrink-0 drop-shadow-sm">
          Tổ hợp Tốt nghiệp
        </h1>

        {/* Khu vực nội dung có thể cuộn */}
        <div className="flex flex-col flex-1 overflow-y-auto mt-4">
          
          {/* Khung Glassmorphism chứa các tùy chọn */}
          <div className="bg-white/20 backdrop-blur-md border border-white/50 rounded-3xl p-5 mx-6 shadow-sm">
            {examBlocks.map((block) => (
              <div 
                key={block.id}
                onClick={() => setSelectedBlock(block.id)}
                className="flex items-center bg-white p-3.5 rounded-xl mb-3 last:mb-0 shadow-sm cursor-pointer transition-transform active:scale-95"
              >
                {/* Nút Radio tròn */}
                <div className="w-6 h-6 rounded-full border-2 border-[#11397b] flex items-center justify-center mr-3 shrink-0">
                  {selectedBlock === block.id && (
                    <div className="w-3 h-3 rounded-full bg-[#11397b]"></div>
                  )}
                </div>

                {/* Nhãn văn bản */}
                <span className="text-[15px] md:text-base font-bold text-[#11397b]">
                  {block.label}
                </span>
              </div>
            ))}
          </div>

          {/* Nút Ghi nhận */}
          <div className="px-6 mt-6 mb-4 shrink-0">
            <button 
              onClick={handleRecord}
              className="w-full py-4 bg-[#003570] text-white text-lg font-bold rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              Ghi nhận
            </button>
          </div>

          {/* Mascot Area */}
          <div className="flex justify-center items-end flex-1 pb-6 min-h-[120px] pointer-events-none">
            <div className="w-56 md:w-64">
               <img src={mascotImg} className="w-full h-auto object-contain drop-shadow-xl" alt="mascot" />
            </div>
          </div>
          
        </div>
      </div>

      {/* Hộp thoại xác nhận (ZMP Modal) */}
      <Modal
        visible={isConfirmVisible}
        title="Xác nhận"
        onClose={() => setIsConfirmVisible(false)}
        verticalActions
        description={`Bạn có chắc chắn muốn ghi nhận ${examBlocks.find(b => b.id === selectedBlock)?.label} không?`}
      >
        <div className="flex gap-3">
          <button 
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform"
            onClick={() => setIsConfirmVisible(false)}
          >
            Hủy
          </button>
          <button 
            className="flex-1 py-3 bg-[#003570] text-white font-bold rounded-xl active:scale-95 transition-transform"
            onClick={() => {
              setIsConfirmVisible(false);
              navigate("/quiz2_1"); // Đường dẫn trang tiếp theo
            }}
          >
            Xác nhận
          </button>
        </div>
      </Modal>

    </Page>
  );
};

export default Quiz2Page;
