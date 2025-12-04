import { useState } from 'react';
import L from 'leaflet';
import { ReportData, ReportStatus } from '../types';
import { stringToLatLng } from '../utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type AddReportProps = {
  closeFunc: (report: ReportData) => void;
}

function AddReport({ closeFunc }: AddReportProps) {
  const [witnessName, setWitnessName] = useState('');
  const [witnessPhone, setWitnessPhone] = useState('');
  const [reportType, setReportType] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const reportData: ReportData = {
      reporterName: witnessName,
      reporterPhone: witnessPhone,
      type: reportType,
      location: null,
      time: Date.now(),
      status: ReportStatus.OPEN,
      comment: comments.trim() || undefined,
      image: imageUrl.trim() || undefined
    };

    const locString = location.trim();
    const isRawLatLong = /^[-]?((\d*[.]\d+)|(\d+([.]\d*)?))\s*,\s*[-]?((\d*[.]\d+)|(\d+([.]\d*)?))$/.test(locString);

    if (!isRawLatLong) {
      setError(`Searching for location '${locString}'...`);
      stringToLatLng(locString)
        .then(response => {
          reportData.location = response;
          closeFunc(reportData);
        })
        .catch(() => {
          setError(`Location '${locString}' is invalid!`);
          setIsLoading(false);
        });
    } else {
      const nums = locString.split(',').map(s => +s.trim());
      reportData.location = new L.LatLng(nums[0], nums[1]);
      closeFunc(reportData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div className='space-y-2'>
        <Label htmlFor='witness-name'>Witness Name</Label>
        <Input 
          id='witness-name' 
          type='text' 
          value={witnessName}
          onChange={(e) => setWitnessName(e.target.value)}
          placeholder="Enter witness name"
          required 
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='witness-phone'>Witness Phone Number</Label>
        <Input 
          id='witness-phone'
          type="tel"
          value={witnessPhone}
          onChange={(e) => setWitnessPhone(e.target.value)}
          placeholder="e.g., 123-456-7890"
          required 
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='emergency-type'>Report Type</Label>
        <Input 
          id='emergency-type' 
          type='text'
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          placeholder="e.g., Fire, Accident, Medical"
          required 
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='location'>Location</Label>
        <Input 
          id='location' 
          type='text'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Address or Lat, Long"
          required 
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='image-url'>Image URL (optional)</Label>
        <Input 
          id='image-url' 
          type='text'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='comments'>Comments (optional)</Label>
        <Input 
          id='comments' 
          type='text'
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Additional details..."
        />
      </div>

      {error && (
        <p className={error.includes('Searching') ? 'text-muted-foreground text-sm' : 'text-destructive text-sm'}>
          {error}
        </p>
      )}

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Report'}
      </Button>
    </form>
  );
}

export default AddReport;
