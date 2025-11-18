import React, { useState, useEffect } from 'react';
import { Report } from '../types';
import { DownloadCloudIcon, CopyIcon } from './ShareIcons';
import Loader from './Loader';

type ReportEntries = Report['entries'];

interface ImageGalleryProps {
  entries: ReportEntries;
  onClose: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ entries, onClose }) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    if (entries.length > 0) {
      setSelectedImageUrl(entries[0].imageUrl);
    }
  }, [entries]);
  
  const handleDownload = async () => {
      if (!selectedImageUrl) return;
      setIsDownloading(true);
      try {
        const encodedUrl = encodeURIComponent(selectedImageUrl);
        const response = await fetch(`https://corsproxy.io/?${encodedUrl}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const filename = selectedImageUrl.substring(selectedImageUrl.lastIndexOf('/') + 1) || 'download.jpg';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading image:', error);
        alert('No se pudo descargar la imagen. Por favor, intente de nuevo.');
      } finally {
        setIsDownloading(false);
      }
  };

  const handleCopyLink = () => {
    if (!selectedImageUrl) return;
    navigator.clipboard.writeText(selectedImageUrl).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full h-full max-w-6xl flex flex-col p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <h2 className="text-xl font-bold text-slate-800">Galería de Fotos</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-3xl font-bold leading-none transition-colors">&times;</button>
        </div>

        <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
          {/* Main Image Viewer */}
          <div className="flex-grow md:w-4/5 h-1/2 md:h-full flex flex-col items-center justify-center bg-slate-100 rounded-md p-2">
            {selectedImageUrl ? (
                <img src={selectedImageUrl} alt="Vista ampliada" className="max-w-full max-h-full object-contain" />
            ) : (
                <p className="text-slate-500">Seleccione una imagen</p>
            )}
          </div>
          
          {/* Thumbnails & Actions */}
          <div className="md:w-1/5 h-1/2 md:h-full flex flex-col">
            <div className="flex-grow overflow-y-auto pr-2 space-y-2">
              {entries.map((entry, index) => (
                <img
                  key={index}
                  src={entry.imageUrl}
                  alt={`Registro ${index + 1}`}
                  onClick={() => setSelectedImageUrl(entry.imageUrl)}
                  className={`w-full h-auto object-cover rounded-md cursor-pointer border-4 transition-all ${selectedImageUrl === entry.imageUrl ? 'border-blue-500' : 'border-transparent hover:border-slate-300'}`}
                />
              ))}
            </div>
             <div className="border-t border-slate-200 pt-3 mt-3 flex flex-col gap-2">
                <button 
                  onClick={handleDownload}
                  disabled={!selectedImageUrl || isDownloading}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-300 text-sm font-semibold rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors"
                >
                    {isDownloading ? <Loader colorClass="text-slate-700" /> : <DownloadCloudIcon />}
                    {isDownloading ? 'Descargando...' : 'Descargar Foto'}
                </button>
                <button
                   onClick={handleCopyLink}
                   disabled={!selectedImageUrl}
                   className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 transition-colors"
                >
                    <CopyIcon/>
                    {copyStatus === 'copied' ? '¡Enlace Copiado!' : 'Copiar Enlace'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;