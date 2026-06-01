import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Modal, Page, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import bgMain from "../assets/bg_main.png";
import mascot from "../assets/mascot-CdQs06Pp.png";

const STORAGE_KEY = "hito_lucky_spin_state_v2";

const PRIZES = [
  {
    id: 1,
    emoji: "🔑",
    label: "Móc khóa HITO",
    shortLabel: "Móc khóa",
    note: "Quà branding dễ thương",
    group: "Dễ trúng",
    weight: 14,
    accent: "#7dd3fc",
    cta: "Lưu lại khoảnh khắc HITO trong túi của bạn.",
  },
  {
    id: 2,
    emoji: "✈️",
    label: "Tag hành lý HTO",
    shortLabel: "Tag hành lý",
    note: "Gắn du học / travel",
    group: "Dễ trúng",
    weight: 12,
    accent: "#38bdf8",
    cta: "Một chiếc tag nhỏ cho giấc mơ đi xa.",
  },
  {
    id: 3,
    emoji: "🧸",
    label: "Thú nhồi bông HITO mini",
    shortLabel: "HITO mini",
    note: "Quà cảm xúc",
    group: "Emotional",
    weight: 12,
    accent: "#f9a8d4",
    cta: "Mascot bé xinh để học sinh muốn ôm ngay.",
  },
  {
    id: 4,
    emoji: "☁️",
    label: "Gối cổ du lịch HTO",
    shortLabel: "Gối cổ",
    note: "Premium gift",
    group: "Emotional",
    weight: 8,
    accent: "#a78bfa",
    cta: "Món quà cho phong cách học tập - di chuyển - trải nghiệm.",
  },
  {
    id: 5,
    emoji: "👕",
    label: "HITO Explorer Shirt",
    shortLabel: "Áo HITO",
    note: "Tặng khi đăng ký khóa",
    group: "Chuyển đổi",
    weight: 4,
    accent: "#22c55e",
    cta: "Một món wearable để thương hiệu đi cùng người chơi.",
  },
  {
    id: 6,
    emoji: "📚",
    label: "Future Starter Kit",
    shortLabel: "Bộ sách",
    note: "Bộ sách học tiếng miễn phí",
    group: "Chuyển đổi",
    weight: 8,
    accent: "#60a5fa",
    cta: "Quà học tập giúp tăng cảm giác hữu ích ngay lập tức.",
  },
  {
    id: 7,
    emoji: "🎓",
    label: "Giảm 10% học phí tiếng Anh/Hàn/Đức",
    shortLabel: "Giảm học phí",
    note: "Chuyển đổi thật",
    group: "Chuyển đổi",
    weight: 5,
    accent: "#f59e0b",
    cta: "Đòn chốt nhẹ để dẫn tới hành động đăng ký.",
  },
  {
    id: 8,
    emoji: "🤖",
    label: "Giảm 10% khóa Robotics NEXORA",
    shortLabel: "Robotics",
    note: "Cross-brand",
    group: "Chuyển đổi",
    weight: 6,
    accent: "#14b8a6",
    cta: "Kéo tự nhiên sang hệ sinh thái NEXORA.",
  },
  {
    id: 9,
    emoji: "🚀",
    label: "Vé Workshop Robotics miễn phí",
    shortLabel: "Workshop",
    note: "Trải nghiệm",
    group: "Event",
    weight: 8,
    accent: "#fb7185",
    cta: "Một vé vào trải nghiệm để phụ huynh thấy giá trị thật.",
  },
  {
    id: 10,
    emoji: "🌍",
    label: "Tư vấn du học miễn phí",
    shortLabel: "Tư vấn",
    note: "Lead core",
    group: "Lead",
    weight: 7,
    accent: "#0f766e",
    cta: "Món quà dẫn thẳng đến cuộc trò chuyện có chất lượng.",
  },
  {
    id: 11,
    emoji: "✈️",
    label: "Giảm 50% phí hồ sơ du học",
    shortLabel: "Phí hồ sơ",
    note: "Quà mạnh",
    group: "Chuyển đổi",
    weight: 3,
    accent: "#ea580c",
    cta: "Một phần thưởng đủ mạnh để thúc đẩy chuyển đổi.",
  },
  {
    id: 12,
    emoji: "💎",
    label: "Voucher Visa 300K",
    shortLabel: "Visa 300K",
    note: "Upsell visa",
    group: "Chuyển đổi",
    weight: 3,
    accent: "#3b82f6",
    cta: "Gợi mở dịch vụ phụ trợ theo cách tự nhiên.",
  },
  {
    id: 13,
    emoji: "🎟️",
    label: "Vé STEM Day Experience",
    shortLabel: "STEM Day",
    note: "Tăng traffic",
    group: "Event",
    weight: 7,
    accent: "#ef4444",
    cta: "Kéo phụ huynh tới sự kiện cộng đồng.",
  },
  {
    id: 14,
    emoji: "📘",
    label: "Ebook kỹ năng học tập quốc tế",
    shortLabel: "Ebook",
    note: "Digital gift",
    group: "Dễ trúng",
    weight: 14,
    accent: "#67e8f9",
    cta: "Quà số hóa giúp người chơi có cảm giác nhận được ngay.",
  },
  {
    id: 15,
    emoji: "🍭",
    label: "Sticker Pack HITO",
    shortLabel: "Sticker",
    note: "Collectible",
    group: "Dễ trúng",
    weight: 15,
    accent: "#f472b6",
    cta: "Một phần thưởng nhỏ nhưng vui, dễ share, dễ yêu.",
  },
  {
    id: 16,
    emoji: "🎮",
    label: "Thêm 1 lượt quay",
    shortLabel: "+1 lượt",
    note: "Dopamine",
    group: "Dễ trúng",
    weight: 15,
    accent: "#818cf8",
    cta: "Giữ nhịp chơi tốt và tạo hiệu ứng muốn quay tiếp.",
  },
  {
    id: 17,
    emoji: "🎁",
    label: "Mystery Gift Box",
    shortLabel: "Mystery",
    note: "Tò mò",
    group: "Emotional",
    weight: 7,
    accent: "#c084fc",
    cta: "Cho cảm giác mở hộp quà đầy tò mò.",
  },
  {
    id: 18,
    emoji: "👑",
    label: "HITO Lucky Box",
    shortLabel: "Lucky Box",
    note: "Rare reward",
    group: "Rare",
    weight: 2,
    accent: "#facc15",
    cta: "Món quà hiếm dành cho khoảnh khắc bùng nổ.",
  },
  {
    id: 19,
    emoji: "🌟",
    label: "Học thử miễn phí 1 buổi",
    shortLabel: "Học thử",
    note: "Conversion mạnh",
    group: "Chuyển đổi",
    weight: 5,
    accent: "#10b981",
    cta: "Là chiếc cầu từ chơi game sang trải nghiệm thật.",
  },
  {
    id: 20,
    emoji: "😂",
    label: "HITO đang du học… quay lại nhé!",
    shortLabel: "Quay lại nhé",
    note: "Fun slot",
    group: "Dễ trúng",
    weight: 15,
    accent: "#22d3ee",
    cta: "Một ô vui để giữ cảm giác nhẹ nhàng, có duyên.",
  },
];

const GROUPS = [
  {
    title: "Dễ trúng",
    color: "#38bdf8",
    items: ["Sticker", "+1 lượt", "Ebook", "Móc khóa"],
    description: "Tạo cảm giác vui, nhận quà nhanh, giữ dopamine cho người chơi.",
  },
  {
    title: "Chuyển đổi",
    color: "#f59e0b",
    items: ["Giảm học phí", "Giảm phí hồ sơ", "Học thử", "Robotics"],
    description: "Nhóm quà để kéo sang đăng ký, tư vấn hoặc trải nghiệm thật.",
  },
  {
    title: "Emotional",
    color: "#f472b6",
    items: ["HITO mini", "Áo HITO", "Gối cổ", "Mystery Box"],
    description: "Nuôi cảm xúc, khiến thương hiệu gần gũi và có tính sưu tầm.",
  },
  {
    title: "Event",
    color: "#ef4444",
    items: ["Workshop", "STEM Day", "Robotics Experience"],
    description: "Tăng traffic offline và mở đường cho hoạt động cộng đồng.",
  },
];

const JACKPOT = [
  "HITO Super Box",
  "Thú HITO size lớn",
  "Áo HITO Explorer Shirt",
  "Voucher học phí",
  "Workshop VIP",
  "Robot mini",
];

function getTodayKey() {
  return new Date().toLocaleDateString("sv-SE");
}

function readSpinState() {
  if (typeof window === "undefined") {
    return {
      dateKey: getTodayKey(),
      remainingSpins: 1,
      bonusShareUsed: false,
      bonusCheckInUsed: false,
      bonusQuizUsed: false,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        dateKey: getTodayKey(),
        remainingSpins: 1,
        bonusShareUsed: false,
        bonusCheckInUsed: false,
        bonusQuizUsed: false,
      };
    }

    const parsed = JSON.parse(raw);
    if (parsed?.dateKey !== getTodayKey()) {
      return {
        dateKey: getTodayKey(),
        remainingSpins: 1,
        bonusShareUsed: false,
        bonusCheckInUsed: false,
        bonusQuizUsed: false,
      };
    }

    return {
      dateKey: parsed.dateKey,
      remainingSpins: Number.isFinite(parsed.remainingSpins) ? parsed.remainingSpins : 1,
      bonusShareUsed: Boolean(parsed.bonusShareUsed),
      bonusCheckInUsed: Boolean(parsed.bonusCheckInUsed),
      bonusQuizUsed: Boolean(parsed.bonusQuizUsed),
    };
  } catch {
    return {
      dateKey: getTodayKey(),
      remainingSpins: 1,
      bonusShareUsed: false,
      bonusCheckInUsed: false,
      bonusQuizUsed: false,
    };
  }
}

function weightedPick(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let threshold = Math.random() * totalWeight;
  for (const item of items) {
    threshold -= item.weight;
    if (threshold <= 0) return item;
  }
  return items[items.length - 1];
}

function LuckySpinPage() {
  const navigate = useNavigate();
  const [wheelState, setWheelState] = useState(() => readSpinState());
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(PRIZES[0]);
  const [spinning, setSpinning] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wheelState));
  }, [wheelState]);

  const slices = useMemo(() => {
    const segment = 360 / PRIZES.length;
    return PRIZES.map((prize, index) => ({
      ...prize,
      angle: index * segment,
      segment,
    }));
  }, []);

  const remainingLabel =
    wheelState.remainingSpins > 0 ? `${wheelState.remainingSpins} lượt` : "Hết lượt";

  const handleAddBonus = (type) => {
    if (spinning) return;

    const map = {
      share: {
        used: wheelState.bonusShareUsed,
        key: "bonusShareUsed",
        title: "Share Bonus",
        text: "Chia sẻ một lần, thêm 1 lượt quay.",
      },
      checkin: {
        used: wheelState.bonusCheckInUsed,
        key: "bonusCheckInUsed",
        title: "Check-in 7 ngày",
        text: "Tích lũy đều đặn để nhận thêm lượt.",
      },
      quiz: {
        used: wheelState.bonusQuizUsed,
        key: "bonusQuizUsed",
        title: "Quiz Bonus",
        text: "Trả lời câu hỏi về du học, STEM, AI để mở lượt.",
      },
    }[type];

    if (!map || map.used) {
      setBonusMessage(`${map?.title || "Bonus"} đã được nhận rồi. Hãy dùng lượt hiện có để quay nhé.`);
      setInfoVisible(true);
      return;
    }

    setWheelState((prev) => ({
      ...prev,
      [map.key]: true,
      remainingSpins: prev.remainingSpins + 1,
    }));
    setBonusMessage(`${map.title} đã mở: ${map.text}`);
    setInfoVisible(true);
  };

  const handleSpin = () => {
    if (spinning) return;

    if (wheelState.remainingSpins <= 0) {
      setBonusMessage("Bạn đã hết lượt hôm nay. Hãy dùng Share, Check-in hoặc Quiz để nhận thêm spin.");
      setInfoVisible(true);
      return;
    }

    setSpinning(true);
    const prize = weightedPick(PRIZES);
    const index = PRIZES.findIndex((item) => item.id === prize.id);
    const segment = 360 / PRIZES.length;
    const centerAngle = index * segment + segment / 2;
    const extraTurns = 5 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + extraTurns * 360 + (360 - centerAngle);

    setRotation(finalRotation);
    window.setTimeout(() => {
      setSelectedPrize(prize);
      setWheelState((prev) => ({
        ...prev,
        remainingSpins: Math.max(0, prev.remainingSpins - 1),
      }));
      setSpinning(false);
      setResultVisible(true);
    }, 3600);
  };

  const handleCloseResult = () => {
    setResultVisible(false);
  };

  return (
    <Page className="relative min-h-screen overflow-hidden bg-[#dff2ff]">
      <img
        src={bgMain}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(223,242,255,0.72)_35%,rgba(12,74,110,0.2)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_30%,rgba(7,89,133,0.08)_100%)]" />

      <Box className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 pb-10 sm:px-6 lg:px-8">
        <Box className="mb-5 flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/75 px-4 py-4 shadow-[0_24px_80px_rgba(15,118,110,0.15)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Box>
            <Text className="text-xs font-extrabold uppercase tracking-[0.35em] text-[#0f766e]">
              HTO x HITO Mega Lucky Wheel
            </Text>
            <Text className="mt-1 text-2xl font-black uppercase tracking-tight text-[#0e4b75] sm:text-4xl">
              Quay vui mỗi ngày - nhận quà tương lai
            </Text>
            <Text className="mt-2 max-w-2xl text-sm font-medium text-[#27536b] sm:text-base">
              Trang quay số được thiết kế như một thế giới HITO: vui, gần gũi, có cảm xúc,
              và vẫn dẫn được người chơi tới trải nghiệm thật.
            </Text>
          </Box>

          <Box className="flex shrink-0 flex-col gap-2 rounded-2xl bg-[#0e4b75] px-4 py-3 text-white shadow-lg">
            <Text className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-100">
              Lượt hôm nay
            </Text>
            <Text className="text-3xl font-black leading-none">{remainingLabel}</Text>
            <Text className="text-xs font-medium text-cyan-100">
              Dùng hết lượt rồi thì nhận bonus từ share, check-in hoặc quiz.
            </Text>
          </Box>
        </Box>

        <Box className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Box className="rounded-[32px] border border-white/70 bg-white/80 p-4 shadow-[0_30px_90px_rgba(15,118,110,0.18)] backdrop-blur-md sm:p-6">
            <Box className="grid gap-5 xl:grid-cols-[420px_1fr] xl:items-center">
              <Box className="relative mx-auto flex w-full max-w-[420px] items-center justify-center">
                <div className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22)_0%,rgba(56,189,248,0.12)_25%,rgba(255,255,255,0)_68%)] blur-2xl" />
                <div className="absolute inset-[-18px] rounded-full border border-white/60 shadow-[0_0_0_8px_rgba(255,255,255,0.25)]" />

                <div className="relative h-[330px] w-[330px] sm:h-[390px] sm:w-[390px]">
                  <div
                    className="absolute inset-0 rounded-full border-[14px] border-white bg-white shadow-[0_24px_70px_rgba(15,118,110,0.18)] transition-transform duration-[3600ms] ease-[cubic-bezier(0.15,0.85,0.2,1)]"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      background: `conic-gradient(from -90deg, ${PRIZES.map((prize, index) => {
                        const start = (index / PRIZES.length) * 360;
                        const end = ((index + 1) / PRIZES.length) * 360;
                        return `${prize.accent} ${start}deg ${end}deg`;
                      }).join(", ")})`,
                    }}
                  >
                    {slices.map((prize) => {
                      const labelAngle = prize.angle + prize.segment / 2 - 90;
                      return (
                        <div
                          key={prize.id}
                          className="absolute left-1/2 top-1/2 flex w-[82px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
                          style={{
                            transform: `translate(-50%, -50%) rotate(${labelAngle}deg) translateY(-132px) rotate(${90 - labelAngle}deg)`,
                          }}
                        >
                          <div className="rounded-full bg-white/85 px-2 py-1 shadow-md backdrop-blur-sm">
                            <Text className="text-[10px] font-black uppercase leading-tight text-[#0e4b75]">
                              {prize.shortLabel}
                            </Text>
                          </div>
                        </div>
                      );
                    })}

                    <div className="absolute inset-[18px] rounded-full border border-white/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),rgba(255,255,255,0.12)_35%,rgba(255,255,255,0.8)_100%)] shadow-inner" />
                    <div className="absolute inset-[62px] rounded-full border border-white/90 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(228,244,255,0.95))] shadow-[inset_0_10px_30px_rgba(15,118,110,0.1)]" />

                    <div className="absolute left-1/2 top-[-4px] -translate-x-1/2">
                      <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-t-[30px] border-l-transparent border-r-transparent border-t-[#ef4444] drop-shadow-lg" />
                    </div>

                    <button
                      type="button"
                      onClick={handleSpin}
                      disabled={spinning}
                      className="absolute left-1/2 top-1/2 flex h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-8 border-white bg-[linear-gradient(180deg,#fff7cc_0%,#ffd54d_100%)] text-center shadow-[0_18px_50px_rgba(234,179,8,0.45)] transition-transform duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80"
                    >
                      <span className="flex flex-col items-center">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#8a5c00]">
                          {spinning ? "Đang" : "Spin"}
                        </span>
                        <span className="text-xl font-black uppercase tracking-tight text-[#7c4a00]">
                          {spinning ? "Quay..." : "Quay"}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </Box>

              <Box className="space-y-4">
                <Box className="rounded-[24px] border border-[#d7edf7] bg-[#f6fbfe] p-4">
                  <Text className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#0f766e]">
                    Cấu trúc 20 ô đã tối ưu
                  </Text>
                  <Text className="mt-2 text-lg font-black text-[#0e4b75]">
                    Wheel được chia thành 4 lớp mục tiêu: dễ trúng, chuyển đổi, emotional và event.
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-[#335c72]">
                    Mục tiêu là để người chơi thấy mình đang bước vào thế giới HITO, không phải
                    một bảng khuyến mãi. Mỗi ô đều có câu chuyện và cảm giác nhận quà riêng.
                  </Text>
                </Box>

                <Box className="grid gap-3 sm:grid-cols-2">
                  <InfoChip label="Daily Spin" value="1 lượt miễn phí / ngày" color="#38bdf8" />
                  <InfoChip label="Share Bonus" value="Chia sẻ để thêm lượt" color="#22c55e" />
                  <InfoChip label="Check-in" value="7 ngày nhận quà lớn" color="#f59e0b" />
                  <InfoChip label="Quiz Bonus" value="Du học - STEM - AI" color="#a855f7" />
                </Box>

                <Box className="rounded-[24px] border border-[#d7edf7] bg-white p-4 shadow-sm">
                  <Text className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#0f766e]">
                    Mega Jackpot
                  </Text>
                  <Text className="mt-1 text-2xl font-black text-[#0e4b75]">HITO Super Box</Text>
                  <Text className="mt-2 text-sm leading-6 text-[#335c72]">
                    Có thể gồm: thú HITO size lớn, áo, voucher học phí, workshop VIP, robot mini.
                  </Text>
                  <Box className="mt-3 flex flex-wrap gap-2">
                    {JACKPOT.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#eaf7ff] px-3 py-1 text-xs font-bold text-[#0e4b75]"
                      >
                        {item}
                      </span>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="space-y-5">
            <Box className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_60px_rgba(15,118,110,0.14)] backdrop-blur-md sm:p-5">
              <Box className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-[24px] border border-white bg-gradient-to-br from-cyan-100 to-sky-200 p-2 shadow-inner sm:h-20 sm:w-20">
                  <img src={mascot} alt="HITO mascot" className="h-full w-full object-contain" />
                </div>
                <Box>
                  <Text className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#0f766e]">
                    Thế giới HITO
                  </Text>
                  <Text className="text-2xl font-black text-[#0e4b75]">Vui, gần gũi, có quà thật</Text>
                  <Text className="text-sm text-[#335c72]">
                    Mỗi lần quay là một lần thương hiệu chạm tới cảm xúc học sinh và phụ huynh.
                  </Text>
                </Box>
              </Box>

              <Box className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <ActionButton
                  title="Share Bonus"
                  description="Share một lần để thêm 1 lượt quay."
                  buttonText={wheelState.bonusShareUsed ? "Đã nhận" : "Nhận bonus"}
                  onPress={() => handleAddBonus("share")}
                  disabled={wheelState.bonusShareUsed || spinning}
                  tone="share"
                />
                <ActionButton
                  title="Check-in 7 ngày"
                  description="Tích lũy đều đặn để chạm tới quà lớn."
                  buttonText={wheelState.bonusCheckInUsed ? "Đã mở" : "Check-in"}
                  onPress={() => handleAddBonus("checkin")}
                  disabled={wheelState.bonusCheckInUsed || spinning}
                  tone="checkin"
                />
                <ActionButton
                  title="Quiz Bonus"
                  description="Trả lời câu hỏi về du học, STEM, AI để mở thêm spin."
                  buttonText={wheelState.bonusQuizUsed ? "Đã mở" : "Làm quiz"}
                  onPress={() => handleAddBonus("quiz")}
                  disabled={wheelState.bonusQuizUsed || spinning}
                  tone="quiz"
                />
              </Box>

              <Button
                className="mt-4 w-full rounded-full bg-[#0e4b75] font-extrabold text-white shadow-lg"
                onClick={() => navigate(-1)}
              >
                QUAY LẠI KHÁM PHÁ
              </Button>
            </Box>

            <Box className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_60px_rgba(15,118,110,0.14)] backdrop-blur-md sm:p-5">
              <Text className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#0f766e]">
                4 nhóm quà chiến lược
              </Text>
              <Box className="mt-4 space-y-3">
                {GROUPS.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-[22px] border border-[#e3f2fb] bg-[#f8fcff] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Text className="text-lg font-black text-[#0e4b75]">{group.title}</Text>
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                    </div>
                    <Text className="mt-1 text-sm leading-6 text-[#335c72]">
                      {group.description}
                    </Text>
                    <Box className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0e4b75] shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </Box>
                  </div>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="mt-5 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_60px_rgba(15,118,110,0.12)] backdrop-blur-md sm:p-6">
          <Text className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#0f766e]">
            20 ô phần thưởng theo concept mới
          </Text>
          <Box className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {PRIZES.map((prize) => (
              <div
                key={prize.id}
                className="rounded-[22px] border border-[#e3f2fb] bg-[#f8fcff] p-4 shadow-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg"
                    style={{ backgroundColor: `${prize.accent}22` }}
                  >
                    {prize.emoji}
                  </div>
                  <Box>
                    <Text className="text-sm font-black leading-tight text-[#0e4b75]">
                      {prize.label}
                    </Text>
                    <Text className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f766e]">
                      {prize.group}
                    </Text>
                  </Box>
                </div>
                <Text className="mt-3 text-sm leading-6 text-[#335c72]">{prize.note}</Text>
              </div>
            ))}
          </Box>
        </Box>
      </Box>

      <Modal visible={resultVisible} title="KẾT QUẢ QUAY SỐ" onClose={handleCloseResult} verticalActions>
        <Box className="p-4">
          <Box className="rounded-[24px] border border-[#d7edf7] bg-[#f8fcff] p-4">
            <Text className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#0f766e]">
              Bạn vừa nhận
            </Text>
            <Text className="mt-2 text-3xl font-black text-[#0e4b75]">
              {selectedPrize.emoji} {selectedPrize.label}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-[#335c72]">{selectedPrize.cta}</Text>
            <Box className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#eaf7ff] px-3 py-1 text-xs font-bold text-[#0e4b75]">
                {selectedPrize.group}
              </span>
              <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-bold text-[#9a3412]">
                {selectedPrize.note}
              </span>
            </Box>
          </Box>

          <Box className="mt-4 rounded-[24px] bg-[#0e4b75] p-4 text-white">
            <Text className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-100">
              Gợi ý tiếp theo
            </Text>
            <Text className="mt-2 text-base font-semibold leading-6">
              Với các ô như tư vấn, học thử, giảm học phí hoặc workshop, hãy dẫn người chơi sang
              form đăng ký để biến niềm vui thành lead chất lượng.
            </Text>
          </Box>

          <Button
            fullWidth
            className="mt-5 h-12 rounded-full bg-[#0e4b75] font-extrabold text-white"
            onClick={handleCloseResult}
          >
            TIẾP TỤC CHƠI
          </Button>
        </Box>
      </Modal>

      <Modal visible={infoVisible} title="THÔNG BÁO" onClose={() => setInfoVisible(false)} verticalActions>
        <Box className="p-4">
          <Text className="text-base font-semibold leading-7 text-[#335c72]">{bonusMessage}</Text>
          <Button
            fullWidth
            className="mt-5 h-12 rounded-full bg-[#0e4b75] font-extrabold text-white"
            onClick={() => setInfoVisible(false)}
          >
            ĐÃ HIỂU
          </Button>
        </Box>
      </Modal>
    </Page>
  );
}

function InfoChip({ label, value, color }) {
  return (
    <div className="rounded-[20px] border border-[#d9edf9] bg-[#f7fbff] p-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <Text className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#0f766e]">
          {label}
        </Text>
      </div>
      <Text className="mt-2 text-sm font-semibold leading-6 text-[#0e4b75]">{value}</Text>
    </div>
  );
}

function ActionButton({ title, description, buttonText, onPress, disabled, tone }) {
  const toneClass = {
    share: "from-emerald-400 to-teal-500",
    checkin: "from-amber-400 to-orange-500",
    quiz: "from-violet-400 to-fuchsia-500",
  }[tone];

  return (
    <div className="rounded-[22px] border border-[#dbeef8] bg-white p-4 shadow-sm">
      <Text className="text-base font-black text-[#0e4b75]">{title}</Text>
      <Text className="mt-1 text-sm leading-6 text-[#335c72]">{description}</Text>
      <Button
        className={`mt-3 w-full rounded-full bg-gradient-to-r ${toneClass} font-extrabold text-white shadow-lg disabled:opacity-60`}
        onClick={onPress}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </div>
  );
}

export default LuckySpinPage;
