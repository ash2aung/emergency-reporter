import axios from 'axios';
import L from 'leaflet';
import { ReportData } from './types';

export function isReportsEqual(rep1: ReportData, rep2: ReportData) {
  return rep1.location?.lat == rep2.location?.lat && rep1.location?.lng == rep2.location?.lng;
}

export function latLngToString(location: L.LatLng) {
  const promise = new Promise<string>((successFunc, errorFunc) => {
    const cachedValue = localStorage.getItem(`location=${location.lat}, ${location.lng}`);
    if (cachedValue) {
      successFunc(cachedValue);
      return;
    }

    axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`, { timeout: 9000 })
      .then(function (response) {
        const stringName = response.data['name'];
        localStorage.setItem(`location=${location.lat}, ${location.lng}`, stringName);
        successFunc(stringName);
      })
      .catch(function (error) {
        errorFunc(error);
      });
  });

  return promise;
}

export function stringToLatLng(strLoc: string): Promise<L.LatLng> {
  const promise = new Promise<L.LatLng>((successFunc, errorFunc) => {
    const cachedValue = localStorage.getItem(`namedLocation=${strLoc}`);
    if (cachedValue) {
      const splitValue = cachedValue.split(',');
      const latLong = new L.LatLng(+splitValue[0].trim(), +splitValue[1].trim());
      successFunc(latLong);
      return;
    }

    axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${strLoc}`, { timeout: 9000 })
      .then(function (response) {
        const latLong = new L.LatLng(+response.data[0]['lat'], +response.data[0]['lon']);
        localStorage.setItem(`namedLocation=${strLoc}`, `${latLong.lat}, ${latLong.lng}`);
        successFunc(latLong);
      })
      .catch(function (error) {
        errorFunc(error);
      });
  });

  return promise;
}

export function getHMS(date: Date): string {
  const hourNum = date.getHours();
  const minuteNum = date.getMinutes();
  const secondNum = date.getSeconds();

  return `${hourNum >= 10 ? hourNum : '0' + hourNum}:${minuteNum >= 10 ? minuteNum : '0' + minuteNum}:${secondNum >= 10 ? secondNum : '0' + secondNum}`;
}
