import React from 'react';

const PersonalTab = ({ personalInfo, handlePersonalChange, labelClass, inputClass }) => {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="col-span-2">
        <label className={labelClass}>Full Name</label>
        <input
          className={inputClass}
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
  );
};

export default PersonalTab;
