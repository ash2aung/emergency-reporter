import L from 'leaflet';

export enum ReportStatus {
  OPEN = "Open",
  RESOLVED = "Resolved",
}

export type ReportData = {
  type: string,
  location: L.LatLng | null,
  reporterName: string,
  reporterPhone: string,
  time: number,
  status: ReportStatus,
  comment?: string,
  image?: string
}

export type ReportsState = {
  reports: ReportData[];
  setReports: React.Dispatch<React.SetStateAction<ReportData[]>>;
  currentReport: ReportData | null;
  setCurrentReport: React.Dispatch<React.SetStateAction<ReportData | null>>;
  reportLocations: ReportData[];
  setReportLocations: React.Dispatch<React.SetStateAction<ReportData[]>>;
  oneTimeReport: ReportData | null;
  setOneTimeReport: React.Dispatch<React.SetStateAction<ReportData | null>>;
}

export interface ReportDataProps {
  reportState: ReportsState;
}
