import React, { useState, useEffect } from "react";
import { Page, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
// IMPORT HÀM LƯU TRỮ VÀO ĐÂY
import { useFormState } from "../hooks/useFormState";

import mascotImg from "../static/images/Mascot Hito_9 1.png";
import mascotImg1 from "../static/images/Mascot Hito_1 7.png";
import mascotImg2 from "../static/images/Mascot Hito_8 1.png";
import bgIndex from "../static/images/bg_home1.png"; 

const Quiz1Page = () => {
  const navigate = useNavigate();
  
  // ================= CÁC BIẾN LƯU DỮ LIỆU (Dùng useFormState) =================
  const [name, setName] = useFormState("q1_name", "");
  const [email, setEmail] = useFormState("q1_email", "");
  const [className, setClassName] = useFormState("q1_class", "");
  
  const [gender, setGender] = useFormState("q1_gender", "Nam");
  const [isAgreed, setIsAgreed] = useFormState("q1_agreed", false);

  const [provinceInput, setProvinceInput] = useFormState("q1_province", "");
  const [schoolInput, setSchoolInput] = useFormState("q1_school", "");

  // ================= CÁC BIẾN TRẠNG THÁI UI (Dùng useState bình thường) =================
  const [provinces, setProvinces] = useState([]);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);

  // Gọi API Tỉnh Thành
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Lỗi khi tải tỉnh thành:", err));
  }, []);

  const handleSelectProvince = (pName) => {
    setProvinceInput(pName);
    setIsProvinceOpen(false);
    setSchoolInput(""); 
    
    // Đổ data mẫu hoặc gọi API trường học theo tỉnh
    setSchools(["THPT Lê Quý Đôn", "THPT Chuyên", "Khác"]); 
  };

  const handleSelectSchool = (sName) => {
    setSchoolInput(sName);
    setIsSchoolOpen(false);
  };

  // ================= LOGIC XỬ LÝ NHẬP LỚP HỌC (CHỈ CHO PHÉP 10, 11, 12) =================
  const handleClassChange = (e) => {
    // Chuyển in hoa luôn cho đẹp (vd: 10a1 -> 10A1)
    const val = e.target.value.toUpperCase();

    // Cho phép xóa rỗng
    if (val === "") {
      setClassName(val);
      return;
    }

    // Ký tự đầu tiên bắt buộc phải là số 1
    if (val.length === 1) {
      if (val === "1") setClassName(val);
      return;
    }

    // Từ ký tự thứ 2 trở đi, 2 số đầu bắt buộc phải là 10, 11 hoặc 12
    const prefix = val.substring(0, 2);
    if (["10", "11", "12"].includes(prefix)) {
      setClassName(val);
    }
  };

  // ================= LOGIC KIỂM TRA FORM (VALIDATION) =================
  const handleNext = () => {
    // 1. Kiểm tra xem có ô nào bị bỏ trống không (loại bỏ khoảng trắng 2 đầu bằng .trim())
    if (!name.trim() || !email.trim() || !provinceInput.trim() || !schoolInput.trim() || !className.trim()) {
      alert("Vui lòng điền đầy đủ các thông tin cá nhân!");
      return; 
    }

    // 2. Kiểm tra định dạng Email sơ bộ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert("Định dạng Email không hợp lệ!");
      return;
    }

    // Nếu vượt qua hết các bài kiểm tra trên thì mới cho chuyển trang
    navigate("/quiz2");
  };

  const SolidCaret = ({ isOpen, onClick }) => (
    <div className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center cursor-pointer z-20" onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 text-[#11397b] transition-transform duration-300 mt-2 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 320 512" fill="currentColor">
        <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
      </svg>
    </div>
  );

  return (
    <Page className="relative p-0 m-0 overflow-hidden font-['Be_Vietnam_Pro'] min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={bgIndex} alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* NÚT ĐIỀU HƯỚNG */}
      <div className="absolute top-[42px] left-0 w-full px-4 flex justify-between z-[100]">
        <div onClick={() => navigate("/")} className="w-10 h-10 bg-white/70 backdrop-blur-md shadow-sm border border-white/50 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform">
          <Icon icon="zi-chevron-left" className="text-[#11397b] text-xl font-black pr-0.5" />
        </div>
        
        {/* Nút mũi tên chuyển trang góc trên bên phải cũng cần bị chặn nếu chưa đồng ý */}
        <div 
          onClick={isAgreed ? handleNext : undefined} 
          className={`w-10 h-10 backdrop-blur-md shadow-sm border rounded-full flex items-center justify-center transition-transform ${isAgreed ? "bg-white/70 border-white/50 cursor-pointer active:scale-90" : "bg-white/40 border-white/30 opacity-50 cursor-not-allowed"}`}
        >
          <Icon icon="zi-chevron-right" className="text-[#11397b] text-xl font-black pl-0.5" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-screen w-full">
        
        {/* Progress Bar */}
        <div className="flex justify-around px-16 pt-[50px] gap-2 shrink-0 relative z-0">
          <div className="h-2 flex-1 bg-[#003570] rounded-full shadow-sm"></div>
          <div className="h-2 flex-1 bg-white rounded-full shadow-sm opacity-80"></div>
          <div className="h-2 flex-1 bg-white rounded-full shadow-sm opacity-80"></div>
          <div className="h-2 flex-1 bg-white rounded-full shadow-sm opacity-80"></div>
        </div>

        {/* Mascot */}
        <div className="flex justify-center items-end pt-6 -mb-8 relative z-0 pointer-events-none">
          <div className="w-40 translate-x-4"><img src={mascotImg1} className="w-full h-auto drop-shadow-lg" alt="mascot" /></div>
          <div className="w-40 -translate-x-4"><img src={mascotImg2} className="w-full h-auto scale-x-[-1] drop-shadow-lg" alt="mascot" /></div>
        </div>

        <div className="flex-1 px-4 pb-4 relative z-10 flex flex-col">
          <div className="bg-white/95 backdrop-blur-md rounded-[35px] shadow-2xl p-6 pt-10 h-full flex flex-col border border-white">
            <h2 className="text-[#11397b] text-center text-[26px] md:text-[28px] font-black mb-6 tracking-tighter uppercase drop-shadow-sm">
              Thông Tin Cá Nhân
            </h2>

            <div className="space-y-4 overflow-y-visible flex-1 pr-1 custom-scrollbar">
              
              <fieldset className="border-2 border-[#11397b] rounded-xl px-3 pb-1 bg-white relative z-0">
                <legend className="text-[#11397b] font-bold px-2 ml-2 text-xs">Họ và tên</legend>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="VD: Nguyễn Văn A" 
                  className="w-full bg-transparent outline-none text-[#11397b] font-medium py-1" 
                />
              </fieldset>

              <fieldset className="border-2 border-[#11397b] rounded-xl px-3 pb-1 bg-white relative z-0">
                <legend className="text-[#11397b] font-bold px-2 ml-2 text-xs">Email</legend>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="VD: hto@gmail.com" 
                  className="w-full bg-transparent outline-none text-[#11397b] font-medium py-1" 
                />
              </fieldset>

              <fieldset className="border-2 border-[#11397b] rounded-xl px-3 pb-1 relative bg-white z-50">
                <legend className="text-[#11397b] font-bold px-2 ml-2 text-xs">Tỉnh thành</legend>
                <div className="absolute inset-0 top-3 cursor-pointer z-10" onClick={() => setIsProvinceOpen(!isProvinceOpen)}></div>
                <input 
                  type="text" 
                  value={provinceInput} 
                  readOnly 
                  placeholder="Chọn tỉnh thành..." 
                  className="w-full bg-transparent outline-none text-[#11397b] font-medium py-1 pr-6 relative z-0 pointer-events-none" 
                />
                <SolidCaret isOpen={isProvinceOpen} onClick={() => setIsProvinceOpen(!isProvinceOpen)} />
                {isProvinceOpen && (
                  <ul className="absolute left-0 right-0 top-[110%] bg-white border-2 border-[#11397b] rounded-xl shadow-xl max-h-48 overflow-y-auto z-[99]">
                    {provinces.map((p) => (
                      <li key={p.code} onClick={() => handleSelectProvince(p.name)} className="px-4 py-2 text-[#11397b] font-medium hover:bg-slate-100 cursor-pointer border-b border-gray-100 last:border-none">
                        {p.name}
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>

              <fieldset className="border-2 border-[#11397b] rounded-xl px-3 pb-1 relative bg-white z-40">
                <legend className="text-[#11397b] font-bold px-2 ml-2 text-xs">Trường</legend>
                <input 
                  type="text" 
                  value={schoolInput} 
                  onChange={(e) => setSchoolInput(e.target.value)} 
                  onClick={() => setIsSchoolOpen(true)} 
                  placeholder="Nhập hoặc chọn trường..." 
                  className="w-full bg-transparent outline-none text-[#11397b] font-medium py-1 pr-8 relative z-10" 
                />
                <SolidCaret isOpen={isSchoolOpen} onClick={() => setIsSchoolOpen(!isSchoolOpen)} />
                {isSchoolOpen && (
                  <ul className="absolute left-0 right-0 top-[110%] bg-white border-2 border-[#11397b] rounded-xl shadow-xl max-h-48 overflow-y-auto z-[99]">
                    {schools.length > 0 ? schools.map((school, index) => (
                      <li key={index} onClick={() => handleSelectSchool(school)} className="px-4 py-2 text-[#11397b] font-medium hover:bg-slate-100 cursor-pointer border-b border-gray-100 last:border-none">
                        {school}
                      </li>
                    )) : (
                      <li className="px-4 py-2 text-gray-400 italic font-medium">Vui lòng chọn tỉnh thành trước</li>
                    )}
                  </ul>
                )}
              </fieldset>

              <div className="flex gap-3 h-14 relative z-10">
                <fieldset className="border-2 border-[#11397b] rounded-xl px-3 pb-1 relative flex-[1.2] bg-white">
                  <legend className="text-[#11397b] font-bold px-2 ml-2 text-xs">Lớp</legend>
                  <input 
                    type="text" 
                    value={className} 
                    onChange={handleClassChange}  
                    placeholder="10A5" 
                    className="w-full bg-transparent outline-none text-[#11397b] font-medium py-1" 
                  />
                </fieldset>
                <button onClick={() => setGender("Nam")} className={`flex-1 rounded-xl font-bold transition-all shadow-sm ${gender === "Nam" ? "bg-[#003570] text-white" : "bg-gray-100 text-gray-400"}`}>Nam</button>
                <button onClick={() => setGender("Nữ")} className={`flex-1 rounded-xl font-bold transition-all shadow-sm ${gender === "Nữ" ? "bg-[#ffadad] text-white" : "bg-gray-100 text-gray-400"}`}>Nữ</button>
              </div>

              <button 
                onClick={handleNext} 
                disabled={!isAgreed}
                className={`w-full py-4 text-lg font-bold rounded-2xl shadow-xl transition-all mt-2 relative z-10 ${
                  isAgreed 
                    ? "bg-[#003570] text-white active:scale-95 cursor-pointer" 
                    : "bg-gray-400 text-gray-100 opacity-60 cursor-not-allowed"
                }`}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>

        {/* ĐÃ FIX SHRINK-0 CHO HÌNH TRÒN Ở KHỐI NÀY */}
        <div className="px-8 pb-8 flex items-center gap-3 relative z-10">
          <div onClick={() => setIsAgreed(!isAgreed)} className={`w-6 h-6 shrink-0 border-2 border-[#11397b] rounded-full flex items-center justify-center transition-all cursor-pointer ${isAgreed ? "bg-[#11397b]" : "bg-transparent"}`}>
            {isAgreed && <Icon icon="zi-check" className="text-white scale-75" />}
          </div>
          <span className="text-[#11397b] text-sm font-semibold cursor-pointer leading-snug" onClick={() => setIsAgreed(!isAgreed)}>Tôi đồng ý sử dụng thông tin cho bài khảo sát</span>
        </div>
      </div>
    </Page>
  );
};

export default Quiz1Page;
