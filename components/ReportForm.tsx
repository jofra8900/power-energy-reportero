import React, { useState, useCallback, useEffect } from 'react';
import { ReportEntry, Report, ClientReport, Geolocation } from '../types';
import ImageInput from './ImageInput';
import Loader from './Loader';
import { uploadImage, saveReport, updateReport } from '../services/cloudService';

interface ReportFormProps {
  onSaveSuccess: (report: ClientReport) => void;
  reportToEdit?: ClientReport | null;
  onCancelEdit: () => void;
}

const ReportEntryEditor: React.FC<{
  entry: ReportEntry;
  onUpdate: (id: string, description: string) => void;
  onRemove: (id: string) => void;
}> = ({ entry, onUpdate, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (entry.imageFile) {
      const url = URL.createObjectURL(entry.imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (entry.imageUrl) {
      setPreviewUrl(entry.imageUrl);
    }
  }, [entry.imageFile, entry.imageUrl]);

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        {previewUrl && (
          <img src={previewUrl} alt="Vista previa del registro" className="w-full md:w-48 h-48 object-cover rounded-md bg-slate-200" />
        )}
        <div className="flex-grow flex flex-col">
          <textarea
            value={entry.description}
            onChange={(e) => onUpdate(entry.id, e.target.value)}
            placeholder="Describa el progreso, problemas u observaciones..."
            className="flex-grow w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-sm"
            rows={5}
          />
           <button
            onClick={() => onRemove(entry.id)}
            className="mt-2 self-end text-sm text-red-600 hover:text-red-800 font-semibold transition-colors"
          >
            Eliminar Registro
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportForm: React.FC<ReportFormProps> = ({ onSaveSuccess, reportToEdit, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [entries, setEntries] = useState<ReportEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!reportToEdit;

  useEffect(() => {
    if (isEditing) {
      setTitle(reportToEdit.title);
      setReporterName(reportToEdit.reporterName);
      const existingEntries = reportToEdit.entries.map((entry, index) => ({
        id: `entry-existing-${index}-${reportToEdit.id}`,
        imageFile: null,
        imageUrl: entry.imageUrl,
        description: entry.description,
        geolocation: entry.geolocation
      }));
      setEntries(existingEntries);
    } else {
        resetForm();
    }
  }, [reportToEdit, isEditing]);

  const addEntry = (file: File, location: Geolocation | null) => {
    const newEntry: ReportEntry = {
      id: `entry-new-${Date.now()}`,
      imageFile: file,
      imageUrl: null,
      description: '',
      geolocation: location
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const updateEntryDescription = (id: string, description: string) => {
    setEntries(prev => prev.map(entry => (entry.id === id ? { ...entry, description } : entry)));
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };
  
  const resetForm = useCallback(() => {
    setTitle('');
    setReporterName('');
    setEntries([]);
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !reporterName || entries.length === 0) {
      setError('Por favor, complete el título, su nombre y agregue al menos un registro con foto.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const uploadedEntries = await Promise.all(
        entries.map(async (entry) => {
          if (entry.imageFile) {
            const uploadedUrl = await uploadImage(entry.imageFile);
            return { imageUrl: uploadedUrl, description: entry.description, geolocation: entry.geolocation };
          }
          return { imageUrl: entry.imageUrl || '', description: entry.description, geolocation: entry.geolocation };
        })
      );
      
      const reportData: Omit<Report, 'id' | 'createdAt'> = {
          title,
          reporterName,
          entries: uploadedEntries,
      };

      if (isEditing) {
        await updateReport(reportToEdit.id, reportData);
        onSaveSuccess({ ...reportData, id: reportToEdit.id, createdAt: reportToEdit.createdAt });
      } else {
        const reportToSave = { ...reportData, createdAt: new Date() };
        const newReportId = await saveReport(reportToSave);
        onSaveSuccess({ ...reportToSave, id: newReportId });
      }
      
      resetForm();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(`Error al guardar: ${errorMessage}`);
      console.error("Submission failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200 animate-fade-in">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">
            {isEditing ? 'Editando Pre-Informe' : 'Crear Nuevo Pre-Informe'}
        </h1>
        {error && (
            <div className="p-4 mb-4 rounded-md bg-red-100 text-red-800 text-sm font-semibold text-center">
                <p>{error}</p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="report-title" className="block text-sm font-semibold text-slate-700 mb-2">
              Proyecto / Título del Informe
            </label>
            <input
              id="report-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Siderperu Chimbote - Fase 2"
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              required
            />
          </div>
           <div>
            <label htmlFor="reporter-name" className="block text-sm font-semibold text-slate-700 mb-2">
              Nombre del Reportero
            </label>
            <input
              id="reporter-name"
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700">Registros de Avance</h2>
            {entries.length > 0 ? (
                entries.map(entry => (
                    <ReportEntryEditor 
                        key={entry.id} 
                        entry={entry} 
                        onUpdate={updateEntryDescription}
                        onRemove={removeEntry}
                    />
                ))
            ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                    <p className="text-slate-500">Aún no hay registros.</p>
                    <p className="text-sm text-slate-400">Agregue una foto para comenzar.</p>
                </div>
            )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-8 pt-6 border-t border-slate-200">
            <ImageInput onImageAdded={addEntry} disabled={isLoading} />
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {isEditing && (
                  <button
                      type="button"
                      onClick={onCancelEdit}
                      disabled={isLoading}
                      className="w-full sm:w-auto px-6 py-3 text-base font-semibold rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-50 transition-colors"
                  >
                      Cancelar
                  </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !title || !reporterName || entries.length === 0}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-base font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 ease-in-out shadow-sm"
              >
                {isLoading ? <Loader /> : (isEditing ? 'Actualizar Pre-Informe' : 'Finalizar y Guardar')}
              </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;