import L from 'leaflet';
import { ReportData, ReportStatus } from '../types';
import { stringToLatLng } from '../utils';

type AddReportProps = {
  closeFunc: (report: ReportData) => void;
}

function AddReport({ closeFunc }: AddReportProps) {
  return (
    <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 px-[calc(1rem+2%)] rounded-xl bg-zinc-900 flex flex-col justify-center min-w-[30%] w-fit'>
      <h3 className='text-4xl font-bold text-center mb-4'>Add Report</h3>
      <form 
        id="add-report-form" 
        className='flex flex-col justify-between'
        onSubmit={() => {
          let reportComment: string | null = (document.getElementById('report-comments') as HTMLInputElement).value.trim();
          if (reportComment.length == 0) {
            reportComment = null;
          }
          const reportData: ReportData = {
            reporterName: (document.getElementById('report-witness-name') as HTMLInputElement).value,
            reporterPhone: (document.getElementById('report-witness-phone') as HTMLInputElement).value,
            type: (document.getElementById('report-emergency-type') as HTMLInputElement).value,
            location: null,
            time: Date.now(),
            status: ReportStatus.OPEN,
            comment: reportComment ?? undefined,
            image: (document.getElementById('report-url') as HTMLInputElement).value
          };

          const locString = (document.getElementById('report-location') as HTMLInputElement).value.trim();
          const isRawLatLong = /^[-]?((\d*[.]\d+)|(\d+([.]\d*)?))\s*,\s*[-]?((\d*[.]\d+)|(\d+([.]\d*)?))$/.test(locString.trim());

          const errorElement = document.getElementById('report-loc-error')!;

          if (!isRawLatLong) {
            errorElement.innerText = `Searching for location '${locString}'...`;
            errorElement.style.display = 'block';
            stringToLatLng(locString)
              .then(response => {
                reportData.location = response;
                closeFunc(reportData);
              })
              .catch(() => {
                errorElement.innerText = `Location '${locString}' is invalid!`;
                errorElement.style.display = 'block';
              });
          } else {
            const nums = locString.split(',').map(s => +s.trim());
            reportData.location = new L.LatLng(nums![0], nums![1]);
            closeFunc(reportData);
          }
        }}
      >
        <div className='flex flex-col m-4'>
          <label htmlFor='report-witness-name' className='text-left text-lg mb-1'>Witness Name</label>
          <input 
            id='report-witness-name' 
            type='text' 
            name='witness-name' 
            required 
            className='bg-zinc-700 text-gray-200 p-2 text-base rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col m-4'>
          <label htmlFor='report-witness-phone' className='text-left text-lg mb-1'>Witness Phone Number</label>
          <input 
            id='report-witness-phone'
            type="tel"
            pattern="((\+?\d{1,3}-)?\d{3}-\d{3}-\d{4})|(\d{10,13})|(\+\d{11,13})|((\+\d{1,3})?[ ]*\(\d{1,3}\)[ ]+\d{3}-\d{4})"
            name='witness-phone' 
            required 
            className='bg-zinc-700 text-gray-200 p-2 text-base rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col m-4'>
          <label htmlFor='report-emergency-type' className='text-left text-lg mb-1'>Report Type</label>
          <input 
            id='report-emergency-type' 
            type='text' 
            name='emergency-type' 
            required 
            className='bg-zinc-700 text-gray-200 p-2 text-base rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col m-4'>
          <label htmlFor='report-location' className='text-left text-lg mb-1'>Location (Name or Lat, Long)</label>
          <input 
            id='report-location' 
            type='text' 
            name='location' 
            required 
            className='bg-zinc-700 text-gray-200 p-2 text-base rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col m-4'>
          <label htmlFor='report-url' className='text-left text-lg mb-1'>Image URL (optional)</label>
          <input 
            id='report-url' 
            type='text' 
            name='url' 
            className='bg-zinc-700 text-gray-200 p-2 text-base rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col m-4'>
          <label htmlFor='report-comments' className='text-left text-lg mb-1'>Comments (optional)</label>
          <input 
            id='report-comments' 
            type='text' 
            name='comments' 
            className='bg-zinc-700 text-gray-200 p-2 text-base rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <input 
          id='submit-button' 
          type='submit' 
          formMethod='dialog'
          value='Submit Report'
          className='mx-4 mt-2 px-4 py-2 rounded bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors font-medium'
        />

        <p id="report-loc-error" className='text-red-500 text-center mt-2 hidden'></p>
      </form>
    </div>
  )
}

export default AddReport;
