import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import Nav from './nav';
import './index.css';
import { ReportData, ReportsState } from './types';
import { MapPresenter, ReportList } from './components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MapSection({ reportState }: { reportState: ReportsState }) {
  return (
    <Card className="flex-1 flex flex-col bg-card/50 border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">Map</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <div className="h-full min-h-[500px] rounded-lg overflow-hidden">
          <MapPresenter reportState={reportState} />
        </div>
      </CardContent>
    </Card>
  );
}

function LocationsSection({ reportState }: { reportState: ReportsState }) {
  return (
    <Card className="w-[420px] flex flex-col bg-card/50 border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">Reports</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0 overflow-hidden">
        <ReportList reportState={reportState} />
      </CardContent>
    </Card>
  );
}

function ContentSection() {
  const [reports, setReports] = useState<ReportData[] | null>(null);
  const [reportLocations, setReportLocations] = useState<ReportData[]>([]);
  const [oneTimeReport, setOneTimeReport] = useState<ReportData | null>(null);

  let currentReports = reports;
  if (!currentReports) {
    const reportsJson = localStorage.getItem('reports');
    if (reportsJson) {
      const dbReports = JSON.parse(reportsJson) as ReportData[];
      currentReports = dbReports;
      setReports(dbReports);
      if (dbReports.length > 0) {
        setOneTimeReport(dbReports[0]);
        setReportLocations([dbReports[0]]);
      }
    } else {
      currentReports = [];
      setReports([]);
    }
  }

  const [currentReport, setCurrentReport] = useState<ReportData | null>(
    currentReports!.length > 0 ? currentReports![0] : null
  );

  const reportState: ReportsState = {
    reports: currentReports!,
    setReports: setReports as React.Dispatch<React.SetStateAction<ReportData[]>>,
    currentReport,
    setCurrentReport,
    reportLocations,
    setReportLocations,
    oneTimeReport,
    setOneTimeReport
  };

  return (
    <div className="flex-1 flex gap-6 p-6 w-full max-w-[1600px]">
      <MapSection reportState={reportState} />
      <LocationsSection reportState={reportState} />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <header className="px-6 py-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Emergency Reporter
        </h1>
        <p className="text-muted-foreground mt-2">
          Track and manage emergency reports in real-time
        </p>
      </header>
      <ContentSection />
    </div>
  );
}

export default App;
