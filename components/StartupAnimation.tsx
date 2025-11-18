import React from 'react';

const StartupAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0; transform: scale(0.95); }
          }
          .animate-fade-in-out {
            animation: fadeInOut 2.5s ease-in-out forwards;
          }
        `}
      </style>
      <img
        src="https://i.postimg.cc/qBycJVmj/powerpnglogo.png"
        alt="Power Energy Distribution Logo"
        className="w-48 h-auto animate-fade-in-out"
      />
    </div>
  );
};

export default StartupAnimation;
