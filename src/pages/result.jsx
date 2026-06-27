import React from "react";
import { Box, Button, Page, Text } from "zmp-ui";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/result-style.css";
import bgMain from "../assets/bg_main.png";
import mascot from "../assets/mascot-CdQs06Pp.png";
import iconMockhoa from "../assets/icon_mockhoa.png";
import iconSach from "../assets/icon_sach.png";
import iconKhoahoc from "../assets/icon_khoahoc.png";

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const score = location.state?.score || 0;

  const handleGoHome = () => {
    // Data đã được gửi ở GamePage rồi, ở đây chỉ quay về Home thôi
    navigate("/home-adventure", { replace: true });
  };

  return (
    <Page className="result-page-container">
      <img
        src={bgMain}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <Box className="result-header">
        <Text className="logo-main-text">HITO</Text>
        <Text className="logo-text-large" style={{ lineHeight: "0.8" }}>ADVENTURE</Text>
        <Box className="bg-[#0e4b75] px-3 py-0.5 rounded-full mt-2 mx-auto w-fit">
          <Text className="text-white font-bold text-[10px] uppercase tracking-widest">By HTO Group</Text>
        </Box>
      </Box>

      <Box className="result-main-card">
        <Box className="result-mascot-container">
          <img src={mascot} alt="Mascot" className="result-mascot-img" />
        </Box>

        <Box className="mt-14 text-center w-full">
          <Text className="text-[#0e4b75] font-black text-4xl uppercase italic">Điểm của bạn</Text>
          <Box className="flex items-baseline justify-center ">
            <Text className="score-big-text">{score.toLocaleString()}</Text>
            <Text className="text-[#0e4b75] font-black text-xl ml-2 uppercase">Điểm</Text>
          </Box>

          <Box className="h-1 w-full bg-[#3a9edb] my-3 opacity-40" />
          <Text className="text-[#0e4b75] font-black text-2xl uppercase italic ">Điểm đổi quà</Text>

          <Box flex justifyContent="space-around" className="mb-3 items-end">
            <RewardItem img={iconMockhoa} name="MÓC KHÓA" pts="55" />
            <RewardItem img={iconSach} name="SÁCH HỌC" pts="75" />
            <RewardItem img={iconKhoahoc} name="KHOÁ HỌC" pts="100" />
          </Box>

          <Box className="h-1 w-full bg-[#3a9edb] mb-2 opacity-40" />
          <Box className="mb-4">
            <Text className="text-[#0e4b75] font-bold text-sm uppercase">SĐT HOTLINE CÔNG TY:</Text>
            <Text className="hotline-text">1800 9078</Text>
          </Box>

          <Button
            className="btn-home-3d"
            onClick={handleGoHome}
          >
            QUAY LẠI PHIÊU LƯU
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

const RewardItem = ({ img, name, pts }) => (
  <Box flex flexDirection="column" alignItems="center" className="w-[30%]">
    <img src={img} alt={name} className="h-14 w-14 object-contain mb-2" />
    <Text size="xxxxSmall" className="text-[#0e4b75] font-black uppercase text-center leading-tight">{name}</Text>
    <Text className="text-[#3a9edb] text-[12px] font-bold">{pts} điểm</Text>
  </Box>
);

export default ResultPage;
