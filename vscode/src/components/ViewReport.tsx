import { useEffect } from 'react';
import { ReportData, ReportsState, ReportStatus } from '../types';
import { latLngToString, getHMS } from '../utils';
import { isCorrectPassword } from '../password';

type ViewReportProps = {
  closeFunc: () => void;
  report: ReportData;
  reportState: ReportsState;
}

function ViewReport({ closeFunc, report, reportState }: ViewReportProps) {
  useEffect(() => {
    if (report.location == null) {
      const locationElement = document.getElementById('view-report-location');
      locationElement!.innerText = '-';
    } else {
      latLngToString(report.location!)
        .then((str) => {
          const locationElement = document.getElementById('view-report-location');
          locationElement!.innerText = str;
        })
        .catch(() => {
          const locationElement = document.getElementById('view-report-location');
          console.log(`lng and lat: ${report.location!.lat}, ${report.location!.lng}`)
          locationElement!.innerText = `${report.location!.lat}, ${report.location!.lng}`;
        });
    }

    if (report.image == null) {
      const viewForm = document.getElementById('view-report-form');
      viewForm!.style.marginTop = '10em';
      const viewImg = document.getElementById('view-report-img');
      viewImg!.style.display = 'none';
    }

    if (report.status == ReportStatus.OPEN) {
      const viewStatus = document.getElementById('view-report-status-text');
      viewStatus!.classList.remove('text-red-500');
      viewStatus!.classList.add('text-green-500');
    } else {
      const viewStatus = document.getElementById('view-report-status-text');
      viewStatus!.classList.remove('text-green-500');
      viewStatus!.classList.add('text-red-500');
    }
  });

  return (
    <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 px-[calc(1rem+2%)] rounded-xl bg-zinc-900 flex flex-col justify-center min-w-[30%]'>
      <h3 className='text-4xl font-bold text-center mb-4'>Report</h3>
      <img 
        id='view-report-img' 
        src={report.image} 
        alt='Report Image'
        className='max-w-60 max-h-60 self-center rounded-2xl my-6'
        onLoad={(e) => {
          const viewForm = document.getElementById('view-report-form');
          viewForm!.style.marginTop = '0';
          const target: HTMLElement = e.currentTarget as HTMLElement;
          target.style.display = 'flex'
        }}
        onError={(e) => {
          const viewForm = document.getElementById('view-report-form');
          viewForm!.style.marginTop = '10em';
          const target: HTMLElement = e.currentTarget as HTMLElement;
          target.style.display = 'none'
        }} 
      />
      <form id="view-report-form" onSubmit={closeFunc} className='flex flex-col' style={{ marginTop: '10em' }}>
        <table id="view-report-middle">
          <tbody>
            <tr>
              <td className="font-bold text-left text-lg mr-1">Type: </td>
              <td id='view-report-type' className='text-gray-400'>{report.type}</td>
            </tr>
            <tr>
              <td className="font-bold text-left text-lg mr-1">Location: </td>
              <td id='view-report-location' className='text-gray-400'>{`${report.location!.lat}, ${report.location?.lng}`}</td>
            </tr>
            <tr>
              <td className="font-bold text-left text-lg mr-1">Reporter: </td>
              <td id='view-report-reporter' className='text-gray-400'>{report.reporterName} ({report.reporterPhone})</td>
            </tr>
            <tr>
              <td className="font-bold text-left text-lg mr-1">Time: </td>
              <td id='view-report-time' className='text-gray-400'>{`${new Date(report.time).toLocaleDateString()} (${getHMS(new Date(report.time))})`}</td>
            </tr>
            <tr>
              <td className="font-bold text-left text-lg mr-1">Status: </td>
              <td id='view-report-status'>
                <span id='view-report-status-text'>{report.status}</span>
                <input 
                  type="button" 
                  id='report-status-change' 
                  className='ml-1 px-2 py-1 text-sm rounded bg-gray-200 text-zinc-800 cursor-pointer hover:brightness-90 transition-all'
                  onClick={() => {
                    const enteredPwd = prompt('Enter the password:');
                    if (enteredPwd == null) {
                      return;
                    }

                    if (isCorrectPassword(enteredPwd)) {
                      const statusElement = document.getElementById('view-report-status-text')!;

                      if (report.status == ReportStatus.OPEN) {
                        report.status = ReportStatus.RESOLVED;
                        statusElement.textContent = 'Resolved';
                        statusElement!.classList.remove('text-green-500');
                        statusElement!.classList.add('text-red-500');
                      } else {
                        report.status = ReportStatus.OPEN
                        statusElement.textContent = 'Open';
                        statusElement!.classList.remove('text-red-500');
                        statusElement!.classList.add('text-green-500');
                      }

                      localStorage.setItem('reports', JSON.stringify(reportState.reports));
                    } else {
                      alert('Incorrect password!');
                    }
                  }} 
                  value='Change' 
                />
              </td>
            </tr>
            <tr>
              <td className="font-bold text-left text-lg mr-1">Comments: </td>
              <td id='view-report-comments' className='text-gray-400'>{report.comment}</td>
            </tr>
          </tbody>
        </table>

        <input 
          id='view-report-close-button' 
          type='submit' 
          value="Close" 
          formEncType='dialog'
          className='mt-4 px-4 py-2 rounded bg-zinc-700 text-gray-200 cursor-pointer hover:bg-zinc-600 transition-colors'
        />
      </form>
    </div>
  )
}

export default ViewReport;
