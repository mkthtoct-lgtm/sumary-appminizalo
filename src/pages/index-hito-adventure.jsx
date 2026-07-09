import React, { useState } from "react";
import { Box, Button, Page, Text, Modal } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { globalFormMemory } from "../hooks/useFormState";
import "../css/home-style.css";
import bgMain from "../assets/bg_main.png";
import mascot from "../assets/mascot-CdQs06Pp.png";
import iconMockhoa from "../assets/icon_mockhoa.png";
import iconSach from "../assets/icon_sach.png";
import iconKhoahoc from "../assets/icon_khoahoc.png";

function HomePageAdventure() {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  // Hàm xây dựng dữ liệu người chơi dựa trên quiz và fallback từ Zalo SDK
  const buildPlayerData = (target) => {
    // Lưu dữ liệu quiz đã có vào localStorage để sử dụng trong game
    const savedQuizData = {
      name: globalFormMemory["q1_name"] || "",
      full_name: globalFormMemory["q1_name"] || "",
      email: globalFormMemory["q1_email"] || "",
      gender: globalFormMemory["q1_gender"] || "",
      province: globalFormMemory["q1_province"] || "",
      school: globalFormMemory["q1_school"] || "",
      className: globalFormMemory["q1_class"] || "",
      selectedBlock: globalFormMemory["selectedBlock"] || "",
      phone: globalFormMemory["user_phone"] || "",
      birthday: globalFormMemory["birthday"] || "01/01/2000",
    };

    let fallbackZaloData = {};
    try {
      fallbackZaloData = JSON.parse(localStorage.getItem("hito_zalo_data") || "{}");
    } catch {
      fallbackZaloData = {};
    }

    const playerData = {
      ...savedQuizData,
      name: savedQuizData.name || fallbackZaloData.name || "Khách hàng",
      full_name: savedQuizData.full_name || fallbackZaloData.name || "Khách hàng",
      phone: savedQuizData.phone || fallbackZaloData.phone || "",
      email: savedQuizData.email || fallbackZaloData.email || "",
      birthday: savedQuizData.birthday || fallbackZaloData.birthday || "01/01/2000",
      target_page: target,
      form_type: target === "/lucky-spin" ? "Lucky_Spin" : "Hito_Adventure",
      created_at: new Date().toISOString(),
    };

    localStorage.setItem("hito_player_data", JSON.stringify(playerData));
    localStorage.removeItem("hito_target_page");
    return playerData;
  };

  // Hàm xử lý khi nhấn nút "Chơi Ngay"
  const handlePlayNow = (target = "/game") => {
    const hasQuizData = Boolean(
      globalFormMemory["q1_name"] ||
      globalFormMemory["q1_email"] ||
      globalFormMemory["q1_class"] ||
      globalFormMemory["selectedBlock"]
    );

    if (hasQuizData) {
      buildPlayerData(target);
      navigate(target);
      return;
    }

    // Fallback an toàn n?u ngu?i dùng chua di?n quiz tru?c dó
    navigate("/user-info");
  };
  return (
    <Page className="home-page-container">
      <img
        src={bgMain}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <Box className="home-header">
        <Text className="logo-main-text">HITO</Text>
        <Text className="logo-main-text">ADVENTURE</Text>
        <Box className="logo-sub-pill">
          <Text className="logo-sub-text-white">by HTO Group</Text>
        </Box>
      </Box>

      <Box className="home-main-card">
        <Box className="mascot-container">
          <img src={mascot} alt="Hito Mascot" className="mascot-image" />
        </Box>

        <Box className="mt-6 text-center w-full">
          <Text className="text-[#0e4b75] font-black text-4xl uppercase tracking-tight mb-2 italic">Tích điểm đổi quà</Text>
          <Box className="h-1 w-16 bg-[#3a9edb] mx-auto rounded-full mb-3 opacity-40" />

          <Box flex justifyContent="space-around" className="mb-6 items-end px-2">
            <RewardItem img={iconMockhoa} name="MÓC KHÓA" pts="55" />
            <RewardItem img={iconSach} name="SÁCH HỌC" pts="75" />
            <RewardItem img={iconKhoahoc} name="KHOÁ HỌC" pts="100" />
          </Box>
        </Box>

        <Box className="w-full flex justify-center gap-4 items-stretch">
          <Box className="relative flex-1 max-w-xs">
            <Button className="btn-play-now w-full" onClick={() => handlePlayNow("/game")}>
              VƯỢT SÓNG CÙNG HTO
            </Button>
            <Button
              className="guide-float-btn absolute -top-2 -right-2 z-20"
              onClick={() => setShowGuide(true)}
              aria-label="Cách chơi"
            >
              <span className="guide-float-mark">!</span>
            </Button>
          </Box>
          <Button className="btn-lucky-spin flex-1 max-w-xs" onClick={() => handlePlayNow("/lucky-spin")}>VÒNG QUAY MAY MẮN</Button>
        </Box>
      </Box>

      <Button
        className="btn-back-explore mx-auto mt-2"
        onClick={() => navigate("/more")}
      >
        QUAY LẠI KHÁM PHÁ
      </Button>

      <Modal visible={showGuide} title="HƯỚNG DẪN CHƠI" onClose={() => setShowGuide(false)} verticalActions>
        <Box className="p-4">
          <Box className="space-y-4">
            <GuideStep step="1" content="Nhấn 'CHƠI NGAY' để bắt đầu." />
            <GuideStep step="2" content="Vượt chướng ngại vật để tích điểm." />
            <GuideStep step="3" content="Dùng điểm đổi quà từ HTO Group." />
          </Box>
          <Button fullWidth className="mt-6 bg-[#3a9edb] rounded-full font-bold text-white h-12" onClick={() => setShowGuide(false)}>ĐÃ HIỂU!</Button>
        </Box>
      </Modal>
    </Page>
  );
}

const GuideStep = ({ step, content }) => (
  <Box flex alignItems="flex-start" className="mb-3">
    <Box className="bg-[#3a9edb] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">{step}</Box>
    <Text className="ml-3 text-[#0e4b75] font-medium">{content}</Text>
  </Box>
);

const RewardItem = ({ img, name, pts }) => (
  <Box flex flexDirection="column" alignItems="center" className="w-[31%]">
    <img src={img} alt={name} className="h-16 w-16 object-contain mb-2 drop-shadow-md" />
    <Text size="xxxxSmall" className="text-[#0e4b75] font-black uppercase text-center leading-tight h-8 flex items-center justify-center tracking-tight">{name}</Text>
    <Text bold size="small" className="text-[#3a9edb] mt-1 font-extrabold">{pts} điểm</Text>
  </Box>
);

export default HomePageAdventure;
