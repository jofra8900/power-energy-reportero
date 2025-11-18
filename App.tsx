import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import ReportSuccess from './components/ReportSuccess';
import Dashboard from './components/Dashboard';
import StartupAnimation from './components/StartupAnimation';
import { ClientReport } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'form' | 'success'>('dashboard');
  const [activeReport, setActiveReport] = useState<ClientReport | null>(null);
  const [reportToEdit, setReportToEdit] = useState<ClientReport | null>(null);
  const [cameFrom, setCameFrom] = useState<'dashboard' | 'form'>('dashboard');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const clearState = () => {
    setActiveReport(null);
    setReportToEdit(null);
  };

  const handleNavigateToForm = () => {
    clearState();
    setView('form');
  };

  const handleNavigateToDashboard = () => {
    clearState();
    setView('dashboard');
  };
  
  const handleNavigateToEditForm = (report: ClientReport) => {
    setReportToEdit(report);
    setActiveReport(null); // Ensure we're not in "view" mode
    setView('form');
  };

  const handleViewReport = (report: ClientReport) => {
    setActiveReport(report);
    setReportToEdit(null);
    setCameFrom('dashboard');
    setView('success');
  };

  const handleSaveSuccess = (report: ClientReport) => {
    setActiveReport(report);
    setReportToEdit(null);
    setCameFrom('form');
    setView('success');
  };
  
  const handleCancelEdit = () => {
      // If user was editing and cancels, go back to the dashboard
      setReportToEdit(null);
      setView('dashboard');
  };

  const renderMainContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onSelectReport={handleViewReport} onEditReport={handleNavigateToEditForm} />;
      case 'form':
        return (
            <ReportForm 
                onSaveSuccess={handleSaveSuccess} 
                reportToEdit={reportToEdit}
                onCancelEdit={handleCancelEdit}
            />
        );
      case 'success':
        if (!activeReport) {
          return <Dashboard onSelectReport={handleViewReport} onEditReport={handleNavigateToEditForm} />;
        }
        return (
          <ReportSuccess
            report={activeReport}
            onBack={cameFrom === 'dashboard' ? handleNavigateToDashboard : handleNavigateToForm}
            onEdit={handleNavigateToEditForm}
            backButtonText={cameFrom === 'dashboard' ? '← Volver al Panel' : '+ Crear Nuevo Informe'}
          />
        );
      default:
         return <Dashboard onSelectReport={handleViewReport} onEditReport={handleNavigateToEditForm} />;
    }
  };
  
  if (isLoading) {
    return <StartupAnimation />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header 
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToForm={handleNavigateToForm}
      />
      <main className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
        {renderMainContent()}
      </main>
      <footer className="text-center p-6 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Power Energy Distribution. Todos los derechos reservados.</p>
        <a href="https://www.powercorp.com.pe" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
          www.powercorp.com.pe
        </a>
      </footer>
    </div>
  );
};

export default App;