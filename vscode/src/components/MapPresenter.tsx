import { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ReportData, ReportDataProps } from '../types';
import { isReportsEqual } from '../utils';
import ViewReport from './ViewReport';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MapContainerRecenterer = ({ reportState }: ReportDataProps) => {
  const map = useMap();
  useEffect(() => {
    if (reportState.oneTimeReport && reportState.oneTimeReport.location) {
      const rep = reportState.oneTimeReport;
      map.panTo(reportState.oneTimeReport.location);
      reportState.setOneTimeReport(null);
      reportState.setReportLocations(() => {
        const newLocs = [rep];
        return newLocs;
      });
    }
  });
  return null;
};

interface MapMarkerProps extends ReportDataProps {
  index: number,
  onClick: () => void,
  report: ReportData,
}

function MapMarker({ report, reportState, index, onClick }: MapMarkerProps) {
  const map = useMap();
  const updateLocationsFunc = () => {
    const el = reportState.reportLocations.find(v => isReportsEqual(v, report));
    if (map.getBounds().contains(report.location!)) {
      if (!el) {
        reportState.setReportLocations(oldReports => {
          const newReps = [...oldReports];
          newReps.push(report);
          return newReps;
        });
      }
    } else {
      if (el) {
        reportState.setReportLocations(oldReports => {
          const newReps = [...oldReports];
          newReps.splice(oldReports.indexOf(el), 1);
          return newReps;
        });
      }
    }
  };
  
  useMapEvents({
    drag() {
      updateLocationsFunc();
    },
    zoom() {
      updateLocationsFunc();
    },
  });

  return (
    <Marker
      position={report.location!}
      eventHandlers={{
        dblclick: () => {
          reportState.setCurrentReport(report);
          onClick();
        }
      }}
      keyboard={true}
      alt={`report-${index}`}
    >
      <Popup>
        {`Type: ${report.type}`}
      </Popup>
    </Marker>
  );
}

type LocationFinderProps = {
  setCurrentLoc: React.Dispatch<React.SetStateAction<L.LatLng>>;
}

const LocationFinder = ({ setCurrentLoc }: LocationFinderProps) => {
  const map = useMap();
  useMapEvents({
    click(e) {
      setCurrentLoc(e.latlng);
    },
    drag() {
      setCurrentLoc(map.getCenter());
    }
  });
  return null;
};

interface MapPresenterProps extends ReportDataProps {}

function MapPresenter({ reportState }: MapPresenterProps) {
  const loc = reportState.currentReport?.location ?? new L.LatLng(49.2767096, -122.91780296438841);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [, setCurrentLoc] = useState(loc);
  
  return (
    <>
      <MapContainer 
        style={{ width: '100%', height: '100%', borderRadius: '10px' }} 
        center={loc} 
        zoom={13}
      >
        <TileLayer 
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" 
          crossOrigin={true}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        />
        <MapContainerRecenterer reportState={reportState} />
        <LocationFinder setCurrentLoc={setCurrentLoc} />
        {reportState.reports.map((r, index) =>
          <MapMarker 
            key={index} 
            onClick={() => setIsShowPopup(true)}
            reportState={reportState} 
            report={r} 
            index={index} 
          />
        )}
      </MapContainer>
      <Dialog open={isShowPopup} onOpenChange={setIsShowPopup}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Report Details</DialogTitle>
          </DialogHeader>
          {reportState.currentReport && (
          <ViewReport 
            report={reportState.currentReport} 
            reportState={reportState} 
            closeFunc={() => setIsShowPopup(false)} 
          />
      )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MapPresenter;
