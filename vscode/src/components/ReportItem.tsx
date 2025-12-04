import { useState, useEffect } from 'react';
import { ReportData, ReportDataProps, ReportStatus } from '../types';
import { latLngToString, getHMS, isReportsEqual } from '../utils';
import { isCorrectPassword } from '../password';
import ViewReport from './ViewReport';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ReportItemProps extends ReportDataProps {
  report: ReportData,
  id: number
}

function ReportItem({ report, id, reportState }: ReportItemProps) {
  const [isShowingReportInfo, setIsShowingReportInfo] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);
  const date = new Date(report.time);
  const time = `${date.toLocaleDateString()} (${getHMS(date)})`;

  useEffect(() => {
    if (report.location) {
      latLngToString(report.location)
        .then(setLocationName)
        .catch(() => setLocationName(null));
    }
  }, [report.location]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const enteredPwd = prompt('Enter the password:');
    if (enteredPwd == null) return;

    if (!isCorrectPassword(enteredPwd)) {
      alert('Incorrect password!');
      return;
    }

    reportState.setReports(reps => {
      const newReps = [...reps];
      newReps.splice(id, 1);
      localStorage.setItem('reports', JSON.stringify(newReps));
      return newReps;
    });
    reportState.setReportLocations(oldLocs => {
      const oldEl = oldLocs.find(v => isReportsEqual(v, report));
      const newLocs = [...oldLocs];
      if (oldEl) {
        newLocs.splice(newLocs.indexOf(oldEl), 1);
      }
      return newLocs;
    });
  };

  return (
    <>
      <TableRow 
        className='cursor-pointer hover:bg-accent/50 transition-colors border-border'
        onClick={() => {
          setIsShowingReportInfo(true);
          reportState.setCurrentReport(report);
        }}
      >
        <TableCell className='font-medium text-sm'>
          {locationName || `${report.location!.lat.toFixed(4)}, ${report.location!.lng.toFixed(4)}`}
        </TableCell>
        <TableCell className='text-sm text-muted-foreground'>{report.type}</TableCell>
        <TableCell className='text-sm text-muted-foreground'>{time}</TableCell>
        <TableCell>
          <Badge 
            variant={report.status === ReportStatus.OPEN ? "default" : "secondary"}
            className={report.status === ReportStatus.OPEN 
              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" 
              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            }
          >
            {report.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <Dialog open={isShowingReportInfo} onOpenChange={setIsShowingReportInfo}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Report Details</DialogTitle>
          </DialogHeader>
          <ViewReport 
            report={report} 
            reportState={reportState} 
            closeFunc={() => setIsShowingReportInfo(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReportItem;
