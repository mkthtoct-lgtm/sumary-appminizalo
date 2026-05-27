import { useFormState, globalFormMemory } from "../hooks/useFormState";
import React, { useState } from "react";
import { Page, useNavigate, Modal, Icon } from "zmp-ui";
// Lưu ý: Đổi tên file ảnh mascot đội mũ cử nhân cho đúng với source của bạn
import mascotGradImg from "../static/images/Mascot Hito_2 1.png";
import bgIndex from "../static/images/bg_home1.png";

const Quiz2_2Page = () => {
  const navigate = useNavigate();

  // --- States cho Hệ đào tạo ---
  const [eduSystem, setEduSystem] = useFormState("eduSystem", "");
  const [isEduOpen, setIsEduOpen] = useFormState("isEduOpen", false);
  const eduOptions = ["Cao đẳng", "Đại học", "Trung cấp nghề", "Khác"];

  // --- States cho Ngành học ---
  const [major, setMajor] = useFormState("major", "");
  const [isMajorOpen, setIsMajorOpen] = useFormState("isMajorOpen", false);
  const majorOptions = ["Kinh tế", "Công nghệ thông tin (IT)", "Điện - Điện tử", "Du lịch - Khách sạn", "Ngôn ngữ", "Khác"];

  // State Modal xác nhận
  const [isConfirmVisible, setIsConfirmVisible] = useFormState("isConfirmVisible", false);

  // Xử lý Ghi nhận
  const handleRecord = () => {
    if (!eduSystem || !major) {
      alert("Vui lòng nhập/chọn đầy đủ Hệ đào tạo và Ngành học!");
      return;
    }
    setIsConfirmVisible(true);
  };

  const handleConfirm = async () => {
    setIsConfirmVisible(false);

    // Cập nhật giá trị tên để tránh bị Apps Script gán là "Khách Game"
    const finalName = globalFormMemory["q1_name"] || "Khách Khảo Sát";

    // 1. Gom toàn bộ dữ liệu từ các bước trước - ĐÃ CHUẨN HÓA KEY CHO APPS SCRIPT
    const payload = {
      sheet_name: "KHAO_SAT_HITO_V1",
      name: finalName,                    // Key 'name' để Apps Script lấy tên
      full_name: finalName,               // Backup thêm 'full_name' cho chắc chắn
      email: globalFormMemory["q1_email"] || "",
      gender: globalFormMemory["q1_gender"] || "",
      province: globalFormMemory["q1_province"] || "",
      school: globalFormMemory["q1_school"] || "N/A",      // Đảm bảo có giá trị để satisfies hasOwnProperty
      className: globalFormMemory["q1_class"] || "N/A",
      selectedBlock: globalFormMemory["selectedBlock"] || "N/A",
      pathway: "Trong nước",              // Key quan trọng để Apps Script nhận diện isKhaoSatHito
      eduSystem: eduSystem,
      major: major,
      phone: globalFormMemory["user_phone"] || "0912345678",
      studyCountry: "Việt Nam"             // Khớp với cột 'Quốc gia' trong Apps Script
    };

    console.log("📤 [Quiz2_2] Payload gửi đi:", JSON.stringify(payload, null, 2));

    try {
      // ĐÃ FIX: Chuyển về Domain của Server công ty để điện thoại không bị báo lỗi
      const response = await fetch("https://api.hto.edu.vn/api/khao-sat/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("📥 [Quiz2_2] Response từ server:", result);

      // Apps Script trả về thành công qua biến success hoặc result
      if (result.success || result.result === "success") {
        console.log("✅ Gửi thành công! Lưu vào:", result.sheet);
        navigate("/thanks");
      } else {
        alert("Lỗi: " + (result.message || "Không thể lưu dữ liệu"));
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ Backend!");
      console.error("❌ [Quiz2_2] Lỗi gửi dữ liệu:", error);
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
        <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
      </svg>
    </div>
  );

  // Xử lý đóng các dropdown khác khi click
  const toggleEdu = () => { setIsEduOpen(!isEduOpen); setIsMajorOpen(false); };
  const toggleMajor = () => { setIsMajorOpen(true); setIsEduOpen(false); };

  return (
    <Page className="relative p-0 m-0 overflow-hidden font-['Be_Vietnam_Pro'] min-h-screen flex flex-col">

      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
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

        {/* Header Progress Bar - Sáng 4 thanh (bước cuối). Đã chỉnh px-16 và pt-[50px] */}
        <div className="flex justify-around px-16 pt-[50px] gap-2 shrink-0 relative z-0">
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
        </div>

        {/* Mascot Area - Mascot Cử nhân */}
        <div className="flex justify-center items-end pt-12 -mb-8 relative z-0 pointer-events-none">
          <div className="w-48 md:w-56">
            <img src={mascotGradImg} className="w-full h-auto object-contain drop-shadow-lg" alt="mascot cử nhân" />
          </div>
        </div>

        {/* Form Container - ĐÃ SỬA Z-INDEX LÊN CAO NHẤT (z-[60]) ĐỂ KHÔNG BỊ KHỐI HOTLINE CHE */}
        <div className="flex-1 px-4 pb-4 relative z-[60] flex flex-col justify-start">
          <div className="bg-white/95 backdrop-blur-md rounded-[35px] shadow-2xl p-6 pb-8 flex flex-col border border-white">

            {/* Box Câu hỏi (Glassmorphism) */}
            <div className="bg-gradient-to-b from-[#e2ebf5]/80 to-[#ffffff]/90 backdrop-blur-sm border border-white rounded-3xl p-6 shadow-inner mb-8 flex items-center justify-center min-h-[110px]">
              <h2 className="text-[22px] md:text-[24px] font-black text-[#11397b] text-center leading-tight tracking-tighter drop-shadow-sm">
                Bạn chọn <br /> hệ đào tạo nào,<br />ngành bạn quan tâm <br />là gì?
              </h2>
            </div>

            {/* Form Fields Area */}
            <div className="flex flex-col gap-5 overflow-visible">

              {/* Dropdown 1: Hệ đào tạo (Chỉ chọn, không nhập) */}
              <fieldset className="border-2 border-[#11397b] rounded-xl px-3 pb-1 relative bg-white z-50">
                <legend className="text-[#11397b] font-bold px-2 ml-2 text-xs">Hệ đào tạo</legend>
                <div className="absolute inset-0 top-3 cursor-pointer z-10" onClick={toggleEdu}></div>
                <input
                  type="text"
                  value={eduSystem}
                  readOnly
                  placeholder="Cao đẳng, đại học, nghề,..."
                  className="w-full bg-transparent outline-none text-[#11397b] font-medium py-1 pr-6 relative z-0 pointer-events-none"
                />
                <SolidCaret isOpen={isEduOpen} onClick={toggleEdu} />

                {isEduOpen && (
                  <ul className="absolute left-0 right-0 top-[110%] bg-white border-2 border-[#11397b] rounded-xl shadow-xl max-h-48 overflow-y-auto z-[99]">
                    {eduOptions.map((opt, idx) => (
                      <li
                        key={idx}
                        onClick={() => { setEduSystem(opt); setIsEduOpen(false); }}
                        className="px-4 py-2 text-[#11397b] font-medium hover:bg-slate-100 cursor-pointer border-b border-gray-100 last:border-none"
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>

              {/* Dropdown 2: Ngành học (Vừa chọn vừa nhập) */}
              <fieldset className="border-2 border-[#11397b] rounded-xl px-3 pb-1 relative bg-white z-40">
                <legend className="text-[#11397b] font-bold px-2 ml-2 text-xs">Ngành học</legend>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  onClick={toggleMajor}
                  placeholder="Kinh tế, IT, điện,..."
                  className="w-full bg-transparent outline-none text-[#11397b] font-medium py-1 pr-8 relative z-10"
                />
                <SolidCaret isOpen={isMajorOpen} onClick={() => setIsMajorOpen(!isMajorOpen)} />

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

              {/* Nút Ghi nhận */}
              <button
                onClick={handleRecord}
                className="w-full py-4 bg-[#003570] text-white text-lg font-bold rounded-2xl shadow-xl active:scale-95 transition-all mt-2 relative z-10"
              >
                Ghi nhận
              </button>

            </div>
          </div>
        </div>

        {/* ================= KHỐI LIÊN HỆ ĐIỆN THOẠI ĐÃ ĐƯỢC TỐI ƯU ================= */}
        <div className="px-6 pb-10 flex w-full shrink-0 relative z-10">
          <div className="flex w-full items-stretch shadow-[0_8px_16px_rgba(0,0,0,0.08)] rounded-[14px] overflow-hidden border border-white/60">
            <div className="bg-[#ffadad] w-[60px] shrink-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 512 512">
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
              </svg>
            </div>
            <div className="flex-1 bg-white/70 backdrop-blur-xl py-[14px] px-2 flex justify-center items-center text-center">
              <span className="text-[#11397b] font-semibold text-[15px] tracking-wide">
                Liên hệ tại: <span className="font-black text-[#ff4d4f] ml-1 text-[16px]">1800 9078</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Hộp thoại xác nhận */}
      <Modal
        visible={isConfirmVisible}
        title="Xác nhận"
        onClose={() => setIsConfirmVisible(false)}
        verticalActions
      >
        <div className="text-center mb-6 text-[#11397b] font-medium text-base">
          Bạn chắc chắn muốn chọn <br />
          <span className="font-bold text-lg text-[#ff4d4f]">{eduSystem}</span> <br />
          ngành <span className="font-bold text-lg text-[#ff4d4f]">{major}</span> chứ?
        </div>
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform"
            onClick={() => setIsConfirmVisible(false)}
          >
            Hủy
          </button>
          <button
            className="flex-1 py-3 bg-[#003570] text-white font-bold rounded-xl active:scale-95 transition-transform"
            onClick={handleConfirm}
          >
            Xác nhận
          </button>
        </div>
      </Modal>

    </Page>
  );
};

export default Quiz2_2Page;
