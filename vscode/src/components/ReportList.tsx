import { useState } from 'react';
import { ReportDataProps } from '../types';
import { isReportsEqual } from '../utils';
import PopupPane from './PopupPane';
import AddReport from './AddReport';
import ReportItem from './ReportItem';
import addIcon from '../assets/cross.png';

interface ReportListProps extends ReportDataProps {}

function ReportList({ reportState }: ReportListProps) {
  const [hasAddReportPopup, setHasAddReportPopup] = useState(false);
  const reportElements = reportState.reportLocations.map((e, index) => (
    <ReportItem reportState={reportState} key={index} report={e} id={index} />
  ));

  const [sortUp, setSortUp] = useState(false);

  const sortTableBy = (sortType: string) => {
    const tableElem = document.getElementById('report-table') as HTMLTableElement;
    if (tableElem) {
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
      })
    }
  };

  return (
    <>
      <ul className='bg-zinc-700 rounded-xl overflow-auto flex flex-col list-none max-h-[600px] justify-start w-full h-full'>
        <li key={reportElements.length + 2} className='w-full'>
          <table id="report-table" className='sortable table w-full border-collapse'>
            <thead>
              <tr key={reportElements.length + 2} className='py-4'>
                <th 
                  onClick={() => sortTableBy("location")} 
                  className='py-4 cursor-pointer hover:bg-zinc-600 transition-colors'
                >
                  Location
                </th>
                <th 
                  onClick={() => sortTableBy("type")} 
                  className='py-4 cursor-pointer hover:bg-zinc-600 transition-colors'
                >
                  Type
                </th>
                <th 
                  onClick={() => sortTableBy("time")} 
                  className='py-4 cursor-pointer hover:bg-zinc-600 transition-colors'
                >
                  Time Reported
                </th>
                <th 
                  onClick={() => sortTableBy("status")} 
                  className='py-4 cursor-pointer hover:bg-zinc-600 transition-colors'
                >
                  Status
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reportElements}
            </tbody>
          </table>
        </li>
        <li 
          id='add-report-item' 
          key={reportElements.length + 1} 
          className='bg-zinc-600 w-full transition-colors duration-300 p-2 flex justify-between items-center hover:cursor-pointer hover:bg-zinc-500 rounded-b-xl'
          onClick={() => setHasAddReportPopup(true)}
        >
          <div className='flex-[2] text-center'>Add Report</div>
          <img src={addIcon} alt='+' className='w-8 h-8 p-1' />
        </li>
      </ul>

      {hasAddReportPopup && (
        <PopupPane>
          <AddReport closeFunc={(report) => {
            setHasAddReportPopup(false);
            reportState.setReports((reports) => {
              const newReports = [...reports];
              newReports.push(report);
              localStorage.setItem('reports', JSON.stringify(newReports));
              return newReports;
            });
            reportState.setOneTimeReport(() => {
              return report;
            });
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
        </PopupPane>
      )}
    </>
  );
}

export default ReportList;
