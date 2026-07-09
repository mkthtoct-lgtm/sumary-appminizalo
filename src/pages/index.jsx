import React, { useEffect, useState } from "react";
import { Page, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
// IMPORT API CỦA ZALO VÀ BỘ NHỚ TẠM
import { getAccessToken, getPhoneNumber } from "zmp-sdk/apis";
import { globalFormMemory } from "../hooks/useFormState";

import mascotImg from "../static/images/Mascot Hito_9 1.png"; 
import bgIndex from "../static/images/bg_home1.png"; 
import iconLink from "../static/icons/chain.png"; 
import iconWeb from "../static/icons/world.png"; 
import iconUser from "../static/icons/brain.png"; 

const HomePage = () => {
  const navigate = useNavigate();
  const [phoneAccessState, setPhoneAccessState] = useState("requesting");

  // const menuLinks = [
  //   { label: "Thông tin thêm", img: iconLink, reverse: false, path: "/about" },
  //   { label: "Website chính thức", img: iconWeb, reverse: true, path: "/web" },
  //   { label: "Kiểm tra thần số học", img: iconUser, reverse: false, path: "/numerology" },
  // ];

  // ====================================================================
  // HÀM TỰ ĐỘNG XIN QUYỀN VÀ LẤY SỐ ĐIỆN THOẠI KHI MỞ APP
  // ====================================================================
  // globalFormMemory["user_phone"] = "0987654321";
  useEffect(() => {
    const clearStoredPhone = () => {
      globalFormMemory["user_phone"] = "";
      try {
        localStorage.removeItem("globalFormMemory:user_phone");
      } catch (storageError) {
        console.warn("Không thể xóa số điện thoại đã lưu:", storageError);
      }
    };

    const fetchZaloPhoneNumber = async () => {
      try {
        // 1. Lấy Access Token và Phone Token từ Zalo SDK
        // WelcomeScreen sử dụng getAccessToken và getPhoneNumber song song
        const accessToken = await getAccessToken({});
        const { token } = await getPhoneNumber({});

        if (token && accessToken) {
          // 2. Gửi dữ liệu lên endpoint mới: /get-phone-new
          const response = await fetch("https://survey-api.hto.edu.vn/get-phone-new", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken: accessToken,
              code: token, // 'code' ở đây chính là token từ getPhoneNumber
            }),
          });

          const data = await response.json();
          console.log("📞 Dữ liệu trả về từ /get-phone-new:", data);

          // 3. Trích xuất số điện thoại dựa trên cấu trúc linh hoạt của code mẫu
          const phoneNumber =
            data?.phoneNumber ||
            data?.data?.number ||
            data?.data?.phone_number ||
            data?.number ||
            null;

          if (phoneNumber) {
            // Lưu vào bộ nhớ tạm
            globalFormMemory["user_phone"] = phoneNumber;
            setPhoneAccessState("granted");
            console.log("✅ Đã lưu SĐT thành công:", phoneNumber);
            return;
          }

          clearStoredPhone();
          setPhoneAccessState("manual");
          console.warn("⚠️ Không tìm thấy SĐT trong response:", data);
          return;
        }

        clearStoredPhone();
        setPhoneAccessState("manual");
      } catch (error) {
        clearStoredPhone();
        setPhoneAccessState("manual");
        console.error("❌ Lỗi khi lấy số điện thoại Zalo:", error);
      }
    };

    fetchZaloPhoneNumber();
  }, []);

  return (
    <Page className="relative p-0 m-0 overflow-hidden font-['Be_Vietnam_Pro'] min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={bgIndex} alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Nút điều hướng nổi - Chỉ có nút Tiếp theo */}
      <div className="absolute top-[42px] right-4 z-[100]">
        <div onClick={() => navigate("/quiz1")} className="w-10 h-10 bg-white/70 backdrop-blur-md shadow-sm border border-white/50 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform">
          <Icon icon="zi-chevron-right" className="text-[#11397b] text-xl font-black pl-0.5" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-screen w-full">
        <div className="flex justify-around px-16 pt-[50px] gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-2 flex-1 bg-white rounded-full shadow-sm opacity-80"></div>
          ))}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-6">
          <div className="w-[80%] max-w-[260px] aspect-square flex items-center justify-center">
             <img src={mascotImg} alt="Mascot" className="w-full h-full object-contain" />
          </div>

          <h1 className="mt-6 text-[35px] md:text-[40px] font-black text-[#11397b] text-center leading-tight tracking-tighter drop-shadow-sm">
            Khám Phá Thế Giới <br /> Cùng Hito
          </h1>

          <button onClick={() => navigate("/quiz1")} className="mt-8 w-full max-w-[320px] py-4 bg-[#003570] text-white text-lg font-bold rounded-2xl shadow-xl active:scale-95 transition-all">
            Bắt đầu ngay
          </button>

          <p className="mt-3 max-w-[320px] text-center text-xs leading-5 font-medium text-[#11397b]">
            Chúng tôi xin quyền truy câp số điện thọai Zalo để hỗ trợ điền nhanh thông tin. <br /> Nếu bạn không chấp thuận, bạn vẫn có thể tiếp tục và tự nhập thông tin ở bước sau.
            {phoneAccessState === "granted" ? " Số điện thoại của bạn đã được nhận tự động." : ""}
          </p>
        </div>

        {/* <div className="px-10 pt-0 pb-10 flex flex-col gap-3">
          {menuLinks.map((item, index) => (
            <div key={index} onClick={() => navigate(item.path)} className={`flex items-center ${item.reverse ? "flex-row-reverse" : ""} group cursor-pointer`}>
              <div className={`bg-[#ffadad] w-12 h-12 flex items-center justify-center shadow-sm z-10 ${item.reverse ? "rounded-r-2xl rounded-l-none" : "rounded-l-2xl rounded-r-none"}`}>
                <img src={item.img} alt={item.label} className="w-6 h- object-contain" />
              </div>
              <div className={`flex-1 bg-white/30 backdrop-blur-lg py-3 px-2 rounded-2xl border border-white/40 text-[#11397b] font-semibold text-sm drop-shadow-sm ${item.reverse ? "rounded-r-none text-right mr-[-4px]" : "rounded-l-none ml-[-4px]"}`}>
                {item.label}
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </Page>
  );
};

export default HomePage;
