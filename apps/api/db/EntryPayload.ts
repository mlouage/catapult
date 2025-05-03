
export type EntryPayload = {
  id: number;
  documentId: string;
  locale?: string | null; // Optional
  title?: string | null; // Optional
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt?: string | null; // ISO date string
  createdBy?: {
    id?: number; // Assuming ID might be there sometimes
    documentId?: string;
    firstname?: string | null;
    lastname?: string | null;
  } | null; // Optional
  updatedBy?: {
    id?: number;
    documentId?: string;
    firstname?: string | null;
    lastname?: string | null;
  } | null; // Optional
  [key: string]: any; // Allow other arbitrary fields
};
