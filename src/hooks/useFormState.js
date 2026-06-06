import { useState, useEffect } from "react";

// ĐÃ THÊM EXPORT Ở ĐÂY ĐỂ CÁC FILE KHÁC CÓ THỂ NHÌN THẤY
export const globalFormMemory = {};

export const useFormState = (key, initialValue) => {
  // 1. Kiểm tra xem trong bộ nhớ tạm đã có dữ liệu của ô này chưa
  const [state, setState] = useState(() => {
    if (globalFormMemory[key] !== undefined) {
      return globalFormMemory[key];
    }
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(`globalFormMemory:${key}`);
        if (raw !== null) return JSON.parse(raw);
      }
    } catch {}
    return initialValue;
  });

  // 2. Tự động lưu lại vào bộ nhớ tạm mỗi khi người dùng gõ/chọn
  useEffect(() => {
    globalFormMemory[key] = state;
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(`globalFormMemory:${key}`, JSON.stringify(state));
      }
    } catch {}
  }, [key, state]);

  // Trả về y chang cấu trúc của useState thông thường
  return [state, setState];
};
