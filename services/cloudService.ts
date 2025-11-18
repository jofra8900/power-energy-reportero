import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { Report, ClientReport } from '../types';

// --- PASO 1: Configuración de Cloudinary ---
const CLOUDINARY_CLOUD_NAME = 'dtzvkxvzp';
const CLOUDINARY_UPLOAD_PRESET = 'reportero-campo';

// --- ¡NUEVO! Pega tu API Key de Cloudinary aquí ---
// Ve a tu Dashboard de Cloudinary, copia la "API Key" y pégala aquí.
const CLOUDINARY_API_KEY = '155613414373161'; 

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


// --- PASO 2: Configuración de Firebase (YA COMPLETADO) ---
const firebaseConfig = {
  apiKey: "AIzaSyBYKWI82x1X4r6FrEnDx5jXKPT7NavUq54",
  authDomain: "power-energy-reporter.firebaseapp.com",
  projectId: "power-energy-reporter",
  storageBucket: "power-energy-reporter.firebasestorage.app",
  messagingSenderId: "1027998647290",
  appId: "1:1027998647290:web:66140e5ca9294e9eeb5a43",
  measurementId: "G-94MT0VGT3W"
};

// --- Inicialización de Servicios (No necesitas tocar esto) ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/**
 * Sube un archivo de imagen a Cloudinary usando el upload preset "unsigned".
 * @param file El archivo de imagen a subir.
 * @returns Una promesa que resuelve con la URL segura de la imagen subida.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('api_key', CLOUDINARY_API_KEY);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error de Cloudinary: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    throw error;
  }
};


/**
 * Guarda el documento del informe en la base de datos de Firebase Firestore.
 * @param reportData El objeto del informe a guardar.
 * @returns Una promesa que resuelve con el ID del nuevo documento.
 */
export const saveReport = async (reportData: Omit<Report, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const reportWithTimestamp = {
        ...reportData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, "reports"), reportWithTimestamp);
    console.log("Documento guardado en Firestore con ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error al añadir documento a Firestore: ", e);
    throw e;
  }
};

/**
 * Actualiza un documento de informe existente en Firestore.
 * @param reportId El ID del informe a actualizar.
 * @param reportData Los datos del informe a actualizar.
 * @returns Una promesa que se resuelve cuando la actualización se completa.
 */
export const updateReport = async (reportId: string, reportData: Omit<Report, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const reportDocRef = doc(db, "reports", reportId);
    await updateDoc(reportDocRef, reportData);
    console.log("Documento actualizado en Firestore con éxito:", reportId);
  } catch (e) {
    console.error("Error al actualizar el documento de Firestore:", e);
    throw e;
  }
};

/**
 * Recupera todos los informes de Firestore, ordenados por fecha de creación descendente.
 * @returns Una promesa que resuelve con un array de informes.
 */
export const getReports = async (): Promise<ClientReport[]> => {
  try {
    const reportsCollection = collection(db, "reports");
    const q = query(reportsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const reports: ClientReport[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Asegurarse de que createdAt existe y es un objeto Timestamp antes de convertir
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        reports.push({
          id: doc.id,
          title: data.title,
          reporterName: data.reporterName || '',
          entries: data.entries,
          createdAt: data.createdAt.toDate(),
        });
      }
    });
    return reports;
  } catch (e) {
    console.error("Error al obtener los informes: ", e);
    throw e;
  }
};

/**
 * Elimina un documento de informe de Firestore.
 * @param reportId El ID del informe a eliminar.
 * @returns Una promesa que se resuelve cuando la eliminación se completa.
 */
export const deleteReport = async (reportId: string): Promise<void> => {
  try {
    const reportDocRef = doc(db, "reports", reportId);
    await deleteDoc(reportDocRef);
    console.log("Documento eliminado de Firestore con éxito:", reportId);
  } catch (e) {
    console.error("Error al eliminar el documento de Firestore: ", e);
    throw e;
  }
};