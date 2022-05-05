const getIpAddress = document.querySelector('.insert--ip');
const btnSearchIpAddress = document.querySelector('.btn-search--ip');

// Create map object
const map = L.map('map').setView([51.505, -0.09], 13);

let ipAddressEl = document.querySelector('#ip--data');
let locationEl = document.querySelector('#address--data');
let timezoneEl = document.querySelector('#timezone--data');
let ispEl = document.querySelector('#isp--data');

// Show user Ip Address

const showUserIpAddress = function () {
  function json(url) {
    return fetch(url).then((res) => res.json());
  }

  let apiKey = '6472cd66d049021532dfec081722577bcd58011f669eff2536be1cc4';
  json(`https://api.ipdata.co?api-key=${apiKey}`).then((data) => {
    ipAddressEl.textContent = data.ip;
    locationEl.textContent = data.city;
    timezoneEl.textContent = data.time_zone.name;
    ispEl.textContent = data.asn.name;
  });
};
document.onload = showUserIpAddress();

btnSearchIpAddress.addEventListener('click', function () {
  let lat;
  let lng;

  // Get inserted IP Address
  const ipAddress = getIpAddress.value;

  if (!ipAddress) return;

  fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=fbb3c795f85e45eda9e5e6715c9c035a&ip=${ipAddress}`
  )
    .then((res) => {
      if (!res.ok) throw new Error('Something went wrong, try again!');
      return res.json();
    })
    .then((data) => {
      lat = data.latitude;
      lng = data.longitude;
      ipAddressEl.textContent = data.ip;
      locationEl.textContent = data.country_capital;
      timezoneEl.textContent = data.time_zone.name;
      ispEl.textContent = data.isp;

      createMap(lat, lng);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

const createMap = function (lat, lng) {
  // Go to the specified latitude and longitude
  map.flyTo([lat, lng]);

  // Generate map
  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution: `Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,
        Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`,
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        'pk.eyJ1Ijoia2Fpb2huciIsImEiOiJjbDJycnUzNWEwbGVsM2RxaWdmcHFhazZwIn0.AOg9nsCmAJqikqQaU83Akw',
    }
  ).addTo(map);

  // Create marker and change icon
  const markerIcon = L.icon({ iconUrl: 'images/icon-location.svg' });
  const marker = L.marker([lat, lng], { icon: markerIcon, opacity: 1.0 }).addTo(map);
};
