export const delay = (time) => {
  return new Promise((resolve, reject) => {
    if (time) {
      setTimeout(() => resolve(), time)
    } else {
      reject('time is not defined')
    }
  })
}
export const findDistance=(lat1, lon1, lat2, lon2) =>
{
  var R = 6371; // km
  var dLat = Math.radians(lat2-lat1);
  var dLon = Math.radians(lon2-lon1);
  var lat1 = Math.radians(lat1);
  var lat2 = Math.radians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}
