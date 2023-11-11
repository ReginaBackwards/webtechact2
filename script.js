/*
 Author: Paul Ivan Dimacali
 Description: Mapbox Access Token
*/
mapboxgl.accessToken = 'pk.eyJ1IjoicmVnaW5hYmFja3dhcmRzIiwiYSI6ImNsbnN4bzA4aTE3cGYydGxxb3Y2Z3AwYjkifQ.u7hM4l5capbXkFulYyHQuQ';
/*
Authors: Janbert Dela Cruz, America Slay
Description: Initialization of variables/objects needed in the functions
*/
const resetButton = document.getElementById('resetMap');
resetButton.addEventListener('click', resetMap);
let currentMarkers = []; //for storing active markers on the map to aid in filtering
let airports = []; //for storing the list of airports
let airportsSchedule = []; //for storing the list of airport schedules
const searchInput = document.getElementById('airportSearch');
searchInput.addEventListener('input', handleSearchInputChange);
let redMarker = null;
let previousNearestAirport = null;
let lineId = null;
fetchAirportData(); //fetches the information of the airports information from the API
fetchAirportSchedule();

/*
 Authors: Janbert Dela Cruz, America Slay, Paul Ivan Dimacali
 Description: Limits the bounds of the mapbox view to the Philippines
*/
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [121, 13],
  zoom: 7,
  maxBounds: [
    [115.0, 4.5], //minimum longitude and latitude cooridinates for the PH
    [128.0, 21.5] //maximum longitude and latitue coordinates for the PH
  ],
});

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: Creates a button and its on-click listener for an airport coming from the API
*/
function createAirportButton(airport) {
  const airportList = document.getElementById('airportData');
  const airportButton = document.createElement('button');
  airportButton.innerHTML = `${airport.name}<br>${airport.iata}`;
  // to zoom in on the location of an airport when clicked
  airportButton.addEventListener('click', () => {
    map.flyTo({
      center: [airport.lon, airport.lat],
      zoom: 14,
    });
  });
  airportList.appendChild(airportButton);
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: Adds a blue marker to an airport on the map using its coordinates
*/
function addAirportMarker(airport) {
  const marker = new mapboxgl.Marker()
    .setLngLat([airport.lon, airport.lat])
    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${airport.name}</h3><p>IATA: ${airport.iata}</p><p>Latitude: ${airport.lat}</p><p>Longitude: ${airport.lon}</p>`))
    .addTo(map);
  return marker;
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: calls the addAirportMarker function repeatedly to create a blue marker for all airports on the map
*/
function createMarkersForAllAirports() {
  airports.forEach(airport => {
    const marker = addAirportMarker(airport);
    currentMarkers.push(marker);
  });
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: filters the list of airports when the user types in the search bar
*/
function handleSearchInputChange() {
  const searchInput = document.getElementById('airportSearch');
  const searchQuery = searchInput.value.toLowerCase();
  const filteredAirports = airports.filter(airport => airport.name.toLowerCase().includes(searchQuery));
  // Clear existing markers and airport buttons
  clearMarkers();
  clearAirportButtons();
  // Show only the mmarkers for filtered airports and buttons for the list
  createMarkersForFilteredAirports(filteredAirports);
  createButtonsForFilteredAirports(filteredAirports);
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: clears the list of current markers present on the map
*/
function clearMarkers() {
  currentMarkers.forEach(marker => marker.remove());
  currentMarkers = [];
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: clears the list of buttons for all the airports
*/
function clearAirportButtons() {
  const airportList = document.getElementById('airportData');
  while (airportList.firstChild) {
    airportList.removeChild(airportList.firstChild);
  }
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: creates a blue marker on the map of the each airport included in the filteredAirports argument
*/
function createMarkersForFilteredAirports(filteredAirports) {
  filteredAirports.forEach(airport => {
    const marker = addAirportMarker(airport);
    currentMarkers.push(marker);
  });
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: calls the createAirportButton function to create a button for each of 
 the airports included in the filteredAirports argument
*/
function createButtonsForFilteredAirports(filteredAirports) {
  const airportList = document.getElementById('airportData');
  airportList.style.width = '100%';
  filteredAirports.forEach(airport => {
    createAirportButton(airport);
    // compareIATACodes(airport.iata);
  });
}

/* Author: Paul Ivan Dimacs
Description: fetches information of Airport IATA codes from fetchAirportData method. It then passes 
these IATA codes to the fetchAirportSchedule
 */
function compareIATACodes(airportCode){
  const iataCodes = airportCode
  fetchAirportSchedule(iataCodes);
}

/* Author: Paul Ivan Dimacs
Description: Fetches the information of the airport schedules from the API. It then displays all the 
flight schedule in the . 
 */
function fetchAirportSchedule(iataCodes) {
      fetch(`https://airlabs.co/api/v9/schedules?dep_iata=${iataCodes}&api_key=b56db1ac-4773-4bff-afcf-2fb165c7459e`)
      .then(response => response.json())
      .then(data => {
        if (data.response) {
          airportsSchedule = data.response.filter (
            airport => airport.flight_number && airport.dep_time_utc && airport.arr_time_utc && airport.status
            )
          console.log('Airport schedule:', airportsSchedule);
          }
      })
  .catch(error => console.error(error));
  }

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: fetches the information of the airports from the API. It then displays all the airports
 as buttons by calling the createButtonsForFilteredAirports(argument is all airports). It then creates
 blue markers on the map for all of those airports.
*/
function fetchAirportData() {
  fetch('https://flight-radar1.p.rapidapi.com/airports/list', {
    headers: {
      'X-RapidAPI-Key': 'cd02262ebemshb05120aa5967234p159208jsn145d27310ba2',
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.rows) {
        airports = data.rows.filter(
          airport => airport.lat && airport.lon && airport.country === 'Philippines'
        );
        console.log(airports);
        createButtonsForFilteredAirports(airports);
        createMarkersForAllAirports();
      } else {
        console.error('API response does not contain airport data:', data);
      }
    })
    .catch(error => console.error(error));
}


/*
 Author: Marvin Rosanto
 Description: fetches the specific airport image to be displayed from a json file
*/
// Function to load JSON data and display airport image
function loadAirportImage(airportCode) {
  fetch('airports.json')
    .then(response => response.json())
    .then(data => {
      const airportsData = data.airports;
      const imagePath = airportsData[airportCode]?.imagePath;

      if (imagePath) {
        // Create an img element and set its src attribute
        const imgElement = document.createElement('img');
        imgElement.src = imagePath;
        imgElement.alt = airportCode;

        // Add the img element to a container div
        const imageContainer = document.getElementById('airportImage');
        imageContainer.style.display = 'block';
        imageContainer.innerHTML = '';
        imageContainer.appendChild(imgElement);
      } else {
        console.error('Image path not found for airport:', airportCode);
      }
    })
    .catch(error => console.error(error));
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: calls the different functions to find the nearest airport based on the location clicked, draws the line,
 and dispays that airports button and information
*/
function findNearestAirportAndDrawLine(coordinates) {
  const nearestAirport = findNearestAirport(coordinates);
  if (!nearestAirport) {
    console.error('No airports found');
    return;
  }
  clearAirportButtons();
  drawLineToAirport(coordinates, nearestAirport);
  showDistanceToAirport(coordinates, nearestAirport);
  createAirportButton(nearestAirport);

  loadAirportImage(nearestAirport.iata);
  compareIATACodes(nearestAirport.iata);
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: calculates the distance between to coordinates, coord1 and coord2
*/
function calculateDistance(coord1, coord2) {
  const lat1 = coord1[1];
  const lon1 = coord1[0];
  const lat2 = coord2[1];
  const lon2 = coord2[0];
  const R = 6371; // radius of earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: returns the airport that has the least distance to the coordinates argument
*/
function findNearestAirport(coordinates) {
  const sortedAirports = airports.slice();
  sortedAirports.sort((a, b) => {
    const distanceA = calculateDistance(coordinates, [a.lon, a.lat]);
    const distanceB = calculateDistance(coordinates, [b.lon, b.lat]);
    return distanceA - distanceB;
  });

  return sortedAirports[0];
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: display the distance and the information of the nearest airport
*/
function showDistanceToAirport(fromCoordinates, airport) {
  const distance = calculateDistance(fromCoordinates, [airport.lon, airport.lat]);
  const formattedDistance = distance.toFixed(2) + ' km';
  const nearestAirportInfo = document.getElementById('nearestAirportInfo');
  nearestAirportInfo.style.display = 'block';
  const infoElement = document.createElement('div');
  infoElement.innerHTML = `
    <h3>Distance: ${formattedDistance}</h3>
    <p>City: ${airport.city}</p>
    <p>Latitude: ${airport.lat}</p>
    <p>Longitude: ${airport.lon}</p>
    <p>Country: ${airport.country}</p>
    <p>Altitude: ${airport.alt} meters</p>
    <p>Timezone: ${airport.timezone.name} (${airport.timezone.abbr})</p>`;
  nearestAirportInfo.appendChild(infoElement);
}


/*
 Authors: Janbert Dela Cruz, America Slay
 Description: remove a line on the map using its lineId if it exists
*/
function removeLine() {
  if (lineId && map.getLayer(lineId)) {
    map.removeLayer(lineId);
  }
  if (lineId && map.getSource(lineId)) {
    map.removeSource(lineId);
  }
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: removes the contents of the nearestAirportInfo (called when a new location is clicked)
*/
function clearNearestAirportInfo() {
  const nearestAirportInfo = document.getElementById('nearestAirportInfo');
  while (nearestAirportInfo.firstChild) {
    nearestAirportInfo.removeChild(nearestAirportInfo.firstChild);
  }
}

/*
Authors: Janbert Dela Cruz, America Slay
Description: event handler when the user clicks on the map
- clears previous info from previous click (including line to previous nearest airport)
- adds a red marker at the clicked location
- creates a new line towards the nearest airport
*/
map.on('click', (e) => {
  const coordinates = e.lngLat.toArray();
  clearNearestAirportInfo();
  if (redMarker) {
    redMarker.remove();
  }
  removeLine();
  redMarker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .addTo(map);
  lineId = `lineToAirport${Date.now()}`;
  findNearestAirportAndDrawLine(coordinates);
});

/*
Authors: Janbert Dela Cruz, America Slay
Description: Function to draw a line between the fromCoordinates(coordinates of clicked location) to 
the coordinates of 'airport' (nearest airport)
*/
function drawLineToAirport(fromCoordinates, airport) {
  // checks if the source and layer with the same ID exist and remove them
  if (map.getSource(lineId)) {
    map.removeSource(lineId);
  }
  if (map.getLayer(lineId)) {
    map.removeLayer(lineId);
  }
  // initiates and draws the line
  const lineGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [fromCoordinates, [airport.lon, airport.lat]],
    },
  };
  map.addSource(lineId, {
    type: 'geojson',
    data: lineGeoJSON,
  });
  map.addLayer({
    id: lineId,
    type: 'line',
    source: lineId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': 'blue',
      'line-width': 3,
    },
  });
}

/*
 Authors: Janbert Dela Cruz, America Slay
 Description: function to reload the page when the 'reset' button is clicked
*/
function resetMap() {
  location.reload();
}