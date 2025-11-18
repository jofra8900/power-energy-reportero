import React, { useState } from 'react';
import { ClientReport } from '../types';
import { MailIcon, WhatsAppIcon, GalleryIcon, EditIcon } from './ShareIcons';
import ImageGallery from './ImageGallery';

interface ReportSuccessProps {
  report: ClientReport;
  onBack: () => void;
  onEdit: (report: ClientReport) => void;
  backButtonText: string;
}

const ReportSuccess: React.FC<ReportSuccessProps> = ({ report, onBack, onEdit, backButtonText }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const generatePlainTextSummary = () => {
    let summary = `*Pre-Informe de Campo: ${report.title}*\n`;
    summary += `*Reportado por:* ${report.reporterName}\n`;
    summary += `*Fecha:* ${report.createdAt.toLocaleString('es-PE')}\n\n`;
    summary += `*Registros de Avance:*\n`;
    report.entries.forEach((entry, index) => {
      summary += `\n*Registro ${index + 1}:*\n`;
      summary += `Descripción: ${entry.description}\n`;
      if (entry.geolocation) {
          summary += `Ubicación: https://www.google.com/maps?q=${entry.geolocation.latitude},${entry.geolocation.longitude}\n`;
      }
      summary += `Foto: ${entry.imageUrl}\n`;
    });
    return summary;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generatePlainTextSummary());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Pre-Informe: ${report.title}`);
    const body = encodeURIComponent(generatePlainTextSummary());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const reportHtml = `
        <html>
          <head>
            <title>Pre-Informe: ${report.title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .no-print { display: none; }
              }
              body { font-family: 'Inter', sans-serif; }
              .page-break { page-break-after: always; }
              img { max-width: 100%; height: auto; border-radius: 0.5rem; }
            </style>
          </head>
          <body class="p-8 bg-gray-50">
            <header class="flex items-center justify-between pb-4 border-b-2 border-gray-200">
                <img src="https://i.postimg.cc/qBycJVmj/powerpnglogo.png" alt="Logo" class="h-16 w-auto"/>
                <div class="text-right">
                    <h1 class="text-2xl font-bold text-gray-800">Pre-Informe de Campo</h1>
                    <p class="text-gray-600">División Proyectos y Servicios</p>
                </div>
            </header>
            <main class="mt-8">
                <h2 class="text-3xl font-bold mb-2 text-gray-900">${report.title}</h2>
                <p class="text-gray-500 mb-2">Generado el: ${report.createdAt.toLocaleString('es-PE', { dateStyle: 'full', timeStyle: 'short' })}</p>
                <p class="text-gray-600 mb-8">Reportado por: <span class="font-semibold text-gray-800">${report.reporterName}</span></p>
                
                <div class="space-y-8">
                    ${report.entries.map((entry, index) => `
                        <div class="border border-gray-200 rounded-lg p-6 bg-white break-inside-avoid shadow-sm">
                            <h3 class="text-xl font-semibold text-gray-800 mb-4">Registro de Avance #${index + 1}</h3>
                            ${entry.geolocation ? `
                            <div class="flex items-center gap-2 text-sm text-blue-600 mb-4">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <a href="https://www.google.com/maps?q=${entry.geolocation.latitude},${entry.geolocation.longitude}" target="_blank" rel="noopener noreferrer" class="hover:underline font-medium">
                                    Ver en Google Maps
                                </a>
                            </div>` : ''}
                            <div class="grid grid-cols-2 gap-6">
                                <div class="col-span-2 sm:col-span-1">
                                    <p class="font-bold text-gray-600 mb-2">Fotografía:</p>
                                    <img src="${entry.imageUrl}" alt="Registro ${index + 1}" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <p class="font-bold text-gray-600 mb-2">Descripción:</p>
                                    <p class="text-gray-700 whitespace-pre-wrap text-sm">${entry.description || 'Sin descripción.'}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </main>
          </body>
        </html>
      `;
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };
  
  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200 text-center animate-fade-in">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 text-3xl font-bold text-slate-800">¡Pre-Informe Guardado!</h2>
        <p className="mt-2 text-slate-600">El informe <span className="font-semibold text-slate-700">"{report.title}"</span> se ha guardado correctamente.</p>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Acciones del Informe */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Acciones del Informe</h3>
              <div className="flex flex-col gap-3">
                 <button
                    onClick={handleDownloadPdf}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-300 text-sm font-semibold rounded-md text-slate-700 bg-white hover:bg-slate-100 transition-colors"
                  >
                    Descargar (PDF)
                  </button>
                  <button
                    onClick={() => onEdit(report)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-300 text-sm font-semibold rounded-md text-slate-700 bg-white hover:bg-slate-100 transition-colors"
                  >
                    <EditIcon /> Editar Informe
                  </button>
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-300 text-sm font-semibold rounded-md text-slate-700 bg-white hover:bg-slate-100 transition-colors"
                  >
                    <GalleryIcon /> Ver Galería de Fotos
                  </button>
              </div>
            </div>

            {/* Compartir */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Compartir</h3>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleShareWhatsApp}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors"
                    >
                        <WhatsAppIcon /> WhatsApp
                    </button>
                    <button
                        onClick={handleShareEmail}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-slate-600 hover:bg-slate-700 transition-colors"
                    >
                        <MailIcon /> Correo Electrónico
                    </button>
                </div>
            </div>
        </div>

        <div className="mt-10">
          <button
            onClick={onBack}
            className="w-full md:w-auto px-8 py-3 font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            {backButtonText}
          </button>
        </div>
      </div>
      
      {isGalleryOpen && (
        <ImageGallery 
          entries={report.entries}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </>
  );
};

export default ReportSuccess;