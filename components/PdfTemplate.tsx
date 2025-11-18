import React from 'react';
import { ClientReport } from '../types';

interface PdfTemplateProps {
  report: ClientReport;
}

/**
 * Este componente genera el HTML que se usará para crear el PDF.
 * Está diseñado para imprimirse a través de html2canvas y jsPDF.
 */
const PdfTemplate: React.FC<PdfTemplateProps> = ({ report }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div
      id="pdf-content"
      style={{
        padding: '40px',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        lineHeight: '1.6'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #1e40af', paddingBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px', color: '#1e40af', fontSize: '28px' }}>Power Energy</h1>
        <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#666' }}>Reportero de Campo</p>
        <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>Informe Técnico</p>
      </div>

      {/* Report Info */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', color: '#1e40af', marginBottom: '15px' }}>Información del Informe</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', fontWeight: 'bold', width: '30%' }}>Título:</td>
              <td style={{ padding: '8px' }}>{report.title}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Cliente:</td>
              <td style={{ padding: '8px' }}>{report.clientName}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Reportero:</td>
              <td style={{ padding: '8px' }}>{report.reporterName}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Fecha:</td>
              <td style={{ padding: '8px' }}>{formatDate(report.createdAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Entries */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', color: '#1e40af', marginBottom: '15px' }}>Registros del Informe</h2>
        {report.entries.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
            <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>Entrada #{idx + 1}</h3>

            {/* Images */}
            {entry.imageUrls && entry.imageUrls.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Imágenes:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {entry.imageUrls.map((url, imgIdx) => (
                    <img
                      key={imgIdx}
                      src={url}
                      alt={`Imagen ${imgIdx + 1}`}
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {entry.description && (
              <div style={{ marginBottom: '10px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Descripción:</p>
                <p style={{ margin: '0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{entry.description}</p>
              </div>
            )}

            {/* Geolocation */}
            {entry.geolocation && (
              <div style={{ marginBottom: '10px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Ubicación:</p>
                <p style={{ margin: '0' }}>
                  Latitud: {entry.geolocation.latitude.toFixed(6)} | Longitud: {entry.geolocation.longitude.toFixed(6)}
                </p>
              </div>
            )}

            <hr style={{ margin: '20px 0', borderTop: '1px solid #ddd', borderBottom: 'none' }} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd', fontSize: '12px', color: '#666' }}>
        <p style={{ margin: '0' }}>Este informe fue generado automáticamente por Power Energy - Reportero de Campo.</p>
        <p style={{ margin: '0' }}>&copy; {new Date().getFullYear()} Power Energy Distribution. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default PdfTemplate;
