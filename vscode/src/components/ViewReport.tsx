import { useEffect, useState } from 'react';
import { ReportData, ReportsState, ReportStatus } from '../types';
import { latLngToString, getHMS } from '../utils';
import { isCorrectPassword } from '../password';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ViewReportProps = {
  closeFunc: () => void;
  report: ReportData;
  reportState: ReportsState;
}

function ViewReport({ closeFunc, report, reportState }: ViewReportProps) {
  const [locationStr, setLocationStr] = useState<string>('');
  const [showImage, setShowImage] = useState(!!report.image);
  const [status, setStatus] = useState(report.status);

  useEffect(() => {
    if (report.location == null) {
      setLocationStr('-');
    } else {
      latLngToString(report.location)
        .then((str) => setLocationStr(str))
        .catch(() => {
          setLocationStr(`${report.location!.lat}, ${report.location!.lng}`);
        });
    }
  }, [report.location]);

  const handleStatusChange = () => {
    const enteredPwd = prompt('Enter the password:');
    if (enteredPwd == null) return;

    if (isCorrectPassword(enteredPwd)) {
      const newStatus = status === ReportStatus.OPEN ? ReportStatus.RESOLVED : ReportStatus.OPEN;
      setStatus(newStatus);
      report.status = newStatus;
      localStorage.setItem('reports', JSON.stringify(reportState.reports));
    } else {
      alert('Incorrect password!');
    }
  };

  return (
    <div className='space-y-4'>
        {report.image && showImage && (
          <div className='flex justify-center'>
          <img 
            src={report.image} 
            alt='Report Image'
              className='max-w-full max-h-64 rounded-lg object-cover border border-border'
            onError={() => setShowImage(false)}
          />
          </div>
        )}

        <div className='space-y-4'>
          <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
            <span className='text-sm font-medium text-muted-foreground'>Type</span>
            <span className='font-medium'>{report.type}</span>
          </div>

          <div className='grid grid-cols-[120px_1fr] gap-4 items-start'>
            <span className='text-sm font-medium text-muted-foreground'>Location</span>
            <span className='text-sm break-words'>{locationStr || 'Loading...'}</span>
          </div>

          <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
            <span className='text-sm font-medium text-muted-foreground'>Reporter</span>
            <span className='text-sm'>{report.reporterName}</span>
          </div>

          <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
            <span className='text-sm font-medium text-muted-foreground'>Phone</span>
            <span className='text-sm font-mono'>{report.reporterPhone}</span>
          </div>

          <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
            <span className='text-sm font-medium text-muted-foreground'>Time</span>
            <span className='text-sm'>{new Date(report.time).toLocaleDateString()} ({getHMS(new Date(report.time))})</span>
          </div>

          <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
            <span className='text-sm font-medium text-muted-foreground'>Status</span>
            <div className='flex items-center gap-2'>
              <Badge 
                variant={status === ReportStatus.OPEN ? 'default' : 'secondary'}
                className={status === ReportStatus.OPEN 
                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30" 
                  : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
                }
              >
                {status}
              </Badge>
              <Button variant='outline' size='sm' onClick={handleStatusChange}>
                Change
              </Button>
            </div>
          </div>

          {report.comment && (
            <div className='grid grid-cols-[120px_1fr] gap-4 items-start'>
              <span className='text-sm font-medium text-muted-foreground'>Comments</span>
              <p className='text-sm text-muted-foreground break-words'>{report.comment}</p>
            </div>
          )}
        </div>

        <Button onClick={closeFunc} className='w-full mt-4'>
          Close
        </Button>
    </div>
  );
}

export default ViewReport;
