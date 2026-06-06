import React, { useState, useEffect } from 'react';
import { appConfig } from '../public/models/DataModel';

const Form = ({ onSubmit, initialData }) => {
  
  // 1. KHỞI TẠO STATE
  const [formData, setFormData] = useState({
    fullName: '',
    schoolName: '',
    phoneNumber: '',
    userEmail: '',
    phoneConsent: true
  });

  const [errors, setErrors] = useState({});

  // 2. TỰ ĐỘNG ĐIỀN DỮ LIỆU (Khi nhận được từ Welcome)
  useEffect(() => {
    if (initialData) {
      console.log("📝 Form nhận được dữ liệu:", initialData);
      setFormData(prev => ({
        ...prev,
        fullName: initialData.fullName || initialData.full_name || initialData.name || prev.fullName,
        schoolName: initialData.schoolName || initialData.school_name || initialData.school || prev.schoolName,
        phoneNumber: initialData.phoneNumber || initialData.phone_number || initialData.phone || prev.phoneNumber,
        userEmail: initialData.userEmail || initialData.email || prev.userEmail
      }));
    }
  }, [initialData]);

  // 2b. Nếu người dùng vừa nhập trường ở form đầu (Quiz1), dữ liệu được
  // lưu trong localStorage key `globalFormMemory:q1_school` (useFormState).
  // Khi mở Form ở trang English, ưu tiên lấy giá trị này để autofill.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('globalFormMemory:q1_school');
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && String(saved).trim() !== '') {
          setFormData(prev => ({ ...prev, schoolName: String(saved) }));
          console.log('🔁 Form autofill schoolName from globalFormMemory:q1_school ->', saved);
        }
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // 3. XỬ LÝ INPUT
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));

    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  // 4. VALIDATE FORM
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên.";
    if (!formData.schoolName.trim()) newErrors.schoolName = "Vui lòng nhập tên trường/đơn vị.";

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại.";
    } else {
       if (!/(0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.phoneNumber) && formData.phoneNumber.length !== 10) {
          if (!/^0\d{9}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ (10 số, bắt đầu là 0).";
          }
       }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userEmail) {
      newErrors.userEmail = "Vui lòng nhập email.";
    } else if (!emailRegex.test(formData.userEmail)) {
      newErrors.userEmail = "Định dạng email không đúng.";
    }

    if (!formData.phoneConsent) {
      newErrors.phoneConsent = "Bạn cần đồng ý chia sẻ thông tin để tiếp tục.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  const getInputClass = (fieldName) => {
    return `w-full py-3.5 pl-11 pr-4 text-gray-700 bg-gray-50 border rounded-xl transition-all outline-none 
    ${errors[fieldName] 
      ? 'border-red-500 focus:ring-red-100 focus:border-red-500 bg-red-50' 
      : 'border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'}`;
  };

  return (
    <div className="w-full max-w-md fade-in">
      <div className="relative overflow-hidden bg-white shadow-2xl rounded-3xl card-3d">
        
        {/* Header Form */}
        <div className="px-8 py-6 text-center bg-blue-50">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 text-2xl text-blue-600 bg-white rounded-full shadow-md">📋</div>
          <h2 className="text-xl font-bold text-gray-800">Thông tin ứng viên</h2>
          <p className="mt-1 text-xs tracking-wider text-gray-500 uppercase">
            {initialData?.phoneNumber ? "Hoàn tất các thông tin còn lại" : "Vui lòng điền thông tin để bắt đầu"}
          </p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            {!initialData?.fullName && (
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-xl opacity-60">👤</span>
                <input 
                  type="text" id="fullName" 
                  value={formData.fullName} onChange={handleChange}
                  className={getInputClass('fullName')}
                  placeholder="Họ và Tên" 
                />
                {errors.fullName && <p className="mt-1 ml-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>
            )}

            {/* School */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-xl opacity-60">🏫</span>
              <input 
                type="text" id="schoolName" 
                value={formData.schoolName} onChange={handleChange}
                className={getInputClass('schoolName')}
                placeholder="Tên Trường / Đơn vị" 
              />
              {errors.schoolName && <p className="mt-1 ml-1 text-xs text-red-500">{errors.schoolName}</p>}
            </div>

            {/* Phone */}
            {!initialData?.phoneNumber && (
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-xl opacity-60">📞</span>
                <input 
                  type="tel" id="phoneNumber" maxLength="10"
                  value={formData.phoneNumber} onChange={handleChange}
                  className={getInputClass('phoneNumber')}
                  placeholder="Số điện thoại (Zalo)" 
                />
                {errors.phoneNumber && <p className="mt-1 ml-1 text-xs text-red-500">{errors.phoneNumber}</p>}
              </div>
            )}

            {/* Email */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-xl opacity-60">✉️</span>
              <input 
                type="email" id="userEmail" 
                value={formData.userEmail} onChange={handleChange}
                className={getInputClass('userEmail')}
                placeholder="Địa chỉ Email" 
              />
              {errors.userEmail && <p className="mt-1 ml-1 text-xs text-red-500">{errors.userEmail}</p>}
            </div>

            {/* Consent Checkbox */}
            <div className={`p-4 border rounded-xl ${errors.phoneConsent ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-blue-50/50'}`}>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox" id="phoneConsent" 
                    checked={formData.phoneConsent} onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                  />
                </div>
                <span className="text-xs font-medium leading-relaxed text-gray-600">
                  {appConfig.consent_text}
                </span>
              </label>
              {errors.phoneConsent && <p className="mt-2 text-xs font-semibold text-center text-red-500">{errors.phoneConsent}</p>}
            </div>

            <button type="submit" className="w-full py-4 text-lg font-bold text-white transition-all duration-300 shadow-xl rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-[1.02] active:scale-95 shadow-blue-200">
              Tiếp tục <span className="ml-1">➡️</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
