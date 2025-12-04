import { useState } from 'react';
import { ReportDataProps } from '../types';
import { isReportsEqual } from '../utils';
import AddReport from './AddReport';
import ReportItem from './ReportItem';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, ArrowUpDown } from 'lucide-react';

interface ReportListProps extends ReportDataProps {}

function ReportList({ reportState }: ReportListProps) {
  const [hasAddReportPopup, setHasAddReportPopup] = useState(false);
  const [sortUp, setSortUp] = useState(false);

  const sortTableBy = (sortType: string) => {
    reportState.setReportLocations(prevLocs => {
      const newLocs = [...prevLocs];

      switch (sortType.trim().toLowerCase()) {
        case 'location':
          newLocs.sort((a, b) => {
            let retVal = 0;
            const valMult = sortUp ? 1 : -1;

            const aLocName = localStorage.getItem(`location=${a.location?.lat}, ${a.location?.lng}`);
            const bLocName = localStorage.getItem(`location=${b.location?.lat}, ${b.location?.lng}`);

            if (!aLocName || !bLocName) {
              const latComp = (2 * +(a.location!.lat < b.location!.lat ? 1 : 0) - 1);
              const lngComp = (2 * +(a.location!.lng < b.location!.lng ? 1 : 0) - 1);
              retVal = latComp == 0 ? latComp : lngComp;
            } else {
              const strComp = 2 * +(aLocName < bLocName ? 1 : 0) - 1;
              retVal = strComp;
            }

            return retVal * valMult;
          });
          setSortUp(prev => !prev);
          break;
        case 'type':
          sortUp ? newLocs.sort((a, b) => a.type < b.type ? -1 : (a.type == b.type ? 0 : 1)) :
            newLocs.sort((a, b) => a.type < b.type ? 1 : (a.type == b.type ? 0 : -1));
          setSortUp(prev => !prev);
          break;
        case 'time':
          sortUp ? newLocs.sort((a, b) => a.time < b.time ? -1 : (a.time == b.time ? 0 : 1)) :
            newLocs.sort((a, b) => a.time < b.time ? 1 : (a.time == b.time ? 0 : -1))
          setSortUp(prev => !prev);
          break;
        case 'status':
          sortUp ? newLocs.sort((a, b) => a.status < b.status ? -1 : (a.status == b.status ? 0 : 1)) :
            newLocs.sort((a, b) => a.status < b.status ? 1 : (a.status == b.status ? 0 : -1));
          setSortUp(prev => !prev);
          break;
        default:
          return prevLocs;
      }

      return newLocs;
    });
  };

  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: string }) => (
    <TableHead 
      onClick={() => sortTableBy(sortKey)} 
      className="cursor-pointer hover:bg-accent/50 transition-colors select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
      </div>
    </TableHead>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <SortableHeader label="Location" sortKey="location" />
              <SortableHeader label="Type" sortKey="type" />
              <SortableHeader label="Time" sortKey="time" />
              <SortableHeader label="Status" sortKey="status" />
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportState.reportLocations.map((report, index) => (
              <ReportItem 
                reportState={reportState} 
                key={index} 
                report={report} 
                id={index} 
              />
            ))}
          </TableBody>
        </Table>
        
        {reportState.reportLocations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No reports in view</p>
            <p className="text-sm">Pan the map to see reports</p>
          </div>
        )}
      </div>

      <Dialog open={hasAddReportPopup} onOpenChange={setHasAddReportPopup}>
        <DialogTrigger asChild>
          <Button className="mt-4 w-full gap-2" variant="default" size="lg">
            <Plus className="h-4 w-4" />
            Add Report
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Report</DialogTitle>
          </DialogHeader>
          <AddReport closeFunc={(report) => {
            setHasAddReportPopup(false);
            reportState.setReports((reports) => {
              const newReports = [...reports];
              newReports.push(report);
              localStorage.setItem('reports', JSON.stringify(newReports));
              return newReports;
            });
            reportState.setOneTimeReport(() => report);
            reportState.setReportLocations(oldLocs => {
              const el = reportState.reportLocations.find(v => isReportsEqual(v, report));
              if (!el) {
                const newLocs = [...oldLocs];
                newLocs.push(report);
                return newLocs;
              }
              return oldLocs;
            });
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ReportList;
