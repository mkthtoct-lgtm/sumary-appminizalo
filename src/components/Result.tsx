/// <reference path="../react-app.d.ts" />
import React, { useMemo, useState } from 'react';

const HOLLAND_RIASEC = {
  tech: { 
    code: 'R', name: 'THỰC TẾ', en: 'Realistic', icon: '🛠️', border: 'border-amber-500', color: 'text-amber-400', bg: 'from-amber-600 to-amber-400', 
    desc: 'Thích làm việc với máy móc, công cụ, thực hành.', 
    detailedDesc: 'Giải quyết vấn đề bằng hành động thực tiễn. Ưu điểm là sự khéo léo, tính kiên nhẫn và khả năng thao tác với các công cụ, máy móc hoặc phần mềm kỹ thuật. Phù hợp với môi trường làm việc rõ ràng, tập trung vào kết quả vật lý hoặc sản phẩm công nghệ cụ thể.',
    careers: ['Kỹ sư cơ khí', 'Kỹ thuật viên', 'Chuyên gia IT', 'Kiến trúc sư hệ thống'] 
  },
  logic: { 
    code: 'I', name: 'NGHIÊN CỨU', en: 'Investigative', icon: '🔬', border: 'border-cyan-400', color: 'text-cyan-300', bg: 'from-cyan-600 to-cyan-400', 
    desc: 'Thích quan sát, phân tích, đánh giá và giải quyết vấn đề.', 
    detailedDesc: 'Tư duy logic và khả năng phân tích dữ liệu là điểm mạnh. Thích làm việc với các ý tưởng, khám phá nguyên lý hoạt động của vạn vật và giải quyết các bài toán phức tạp. Phù hợp với môi trường học thuật, nghiên cứu hoặc các công việc đòi hỏi tư duy phản biện cao.',
    careers: ['Nhà khoa học dữ liệu', 'Bác sĩ', 'Chuyên gia phân tích', 'Kỹ sư phần mềm'] 
  },
  creative: { 
    code: 'A', name: 'NGHỆ THUẬT', en: 'Artistic', icon: '🎨', border: 'border-pink-400', color: 'text-pink-300', bg: 'from-pink-600 to-pink-400', 
    desc: 'Có khả năng sáng tạo, trực giác và trí tưởng tượng phong phú.', 
    detailedDesc: 'Sự sáng tạo vô hạn và khả năng biểu đạt cảm xúc giúp tạo ra những giá trị độc bản. Môi trường làm việc lý tưởng là nơi cho phép sự tự do, linh hoạt để phát triển các ý tưởng đột phá trong nghệ thuật, thiết kế hoặc truyền thông.',
    careers: ['Thiết kế đồ họa', 'Kiến trúc sư', 'Sáng tạo nội dung', 'Đạo diễn nghệ thuật'] 
  },
  comm: { 
    code: 'S', name: 'XÃ HỘI', en: 'Social', icon: '🤝', border: 'border-fuchsia-400', color: 'text-fuchsia-300', bg: 'from-fuchsia-600 to-fuchsia-400', 
    desc: 'Thích giúp đỡ, huấn luyện, chữa trị hoặc chăm sóc người khác.', 
    detailedDesc: 'Trí thông minh cảm xúc (EQ) và kỹ năng thấu cảm là vũ khí mạnh nhất. Tìm thấy ý nghĩa công việc thông qua việc hỗ trợ, đào tạo và phát triển con người. Tỏa sáng trong các vai trò yêu cầu giao tiếp liên tục và xây dựng cộng đồng.',
    careers: ['Giáo viên', 'Chuyên gia Tâm lý', 'Nhân sự (HR)', 'Tư vấn viên'] 
  },
  lead: { 
    code: 'E', name: 'QUẢN LÝ', en: 'Enterprising', icon: '👑', border: 'border-yellow-400', color: 'text-yellow-300', bg: 'from-yellow-600 to-yellow-400', 
    desc: 'Thích làm việc với người khác, có khả năng thuyết phục, lãnh đạo.', 
    detailedDesc: 'Mang tố chất của người dẫn dắt. Khả năng thuyết phục, ra quyết định và định hướng mục tiêu giúp dễ dàng quản lý đội nhóm. Khao khát thử thách, chịu được áp lực cao và luôn tìm kiếm cơ hội thăng tiến trong môi trường cạnh tranh.',
    careers: ['Giám đốc kinh doanh', 'Khởi nghiệp', 'Marketing', 'Quản lý dự án'] 
  },
  sci: { 
    code: 'C', name: 'NGHIỆP VỤ', en: 'Conventional', icon: '📊', border: 'border-emerald-400', color: 'text-emerald-300', bg: 'from-emerald-600 to-emerald-400', 
    desc: 'Thích làm việc với dữ liệu, con số, chi tiết, thích sự ngăn nắp.', 
    detailedDesc: 'Sự tỉ mỉ, cẩn trọng và tính kỷ luật cao là đặc điểm nổi bật. Xuất sắc trong việc tổ chức thông tin, quản lý hệ thống và đảm bảo mọi thứ vận hành theo đúng quy chuẩn. Môi trường tài chính, kế toán hoặc vận hành hệ thống là nơi phát huy tối đa năng lực.',
    careers: ['Kế toán', 'Phân tích tài chính', 'Quản trị hệ thống', 'Kiểm toán viên'] 
  }
};

interface ResultScreenProps {
  stats: {
    logic: number;
    creative: number;
    comm: number;
    lead: number;
    tech: number;
    sci: number;
  };
  maxStat: number;
  exp: number;
  onReplay: () => void;
}

const ResultScreen = ({ stats, maxStat, exp, onReplay }: ResultScreenProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  
  const isEligibleForGift = exp >= 100;
  
  const topTraitKey = useMemo(() => {
    const keys = Object.keys(stats) as Array<keyof typeof stats>;
    return keys.reduce((a, b) => stats[a] > stats[b] ? a : b);
  }, [stats]);
  
  const topTrait = HOLLAND_RIASEC[topTraitKey as keyof typeof HOLLAND_RIASEC];

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center bg-gradient-to-b from-[#0a1930] via-[#164fa0] to-[#1e3a8a] overflow-hidden fade-in pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center flex-grow w-full h-full px-4 pt-6 pb-6 overflow-y-auto game-scroll">
        
        <div className="w-full mb-6">
          <div className="mb-2 text-6xl text-center drop-shadow-md trophy-bounce">🧩</div>
          <h1 className="text-yellow-400 text-3xl font-black font-['Montserrat'] text-center mb-1 drop-shadow-sm uppercase">Báo Cáo Holland</h1>
          <p className="mb-5 text-sm font-bold tracking-widest text-center text-cyan-200">MÃ ĐỊNH DANH CỦA BẠN</p>

          <div className={`p-[1.5px] rounded-[28px] bg-gradient-to-br ${topTrait.bg} shadow-[0_5px_20px_rgba(0,0,0,0.4)]`}>
            <div className="p-6 text-center bg-[#0a1930] rounded-[26.5px] flex flex-col items-center">
              <p className={`text-sm font-bold font-['Montserrat'] mb-3 tracking-widest uppercase ${topTrait.color}`}>NHÓM TÍNH CÁCH CHỦ ĐẠO</p>
              
              <div className="relative flex items-center justify-center w-32 h-32 mb-2 overflow-hidden border shadow-inner rounded-2xl bg-white/5 border-white/10">
                <div className={`absolute inset-0 bg-gradient-to-br ${topTrait.bg} opacity-20`}></div>
                <span className={`text-7xl font-black font-['Montserrat'] ${topTrait.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10`}>
                  {topTrait.code}
                </span>
                <span className="absolute z-10 text-2xl bottom-2 right-2 opacity-80">{topTrait.icon}</span>
              </div>

              <h2 className={`${topTrait.color} text-3xl mt-2 font-black font-['Montserrat'] tracking-widest uppercase drop-shadow-md`}>
                {topTrait.name}
              </h2>
              <p className="mb-2 text-sm font-bold tracking-widest uppercase text-white/60">{topTrait.en}</p>
              
              <p className="mt-1 text-sm font-medium leading-relaxed tracking-wide text-white/80">{topTrait.desc}</p>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 mx-auto mt-5 transition-all border rounded-full shadow-inner w-max bg-white/10 hover:bg-white/20 border-white/20 active:scale-95"
              >
                <span className={`text-2xl font-black ${topTrait.color} leading-none`}>+</span>
                <span className="text-sm font-bold tracking-widest text-white uppercase">Xem hồ sơ chi tiết</span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full p-5 mb-6 border shadow-lg bg-[#0f172a]/50 backdrop-blur-xl border-white/10 rounded-[28px]">
          <h3 className="text-cyan-300 text-base font-black font-['MuseoModerno'] mb-5 uppercase tracking-widest text-center border-b border-white/10 pb-3">
            📊 BIỂU ĐỒ MÃ RIASEC
          </h3>
          <div className="flex flex-col gap-4">
             {Object.entries(HOLLAND_RIASEC).map(([key, data]) => {
               const currentStatVal = stats[key as keyof typeof stats] || 0;
               const percentage = Math.min(Math.round((currentStatVal / maxStat) * 100), 100);
               const isTop = key === topTraitKey;
               
               return (
                  <div key={key} className={`flex flex-col gap-1.5 p-2 rounded-xl transition-colors ${isTop ? 'bg-white/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-black text-lg bg-black/30 border border-white/10 ${isTop ? data.color : 'text-white/60'}`}>
                        {data.code}
                      </div>
                      <span className={`text-sm font-black font-['MuseoModerno'] tracking-wide uppercase ${isTop ? data.color : 'text-white/80'}`}>{data.name}</span>
                      <span className={`ml-auto text-sm font-black ${isTop ? data.color : 'text-white/60'}`}>{percentage}%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-[8px] overflow-hidden inset-shadow">
                      <div className={`h-full rounded-full stat-bar-anim stat-shimmer bg-gradient-to-r ${data.bg} ${isTop ? 'shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}`} style={{width: `${percentage}%`}}></div>
                    </div>
                  </div>
               )
             })}
          </div>
        </div>

        <div className="w-full p-5 mb-6 bg-gradient-to-br from-[#1e40af]/80 to-[#0284c7]/80 backdrop-blur-xl border border-cyan-300/30 rounded-[28px] shadow-[0_5px_20px_rgba(56,189,248,0.2)]">
          <h3 className="text-yellow-400 text-base font-black font-['Montserrat'] text-center mb-4 tracking-widest uppercase">🎯 NGÀNH HỌC KHUYẾN NGHỊ</h3>
          <div className="flex flex-col gap-3">
            {topTrait.careers.map((career, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-[#0a1930]/80 border border-white/10 rounded-xl shadow-inner">
                <span className="text-base text-yellow-400 drop-shadow-sm">⭐</span>
                <span className="text-white/95 text-base font-bold font-['Montserrat'] tracking-wide">{career}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-start gap-3 p-4 mt-5 border border-green-400/30 bg-green-900/30 rounded-xl">
            <span className="mt-0.5 text-base text-green-400">📩</span>
            <p className="text-xs font-medium leading-relaxed text-green-100">
              Báo cáo chi tiết định hướng du học theo quốc gia đã được hệ thống phân tích và gửi vào Email của bạn.
            </p>
          </div>
        </div>

        <div className="w-full p-5 mb-6 text-center border shadow-lg bg-white/5 backdrop-blur-md border-white/10 rounded-2xl">
          <p className="mb-2 text-sm font-bold tracking-widest uppercase text-cyan-200">Chỉ số năng lực tổng hợp</p>
          <p className="text-4xl font-black text-yellow-400 font-['MuseoModerno'] drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{exp} PTS</p>
        </div>

        {isEligibleForGift && (
          <div className="w-full p-5 mb-6 border shadow-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border-yellow-400/50 rounded-[28px] text-center">
            <h3 className="text-yellow-400 text-lg font-black font-['Montserrat'] mb-2 uppercase tracking-widest">🎉 PHẦN THƯỞNG ĐẶC BIỆT</h3>
            <p className="mb-4 text-sm font-medium text-white/90">Đạt điều kiện {exp} PTS. Nhận quà tặng độc quyền.</p>
            <button 
              onClick={() => setIsGiftModalOpen(true)}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-none shadow-[0_5px_15px_rgba(250,204,21,0.4)] rounded-full py-3 text-base font-black font-['Montserrat'] uppercase tracking-widest active:scale-95 transition-transform"
            >
              🎁 Xem phần thưởng
            </button>
          </div>
        )}

        <div className="flex flex-col w-full gap-4 mb-8">
          <button className="w-full bg-[#f8fafc] text-[#164fa0] border border-white shadow-[0_5px_15px_rgba(255,255,255,0.2)] rounded-full py-4 text-base font-black font-['Montserrat'] uppercase tracking-widest active:scale-95 transition-transform">
            📤 Nhận tư vấn 1-1
          </button>
          <button onClick={onReplay} className="w-full bg-black/30 text-white/80 border border-white/20 hover:bg-black/50 rounded-full py-4 text-base font-black font-['Montserrat'] uppercase tracking-widest active:scale-95 transition-transform">
            🔄 Đánh giá lại
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 px-5 py-3 mx-auto mt-2 border rounded-full w-max bg-black/40 border-white/10 backdrop-blur-md">
          <span className="text-2xl">📞</span>
          <span className="text-xs font-semibold tracking-widest uppercase text-cyan-200">Tổng đài HTO:</span>
          <span className="text-xl font-black tracking-widest text-yellow-400">1800 9078</span>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1930]/90 backdrop-blur-sm fade-in">
          <div className="relative w-full max-w-sm p-6 bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] border border-cyan-400/30 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute flex items-center justify-center w-10 h-10 text-2xl border rounded-full top-4 right-4 text-white/60 hover:text-white border-white/20 bg-black/20"
            >
              ✕
            </button>

            <div className="flex flex-col items-center mt-2 mb-6">
              <div className="flex items-center justify-center w-20 h-20 mb-3 border rounded-2xl bg-white/5 border-white/10">
                <span className={`text-5xl font-black font-['Montserrat'] ${topTrait.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}>
                  {topTrait.code}
                </span>
              </div>
              <h3 className={`text-3xl font-black font-['Montserrat'] uppercase tracking-widest ${topTrait.color} drop-shadow-sm`}>
                {topTrait.name}
              </h3>
              <p className="mt-1 text-sm font-bold tracking-widest uppercase text-white/60">{topTrait.en}</p>
            </div>

            <div className="p-5 mb-6 border bg-black/30 rounded-2xl border-white/10">
              <h4 className="mb-2 text-sm font-bold tracking-widest uppercase text-cyan-300">Đặc điểm phân tích</h4>
              <p className="text-base font-medium leading-relaxed text-white/90">
                {topTrait.detailedDesc}
              </p>
            </div>

            <div className="p-5 border bg-black/30 rounded-2xl border-white/10">
              <h4 className="mb-3 text-sm font-bold tracking-widest text-yellow-400 uppercase">Định hướng nghề nghiệp</h4>
              <ul className="space-y-3">
                {topTrait.careers.map((career, index) => (
                  <li key={index} className="flex items-center gap-3 text-base font-semibold text-white/80">
                    <span className="text-sm text-yellow-400/80">▶</span> {career}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

      {isGiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1930]/90 backdrop-blur-sm fade-in">
          <div className="relative w-full max-w-sm p-6 bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] border border-yellow-400/50 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] text-center">
            
            <button 
              onClick={() => setIsGiftModalOpen(false)}
              className="absolute flex items-center justify-center w-10 h-10 text-2xl border rounded-full top-4 right-4 text-white/60 hover:text-white border-white/20 bg-black/20"
            >
              ✕
            </button>

            <h3 className="text-2xl font-black text-yellow-400 font-['Montserrat'] uppercase tracking-widest mb-4 mt-4 drop-shadow-md">
              XÁC NHẬN PHẦN THƯỞNG
            </h3>

            <div className="flex justify-center mb-4">
               <img src="https://i.ibb.co/fzs0c4j9/Thi-t-k-ch-a-c-t-n-1.png" alt="Móc khóa cá heo HTO" className="w-48 h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] rounded-xl bg-white/5 p-2" />
            </div>

            <p className="mb-6 text-sm font-medium leading-relaxed text-white/90">
              Móc khóa Cá heo HTO Graduate. Chụp ảnh màn hình giao diện này và gửi bộ phận tư vấn hoặc liên hệ trực tiếp để nhận.
            </p>

            <div className="p-4 mb-6 border bg-black/30 rounded-xl border-white/10">
              <p className="mb-1 text-xs font-bold tracking-widest uppercase text-cyan-200">Mã Nhận Quà</p>
              <p className="text-2xl font-black tracking-widest text-white">HTO-{exp}</p>
            </div>

            <button 
              onClick={() => setIsGiftModalOpen(false)}
              className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-full py-3 text-sm font-black font-['Montserrat'] uppercase tracking-widest active:scale-95 transition-transform"
            >
              Đóng
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default ResultScreen;
