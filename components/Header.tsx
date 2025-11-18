import React from 'react';

interface HeaderProps {
  onNavigateToDashboard: () => void;
  onNavigateToForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToDashboard, onNavigateToForm }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={onNavigateToDashboard}>
            <img 
              src="https://i.postimg.cc/qBycJVmj/powerpnglogo.png" 
              alt="Logo de Power Energy Distribution" 
              className="h-10 w-auto" 
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-800">Reportero de Campo</h1>
              <p className="text-xs text-slate-500">División Proyectos y Servicios</p>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex items-center">
            <button
              onClick={onNavigateToForm}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Crear Informe</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;