import { useEffect, useState } from 'react';
import { ReportData, ReportsState, ReportStatus } from '../types';
import { latLngToString, getHMS } from '../utils';
import { isCorrectPassword } from '../password';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className='w-full max-w-md border-none bg-transparent shadow-none'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-2xl text-center'>Report Details</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {report.image && showImage && (
          <img 
            src={report.image} 
            alt='Report Image'
            className='max-w-60 max-h-60 mx-auto rounded-xl object-cover'
            onError={() => setShowImage(false)}
          />
        )}

        <div className='space-y-3'>
          <div className='flex justify-between items-center'>
            <span className='font-semibold text-muted-foreground'>Type</span>
            <span>{report.type}</span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='font-semibold text-muted-foreground'>Location</span>
            <span className='text-right max-w-[60%]'>{locationStr || 'Loading...'}</span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='font-semibold text-muted-foreground'>Reporter</span>
            <span>{report.reporterName}</span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='font-semibold text-muted-foreground'>Phone</span>
            <span>{report.reporterPhone}</span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='font-semibold text-muted-foreground'>Time</span>
            <span>{new Date(report.time).toLocaleDateString()} ({getHMS(new Date(report.time))})</span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='font-semibold text-muted-foreground'>Status</span>
            <div className='flex items-center gap-2'>
              <Badge variant={status === ReportStatus.OPEN ? 'default' : 'secondary'}>
                {status}
              </Badge>
              <Button variant='outline' size='sm' onClick={handleStatusChange}>
                Change
              </Button>
            </div>
          </div>

          {report.comment && (
            <div className='flex justify-between items-start'>
              <span className='font-semibold text-muted-foreground'>Comments</span>
              <span className='text-right max-w-[60%]'>{report.comment}</span>
            </div>
          )}
        </div>

        <Button onClick={closeFunc} className='w-full mt-4'>
          Close
        </Button>
      </CardContent>
    </Card>
  );
}

export default ViewReport;
