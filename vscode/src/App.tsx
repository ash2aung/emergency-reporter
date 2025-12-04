import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import Nav from './nav';
import './index.css';
import { ReportData, ReportsState } from './types';
import { MapPresenter, ReportList } from './components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MapSection({ reportState }: { reportState: ReportsState }) {
  return (
    <Card className="flex-1 flex flex-col bg-card border-border shadow-lg">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-xl font-semibold tracking-tight text-center">
          Map View
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-6 pt-4">
        <div className="h-full min-h-[600px] rounded-lg overflow-hidden border border-border/50 shadow-inner">
          <MapPresenter reportState={reportState} />
        </div>
      </CardContent>
    </Card>
  );
}

function LocationsSection({ reportState }: { reportState: ReportsState }) {
  return (
    <Card className="w-full max-w-[480px] flex flex-col bg-card border-border shadow-lg">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-xl font-semibold tracking-tight text-center">
          Emergency Reports
          {reportState.reportLocations.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({reportState.reportLocations.length} {reportState.reportLocations.length === 1 ? 'report' : 'reports'})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-6 pt-4 overflow-hidden">
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
    <div className="flex-1 w-full">
      <div className="flex flex-col lg:flex-row gap-6 px-6 lg:px-8 xl:px-12 pt-12 lg:pt-16 pb-6 lg:pb-8 max-w-[1800px] mx-auto">
        <MapSection reportState={reportState} />
        <LocationsSection reportState={reportState} />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <header className="border-b border-border/50 bg-gradient-to-b from-card/30 to-transparent pb-10 lg:pb-12">
        <div className="px-6 lg:px-8 py-8 lg:py-10 max-w-[1800px] mx-auto w-full">
          <div className="flex flex-col gap-3 items-center">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text text-center">
              Emergency Reporter
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto text-center">
              Track and manage emergency reports in real-time
            </p>
          </div>
        </div>
      </header>
      <ContentSection />
    </div>
  );
}

export default App;
