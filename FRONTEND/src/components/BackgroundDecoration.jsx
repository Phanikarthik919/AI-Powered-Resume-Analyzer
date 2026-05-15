import React from 'react';

function BackgroundDecoration() {
  // We'll create a few "document" shapes that drift slowly
  const documents = Array.from({ length: 6 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {documents.map((_, i) => (
        <div
          key={i}
          className="absolute bg-white/60 rounded-lg shadow-2xl border border-[#e8e8ed] flex flex-col p-4 gap-2 animate-float blur-[0.5px]"
          style={{
            width: '160px',
            height: '220px',
            left: `${(i * 18) + 2}%`,
            top: `${(i * 12) + 5}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${25 + Math.random() * 5}s`,
            opacity: 0.3 + Math.random() * 0.2,
            transform: `rotate(${i * 30}deg) scale(${0.9 + Math.random() * 0.2})`,
          }}
        >
          {/* Mock Document Content */}
          <div className="h-2 w-3/4 bg-[#e8e8ed] rounded-full" />
          <div className="h-2 w-full bg-[#e8e8ed] rounded-full" />
          <div className="h-2 w-5/6 bg-[#e8e8ed] rounded-full" />
          <div className="mt-4 h-2 w-1/2 bg-[#0066cc]/20 rounded-full" />
          <div className="h-2 w-3/4 bg-[#e8e8ed] rounded-full" />
          <div className="h-2 w-full bg-[#e8e8ed] rounded-full" />
          <div className="h-2 w-2/3 bg-[#e8e8ed] rounded-full" />
        </div>
      ))}
      
      {/* Decorative Gradients for additional depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0066cc]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5856d6]/5 rounded-full blur-[120px]" />
    </div>
  );
}

export default BackgroundDecoration;
