import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import Nav from './nav';
import './index.css';
import { ReportData, ReportsState } from './types';
import { MapPresenter, ReportList } from './components';

interface MapSectionProps {
  reportState: ReportsState;
}

function MapSection({ reportState }: MapSectionProps) {
  return (
    <div className="bg-zinc-800 rounded-lg flex justify-center items-center flex-col text-center mr-0 mt-[6%] mb-[6%] w-full">
      <h3 className="pb-3 font-extrabold w-full text-5xl p-2">Map</h3>
      <MapPresenter reportState={reportState} />
    </div>
  );
}

function LocationsSection({ reportState }: { reportState: ReportsState }) {
  return (
    <div className="bg-zinc-800 rounded-lg flex justify-center items-center flex-col text-center w-full h-full">
      <h3 className="p-2 font-extrabold text-5xl">Reports</h3>
      <ReportList reportState={reportState} />
    </div>
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
    <div className="bg-zinc-800 flex-1 flex w-full justify-around">
      <div className="flex w-[85%] gap-4">
        <MapSection reportState={reportState} />
        <LocationsSection reportState={reportState} />
      </div>
    </div>
  );
}

function WebsiteTitle() {
  return (
    <h1 className="p-2 font-extrabold text-5xl text-center">
      Emergency Reporter
    </h1>
  );
}

function MainContent() {
  return (
    <div id="mainSection" className="flex flex-col items-center h-full">
      <WebsiteTitle />
      <ContentSection />
    </div>
  );
}

function App() {
  return (
    <>
      <Nav />
      <MainContent />
    </>
  );
}

export default App;
