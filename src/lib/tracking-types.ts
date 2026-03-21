/** Single entry in merged parcel timeline (new API + HM). */
export interface TrackingTimelineEvent {
   timestamp: string | null;
   statusCode: string;
   statusName: string;
   statusDescription: string | null;
   location: string | null;
   locationId: number | null;
   updateMethod: string;
   userName: string | null;
   source: "NEW" | "HM";
}

/** Normalized shape from GET /api/tracking/lookup (proxied upstream). Extend as your API evolves. */
export interface TrackingParcel {
   id?: string;
   hbl?: string;
   description?: string;
   weight?: string | number;
   status?: string;
   status_message?: string;
   events?: unknown[];
   /** HM envío history when lookup enriched server-side */
   historial?: unknown[];
   /** Merged normalized events (base + HM) when server ran merge */
   timeline?: TrackingTimelineEvent[];
   [key: string]: unknown;
}

export interface TrackingInvoice {
   invoiceId?: string | number;
   agency?: string;
   province?: string;
   city?: string;
   parcels?: TrackingParcel[];
   [key: string]: unknown;
}
