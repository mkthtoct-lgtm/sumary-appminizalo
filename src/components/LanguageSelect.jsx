import React from 'react';
import { useNavigate } from 'zmp-ui';

const LanguageSelect = ({ onSelect, onBack }) => {
  const navigate = useNavigate();
  const languages = [
    { code: 'en', name: 'Tiếng Anh', sub: 'IELTS / TOEIC', flag: 'gb', color: 'blue' },
    { code: 'zh', name: 'Tiếng Trung', sub: 'HSK Standard', flag: 'cn', color: 'red' },
    { code: 'kr', name: 'Tiếng Hàn', sub: 'TOPIK', flag: 'kr', color: 'indigo' },
    { code: 'de', name: 'Tiếng Đức', sub: 'Goethe Zertifikat', flag: 'de', color: 'yellow' },
    { code: 'jp', name: 'Tiếng Nhật', sub: 'JLPT / Nat-Test', flag: 'jp', color: 'pink' },
  ];

  return (
    <div className="w-full max-w-md fade-in">
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-6">
        <div className="w-8 h-1.5 bg-white rounded-full"></div>
        <div className="w-8 h-1.5 bg-white/40 rounded-full"></div>
        <div className="w-8 h-1.5 bg-white/40 rounded-full"></div>
      </div>

      <div className="w-full flex justify-start mb-4">
        <button
          onClick={() => {
            if (typeof onBack === "function") {
              onBack();
              return;
            }
            navigate('/english');
          }}
          className="px-3 py-2 text-sm font-semibold text-white/90 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
        >
          ← Quay lại
        </button>
      </div>
      <div className="p-6 bg-white/90 backdrop-blur-xl shadow-2xl rounded-[2rem] border border-white/60 card-3d">
        <div className="mb-6 text-center">
          <div className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100 rounded-full">Bước 2</div>
          <h2 className="text-2xl font-black text-gray-800">Chọn Điểm Đến 🌏</h2>
          <p className="text-sm font-medium text-gray-500">Bạn muốn chinh phục ngôn ngữ nào?</p>
        </div>

        <div className="flex flex-col gap-3">
          {languages.map((lang) => (
            <button 
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className={`relative flex items-center w-full p-3 transition-all bg-white border-2 border-transparent shadow-sm rounded-2xl hover:border-${lang.color}-400 hover:shadow-lg group`}
            >
              <div className="flex-shrink-0 w-12 overflow-hidden border border-gray-100 rounded-lg shadow-sm h-9">
                <img src={`https://flagcdn.com/w80/${lang.flag}.png`} alt={lang.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex-grow ml-4 text-left">
                <div className={`text-lg font-bold text-gray-800 group-hover:text-${lang.color}-700`}>{lang.name}</div>
                <div className="text-xs font-semibold tracking-wide text-gray-400 uppercase">{lang.sub}</div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full bg-gray-50 group-hover:bg-${lang.color}-100 group-hover:text-${lang.color}-600`}>➜</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
