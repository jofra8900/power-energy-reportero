import React, { useState, useEffect, useMemo } from 'react';
import { getReports, deleteReport } from '../services/cloudService';
import { ClientReport } from '../types';
import Loader from './Loader';
import { TrashIcon, EditIcon } from './ShareIcons';
import ConfirmationModal from './ConfirmationModal';

interface DashboardProps {
  onSelectReport: (report: ClientReport) => void;
  onEditReport: (report: ClientReport) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectReport, onEditReport }) => {
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportToDeleteId, setReportToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const fetchedReports = await getReports();
        setReports(fetchedReports);
      } catch (err) {
        setError('No se pudieron cargar los informes. Intente de nuevo más tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleOpenDeleteModal = (reportId: string) => {
    setReportToDeleteId(reportId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReportToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDeleteId) return;

    setIsDeleting(true);
    try {
      await deleteReport(reportToDeleteId);
      setReports(prevReports => prevReports.filter(report => report.id !== reportToDeleteId));
      handleCloseModal();
    } catch (error) {
      console.error("Fallo al eliminar el informe:", error);
      alert("Error al eliminar el informe. Por favor, intente de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredReports = useMemo(() => {
    if (!searchQuery) {
      return reports;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return reports.filter(report =>
      report.title.toLowerCase().includes(lowercasedQuery) ||
      (report.reporterName && report.reporterName.toLowerCase().includes(lowercasedQuery))
    );
  }, [reports, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20 bg-white rounded-lg shadow-md border border-slate-200">
        <Loader colorClass="text-blue-600" />
        <span className="ml-4 text-slate-600 font-medium">Cargando informes...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 rounded-md bg-red-100 text-red-800 font-semibold text-center">{error}</div>;
  }

  return (
    <>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200 animate-fade-in">
        <div className="mb-6 border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-bold text-slate-800">Historial de Pre-Informes</h1>
             <div className="mt-4 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por título o reportero..."
                    className="w-full p-3 pl-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
            </div>
        </div>
       
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 font-medium">
              {searchQuery ? 'No se encontraron informes' : 'No se han encontrado informes'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
                {searchQuery ? 'Intente con otra búsqueda.' : 'Cree un nuevo informe para comenzar.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredReports.map((report) => (
              <li
                key={report.id}
                className="bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-blue-400 transition-all duration-200 flex justify-between items-center group"
              >
                <div
                  className="flex-grow p-4 overflow-hidden cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectReport(report)}
                  onKeyPress={(e) => { if (e.key === 'Enter') onSelectReport(report); }}
                >
                  <p className="font-semibold text-blue-700 truncate">{report.title}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Por: <span className="font-medium text-slate-800">{report.reporterName || 'No especificado'}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {report.createdAt.toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 p-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditReport(report); }}
                    className="p-2 rounded-full text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    title="Editar informe"
                    aria-label={`Editar informe ${report.title}`}
                  >
                    <EditIcon />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(report.id); }}
                    className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                    title="Eliminar informe"
                    aria-label={`Eliminar informe ${report.title}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este informe? Esta acción es permanente y no se puede deshacer."
      />
    </>
  );
};

export default Dashboard;