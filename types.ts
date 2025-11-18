// This type is defined in the Firebase SDK, but we can create a simple
// version of it here to avoid a full dependency for type checking.
export interface FieldValue {};

export interface Geolocation {
  latitude: number;
  longitude: number;
}

export interface ReportEntry {
  id: string; // Client-side unique ID for lists
  imageFiles: File[]; // For new uploads
  imageUrls: string[]; // For existing images
  description: string;
  geolocation?: Geolocation | null;
}

// Represents the data structure for a report being created or saved.
// The `id` is optional because it doesn't exist before being saved to Firestore.
export interface Report {
  id?: string;
  title: string;
  clientName: string;
  reporterName: string;
  entries: {
    imageUrls: string[];
    description: string;
    geolocation?: Geolocation | null;
  }[];
  createdAt: Date | FieldValue;
}


// This represents a report that has been fetched from Firestore,
// so it is guaranteed to have an ID and a JS Date object.
export type ClientReport = {
  id: string;
  title: string;
  clientName: string;
  reporterName:string;
  entries: {
    imageUrls: string[];
    description: string;
    geolocation?: Geolocation | null;
  }[];
  createdAt: Date;
};