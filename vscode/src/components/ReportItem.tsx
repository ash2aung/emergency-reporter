import { useState, useEffect } from 'react';
import { ReportData, ReportDataProps, ReportStatus } from '../types';
import { latLngToString, getHMS, isReportsEqual } from '../utils';
import { isCorrectPassword } from '../password';
import PopupPane from './PopupPane';
import ViewReport from './ViewReport';
import closeIconWhite from '../assets/close-icon-white.png';

interface ReportItemProps extends ReportDataProps {
  report: ReportData,
  id: number
}

function ReportItem({ report, id, reportState }: ReportItemProps) {
  const [isShowingReportInfo, setIsShowingReportInfo] = useState(false);
  const reportElementId = `report-list-${id}`;
  const date = new Date(report.time);
  const time = `${date.toLocaleDateString()} (${getHMS(date)})`;

  useEffect(() => {
    report.location && latLngToString(report.location!)
      .then((locString) => {
        const reportElement = document.getElementById(reportElementId + '-location');
        reportElement && (reportElement.innerText = `${locString}`);
      })
      .catch(() => {
        const reportElement = document.getElementById(reportElementId + '-location');
        reportElement && (reportElement.innerText = `[${report.location?.lat}, ${report.location?.lng}]`);
      });

    if (report.status == ReportStatus.OPEN) {
      const reportStatus = document.getElementById(reportElementId + '-status');
      reportStatus!.classList.remove('text-red-500');
      reportStatus!.classList.add('text-green-500');
    } else {
      const reportStatus = document.getElementById(reportElementId + '-status');
      reportStatus!.classList.remove('text-green-500');
      reportStatus!.classList.add('text-red-500');
    }
  });

  return (
    <>
      <tr 
        key={reportElementId} 
        id={reportElementId} 
        className='bg-zinc-600 w-full transition-colors duration-300 p-2 hover:cursor-pointer hover:bg-zinc-500'
        onClick={() => {
          setIsShowingReportInfo(true);
          reportState.setCurrentReport(report);
        }}
      >
        <td id={reportElementId + '-location'} className='p-2'>
          {`[${report.location!.lat}, ${report.location!.lng}]`}
        </td>
        <td className='p-2'>{report.type}</td>
        <td className='p-2'>{time}</td>
        <td id={reportElementId + '-status'} className='p-2 font-bold'>{report.status}</td>
        <td 
          className='w-8 h-8 p-2'
          onClick={(e) => {
            e.stopPropagation();
            const enteredPwd = prompt('Enter the password:');
            if (enteredPwd == null) {
              return;
            }

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
            })
          }}
        >
          <img 
            src={closeIconWhite} 
            alt='X' 
            className='w-full h-full z-10 hover:opacity-80 transition-opacity' 
          />
        </td>
      </tr>
      {isShowingReportInfo &&
        <PopupPane>
          <ViewReport 
            report={report} 
            reportState={reportState} 
            closeFunc={() => {
              setIsShowingReportInfo(false);
            }} 
          />
        </PopupPane>
      }
    </>
  );
}

export default ReportItem;
