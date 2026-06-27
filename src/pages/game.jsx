import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Page, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Đã thêm axios
import mascot from "../assets/game.png";
import gameBackground1 from "../assets/game-background-1.png";
import gameBackground2 from "../assets/game-background-2.png";
import gameOceanWaves from "../assets/game-ocean-waves.png";
import "../css/game-style.css";

const BG_MUSIC_URL = "https://res.cloudinary.com/dxxgvqzkx/video/upload/v1782284964/Golden_Cove_qpgaf3.mp3";
const JUMP_SFX_URL = "https://res.cloudinary.com/dxxgvqzkx/video/upload/v1782292800/mixkit-player-jumping-in-a-video-game-2043_qgxxy2.wav";

const GamePage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const bgAudioRef = useRef(null);
  const jumpAudioRef = useRef(null);
  const [gameState, setGameState] = useState("START");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isScoring, setIsScoring] = useState(false);

  // Cấu hình vật lý & thông số Game
  // Giảm nhịp vật lý để nhân vật bay mượt hơn và dễ kiểm soát trên mobile.
  const GRAVITY = 0.18;
  const JUMP_STRENGTH = -10.6;
  const PIPE_WIDTH = 150;
  const BASE_PIPE_SPEED = 3.3;
  const FISH_SIZE = 135;
  const FISH_START_X = 100;
  const FISH_ARC_PUSH = 1.1;
  const FISH_ARC_PULL = 0.045;
  const FISH_X_MIN = 72;
  const FISH_X_MAX = 126;
  const PIPE_SPACING = 700;
  const HITBOX_PADDING = 52;
  const GROUND_HEIGHT = -10;
  const MAX_FALL_SPEED = 4.2;
  const JUMP_COOLDOWN_MS = 130;
  const MAX_JUMPS_PER_AIR = 2;
  const DIFFICULTY = {
    BASE_SPEED: BASE_PIPE_SPEED,
    MAX_SPEED: 5.4,
    BASE_SPACING: PIPE_SPACING,
    MIN_SPACING: 500,
    SCORE_STEP: 5,
    TIME_STEP_MS: 18000,
    SPEED_STEP: 0.18,
    SPACING_STEP: 10,
    PEAK_INTERVAL: 12,
    PEAK_DURATION: 800,
    PEAK_SPEED_BONUS: 0.28,
    PEAK_SPACING_PENALTY: 28,
    SPACING_LAND_BUFFER_FRAMES: 12,
    PIPE_MIN_HEIGHT: 70,
    PIPE_MAX_HEIGHT_HARD_CAP: 170,
    PIPE_MAX_GROWTH_PER_LEVEL: 2.5,
    PIPE_MIN_GROWTH_PER_LEVEL: 1.1,
    PIPE_SAFETY_MARGIN: 18
  };

  const fishY = useRef(0);
  const fishX = useRef(FISH_START_X);
  const fishVelocity = useRef(0);
  const fishXVelocity = useRef(0);
  const pipes = useRef([]);
  const bubbles = useRef([]);
  const particles = useRef([]); 
  const bgX1 = useRef(0);
  const bgX2 = useRef(0);
  const frameId = useRef(null);
  const startTime = useRef(0);
  const peakUntil = useRef(0);
  const lastPeakScore = useRef(0);
  const lastJumpAt = useRef(0);
  const jumpCount = useRef(0);
  const gameStateRef = useRef("START");
  const scoreRef = useRef(0);
  const scorePopTimeoutRef = useRef(null);

  const getDifficultyState = (scoreValue, elapsedMs, now) => {
    const levelFromScore = Math.floor(scoreValue / DIFFICULTY.SCORE_STEP);
    const levelFromTime = Math.floor(elapsedMs / DIFFICULTY.TIME_STEP_MS);
    const level = levelFromScore + levelFromTime;

    const isPeak = now < peakUntil.current;

    let speed = DIFFICULTY.BASE_SPEED + level * DIFFICULTY.SPEED_STEP;
    if (isPeak) speed += DIFFICULTY.PEAK_SPEED_BONUS;
    speed = Math.min(speed, DIFFICULTY.MAX_SPEED);

    let spacing = DIFFICULTY.BASE_SPACING - level * DIFFICULTY.SPACING_STEP;
    if (isPeak) spacing -= DIFFICULTY.PEAK_SPACING_PENALTY;
    spacing = Math.max(spacing, DIFFICULTY.MIN_SPACING);

    const airTimeFrames = Math.ceil((2 * Math.abs(JUMP_STRENGTH)) / GRAVITY);
    const physicsMinSpacing = Math.floor(speed * (airTimeFrames + DIFFICULTY.SPACING_LAND_BUFFER_FRAMES));
    spacing = Math.max(spacing, physicsMinSpacing);

    const maxRise = (JUMP_STRENGTH * JUMP_STRENGTH) / (2 * GRAVITY);
    const maxClearablePipeHeight = Math.floor(maxRise + 5 - DIFFICULTY.PIPE_SAFETY_MARGIN);
    const pipeMaxHeight = Math.min(
      DIFFICULTY.PIPE_MAX_HEIGHT_HARD_CAP,
      maxClearablePipeHeight,
      Math.floor(110 + level * DIFFICULTY.PIPE_MAX_GROWTH_PER_LEVEL)
    );
    const pipeMinHeight = Math.min(
      pipeMaxHeight - 10,
      Math.floor(DIFFICULTY.PIPE_MIN_HEIGHT + level * DIFFICULTY.PIPE_MIN_GROWTH_PER_LEVEL)
    );

    return {
      speed,
      spacing,
      pipeMinHeight: Math.max(DIFFICULTY.PIPE_MIN_HEIGHT, pipeMinHeight),
      pipeMaxHeight: Math.max(DIFFICULTY.PIPE_MIN_HEIGHT + 10, pipeMaxHeight)
    };
  };

  const imgs = useRef({
    mascot: new Image(), bg1: new Image(), bg2: new Image(), wave: new Image()
  });

  useEffect(() => {
    imgs.current.mascot.src = mascot;
    imgs.current.bg1.src = gameBackground1;
    imgs.current.bg2.src = gameBackground2;
    imgs.current.wave.src = gameOceanWaves;

    bubbles.current = Array.from({ length: 15 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 3,
      speed: Math.random() * 1 + 1,
      opacity: Math.random() * 0.4
    }));
  }, []);

  useEffect(() => {
    const audio = new Audio(BG_MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.28;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    bgAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      bgAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = new Audio(JUMP_SFX_URL);
    audio.volume = 0.65;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    jumpAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      jumpAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const getGroundY = (canvas) => canvas.height - GROUND_HEIGHT - FISH_SIZE + 10;

  const resizeCanvas = (canvas) => {
    if (!canvas) return;
    const nextWidth = window.innerWidth;
    const nextHeight = window.innerHeight;
    if (canvas.width === nextWidth && canvas.height === nextHeight) return;

    const previousGroundY = canvas.height ? getGroundY(canvas) : null;
    const wasOnGround = previousGroundY !== null && Math.abs(fishY.current - previousGroundY) < 1;

    canvas.width = nextWidth;
    canvas.height = nextHeight;

    if (wasOnGround || fishY.current === 0) {
      fishY.current = getGroundY(canvas);
    } else {
      fishY.current = Math.min(fishY.current, getGroundY(canvas));
    }
  };

  const triggerScorePop = () => {
    setIsScoring(true);
    if (scorePopTimeoutRef.current) clearTimeout(scorePopTimeoutRef.current);
    scorePopTimeoutRef.current = setTimeout(() => setIsScoring(false), 180);
  };

  const playBackgroundMusic = () => {
    const audio = bgAudioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {
      const resumeOnGesture = () => {
        audio.play().catch(() => {});
        document.removeEventListener("pointerdown", resumeOnGesture);
      };
      document.addEventListener("pointerdown", resumeOnGesture, { once: true });
    });
  };

  const playJumpSound = () => {
    const audio = jumpAudioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const resetGame = () => {
    const canvas = canvasRef.current;
    resizeCanvas(canvas);
    if (canvas) fishY.current = getGroundY(canvas);
    fishX.current = FISH_START_X;
    fishXVelocity.current = 0;
    fishVelocity.current = 0;
    pipes.current = [];
    particles.current = [];
    scoreRef.current = 0;
    setScore(0);
    setIsScoring(false);
    setGameState("PLAYING");
    startTime.current = performance.now();
    peakUntil.current = 0;
    lastPeakScore.current = 0;
    lastJumpAt.current = 0;
    jumpCount.current = 0;
    playBackgroundMusic();
  };

  const jump = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (gameStateRef.current !== "PLAYING") return;
    if (jumpCount.current >= MAX_JUMPS_PER_AIR) return;

    const now = performance.now();
    if (now - lastJumpAt.current < JUMP_COOLDOWN_MS) return;
    lastJumpAt.current = now;

    fishVelocity.current = JUMP_STRENGTH;
    fishXVelocity.current += FISH_ARC_PUSH;
    if (fishXVelocity.current > FISH_ARC_PUSH * 1.6) fishXVelocity.current = FISH_ARC_PUSH * 1.6;
    jumpCount.current += 1;
    playJumpSound();
    const groundY = getGroundY(canvas);

    for (let i = 0; i < 8; i++) {
      particles.current.push({
        x: fishX.current + FISH_SIZE / 2, y: groundY + FISH_SIZE - 20,
        vx: Math.random() * 4 - 2, vy: Math.random() * -4 - 2, life: 1.0
      });
    }
  };

  const handleContinue = () => {
    // --- LOGIC GỬI DATA KHI BẤM TIẾP TỤC ---
    const savedData = localStorage.getItem("hito_player_data");
    if (savedData) {
      const userData = JSON.parse(savedData);
      let gift = "Móc khóa";
      if (score >= 2500) gift = "Khoá học";
      else if (score >= 1500) gift = "Sách học";

      const payload = {
        ...userData,
        score: score,
        gift_name: gift,
        submitted_at: new Date().toLocaleString("vi-VN"),
      };

      const BACKEND_URL = "https://survey-api.hto.edu.vn/api/hito/submit";
      axios.post(BACKEND_URL, payload)
        .then(() => {
          console.log("✅ [Hito] Đã gửi data thành công từ GamePage.");
          localStorage.removeItem("hito_player_data");
        })
        .catch(err => console.error("❌ [Hito] Lỗi gửi data:", err.message));
    }
    // Chuyển trang
    navigate("/result", { state: { score: score } });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    resizeCanvas(canvas);

    const loop = () => {
      resizeCanvas(canvas);

      if (gameStateRef.current === "PLAYING") {
        const now = performance.now();
        const elapsedMs = startTime.current ? now - startTime.current : 0;
        if (
          scoreRef.current > 0 &&
          scoreRef.current % DIFFICULTY.PEAK_INTERVAL === 0 &&
          scoreRef.current !== lastPeakScore.current
        ) {
          lastPeakScore.current = scoreRef.current;
          peakUntil.current = now + DIFFICULTY.PEAK_DURATION;
        }

        const groundY = getGroundY(canvas);
        fishXVelocity.current += (FISH_START_X - fishX.current) * FISH_ARC_PULL;
        fishXVelocity.current *= 0.9;
        fishX.current += fishXVelocity.current;
        if (fishX.current < FISH_X_MIN) {
          fishX.current = FISH_X_MIN;
          fishXVelocity.current = 0;
        } else if (fishX.current > FISH_X_MAX) {
          fishX.current = FISH_X_MAX;
          fishXVelocity.current = 0;
        }
        fishVelocity.current += GRAVITY;
        if (fishVelocity.current > MAX_FALL_SPEED) fishVelocity.current = MAX_FALL_SPEED;
        fishY.current += fishVelocity.current;
        if (fishY.current >= groundY) {
          fishY.current = groundY;
          fishVelocity.current = 0;
          fishXVelocity.current *= 0.2;
          fishX.current += (FISH_START_X - fishX.current) * 0.18;
          lastJumpAt.current = 0;
          jumpCount.current = 0;
        }
        
        const difficulty = getDifficultyState(scoreRef.current, elapsedMs, now);
        const currentSpeed = difficulty.speed;
        bgX1.current = (bgX1.current - currentSpeed * 0.18) % canvas.width;
        bgX2.current = (bgX2.current - currentSpeed * 0.34) % canvas.width;

        if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < canvas.width - difficulty.spacing) {
          const height = Math.random() * (difficulty.pipeMaxHeight - difficulty.pipeMinHeight) + difficulty.pipeMinHeight;
          pipes.current.push({ x: canvas.width, height, passed: false });
        }

        pipes.current.forEach((pipe) => {
          pipe.x -= currentSpeed;
          const fH = { x: fishX.current + HITBOX_PADDING, y: fishY.current + HITBOX_PADDING, w: FISH_SIZE - HITBOX_PADDING*2, h: FISH_SIZE - HITBOX_PADDING*2 };
          const pH = { x: pipe.x + 10, y: canvas.height - GROUND_HEIGHT - pipe.height + 15, w: PIPE_WIDTH - 20, h: pipe.height - 15 };
          
          if (fH.x < pH.x + pH.w && fH.x + fH.w > pH.x && fH.y < pH.y + pH.h && fH.y + fH.h > pH.y) {
            setGameState("GAME_OVER");
          }
          if (!pipe.passed && pipe.x < fishX.current) { 
            pipe.passed = true; 
            setScore((prev) => {
              const nextScore = prev + 1;
              scoreRef.current = nextScore;
              return nextScore;
            });
            triggerScorePop();
          }
        });
        pipes.current = pipes.current.filter(p => p.x > -PIPE_WIDTH);
        bubbles.current.forEach(b => { b.y -= b.speed; if (b.y < -20) b.y = canvas.height + 20; });
        particles.current = particles.current.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;
          return p.life > 0;
        });
      }

      ctx.fillStyle = "#0e4b75";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (imgs.current.bg1.complete) {
        ctx.drawImage(imgs.current.bg1, bgX1.current | 0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgs.current.bg1, (bgX1.current + canvas.width) | 0, 0, canvas.width, canvas.height);
      }
      if (imgs.current.bg2.complete) {
        ctx.drawImage(imgs.current.bg2, bgX2.current | 0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgs.current.bg2, (bgX2.current + canvas.width) | 0, 0, canvas.width, canvas.height);
      }

      bubbles.current.forEach(b => {
        ctx.beginPath(); ctx.arc(b.x | 0, b.y | 0, b.size, 0, 6.28);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`; ctx.fill();
      });

      pipes.current.forEach((p) => {
        if (imgs.current.wave.complete) ctx.drawImage(imgs.current.wave, p.x | 0, (canvas.height - GROUND_HEIGHT - p.height) | 0, PIPE_WIDTH, p.height + 15);
      });

      ctx.save();
      ctx.translate((fishX.current + FISH_SIZE / 2) | 0, (fishY.current + FISH_SIZE / 2) | 0);
      if (imgs.current.mascot.complete) ctx.drawImage(imgs.current.mascot, (-FISH_SIZE / 2) | 0, (-FISH_SIZE / 2) | 0, FISH_SIZE, FISH_SIZE);
      ctx.restore();

      frameId.current = requestAnimationFrame(loop);
    };
    frameId.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frameId.current);
      if (scorePopTimeoutRef.current) clearTimeout(scorePopTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    try {
      const savedHighScore = Number(localStorage.getItem("hito_high_score") || 0);
      if (savedHighScore > 0) setHighScore(savedHighScore);
    } catch {}
  }, []);

  useEffect(() => {
    if (score <= highScore) return;
    setHighScore(score);
    try {
      localStorage.setItem("hito_high_score", String(score));
    } catch {}
  }, [score, highScore]);

  return (
    <Page className="game-page-container p-0 overflow-hidden">
      <div className="scanline"></div>
      <Box className="logo-game-header absolute top-0 w-full">
        <Text className="logo-main-text-game">HITO</Text>
        <Text className="logo-main-text-game" style={{ lineHeight: "0.8" }}>ADVENTURE</Text>
        <Box className="logo-sub-pill-game">
          <Text className="logo-sub-text-game">by HTO Group</Text>
        </Box>
      </Box>

      <Box className="relative w-full h-full" onClick={jump}>
        <Box className="absolute top-40 w-full flex justify-center z-10 pointer-events-none">
          <div className={`score-container ${isScoring ? "score-pop" : ""}`}>
            <Text className="text-white text-6xl font-black italic drop-shadow-md">{score}</Text>
          </div>
        </Box>

        <canvas ref={canvasRef} className="block w-full h-full" />

        {gameState !== "PLAYING" && (
          <Box className="absolute inset-0 bg-[#0e4b75]/50 backdrop-blur-sm flex items-center justify-center z-20 p-6">
            <Box className="bg-white rounded-[50px] p-8 w-full max-w-xs text-center shadow-2xl border-[5px] border-[#3a9edb]">
              <Text className="text-[#0e4b75] font-black text-3xl uppercase italic mb-4 tracking-tighter">
                {gameState === "START" ? "SẴN SÀNG?" : "KẾT THÚC"}
              </Text>
              
              {gameState === "GAME_OVER" && (
                <Box className="mb-6 bg-blue-50 rounded-[30px] py-4 border-2 border-blue-100">
                  <Text className="text-[#3a9edb] text-6xl font-black italic">{score}</Text>
                  <Text className="text-gray-400 font-bold text-xs mt-1 uppercase">Kỷ lục: {highScore}</Text>
                </Box>
              )}

              {gameState === "START" && (
                <Box className="mb-6 text-center flex flex-col items-center">
                  <img src={mascot} className="w-24 mb-4" alt="Mascot" />
                  <Text className="text-gray-500 font-bold px-4 text-xs uppercase tracking-wider">Vượt sóng dữ - Tích điểm đổi quà!</Text>
                </Box>
              )}

              <Box className="space-y-4">
                {gameState === "START" && (
                  <Button className="btn-hito-primary" onClick={resetGame}>CHƠI NGAY</Button>
                )}
                {gameState === "GAME_OVER" && (
                  <>
                    <Button className="btn-hito-primary" onClick={resetGame}>THỬ LẠI</Button>
                    <Button className="btn-hito-secondary" onClick={handleContinue}>TIẾP TỤC</Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default GamePage;
