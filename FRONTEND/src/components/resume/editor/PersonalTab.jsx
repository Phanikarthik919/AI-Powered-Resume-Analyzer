import React from 'react';

const PersonalTab = ({ personalInfo, handlePersonalChange, labelClass, inputClass }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className={labelClass}>Full Name</label>
          <input
            className={`${inputClass} text-lg font-medium`}
            name="name"
            value={personalInfo?.name || ""}
            onChange={handlePersonalChange}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            className={inputClass}
            name="email"
            value={personalInfo?.email || ""}
            onChange={handlePersonalChange}
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            className={inputClass}
            name="phone"
            value={personalInfo?.phone || ""}
            onChange={handlePersonalChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-[#e8e8ed]">
        <h3 className="text-[11px] font-bold text-[#1d1d1f] uppercase tracking-widest mb-4">Online Profiles</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              className={inputClass}
              name="linkedin"
              value={personalInfo?.linkedin || ""}
              onChange={handlePersonalChange}
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input
              className={inputClass}
              name="github"
              value={personalInfo?.github || ""}
              onChange={handlePersonalChange}
              placeholder="github.com/username"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalTab;
