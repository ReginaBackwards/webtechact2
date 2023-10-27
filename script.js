mapboxgl.accessToken = 'pk.eyJ1IjoicmVnaW5hYmFja3dhcmRzIiwiYSI6ImNsbnN4Y3JqcDFoM2YybW8ycTd2ZGJqZjQifQ.uKv4TTT2HDybR6e_l8UDdg';
const philippinesBounds = {
    latMin: 4.5,
    latMax: 21.5,
    lonMin: 115.0,
    lonMax: 128.0,
};

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [121, 13],
    zoom: 7,
    maxBounds: [
        [philippinesBounds.lonMin, philippinesBounds.latMin],
        [philippinesBounds.lonMax, philippinesBounds.latMax]
    ],
});

let currentMarkers = [];
let airports = [];

// Function to create an airport button
function createAirportButton(airport) {
    const airportList = document.getElementById('airportData');

    const airportButton = document.createElement('button');
    airportButton.textContent = `${airport.name} - ${airport.iata}`;
    airportButton.addEventListener('click', () => {
        // When an airport button is clicked, zoom in on the airport's location
        map.flyTo({
            center: [airport.lon, airport.lat],
            zoom: 14,
        });
    });

    airportList.appendChild(airportButton);
}

// Function to add a marker for an airport
function addAirportMarker(airport) {
    const marker = new mapboxgl.Marker()
        .setLngLat([airport.lon, airport.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${airport.name}</h3><p>IATA: ${airport.iata}</p><p>Latitude: ${airport.lat}</p><p>Longitude: ${airport.lon}</p>`))
        .addTo(map);

    return marker;
}

// Function to create markers for all airports
function createMarkersForAllAirports() {
    airports.forEach(airport => {
        const marker = addAirportMarker(airport);
        currentMarkers.push(marker);
    });
}

// Function to handle search input changes
function handleSearchInputChange() {
    const searchInput = document.getElementById('airportSearch');
    const searchQuery = searchInput.value.toLowerCase();

    // Filter airports based on the search query
    const filteredAirports = airports.filter(airport => airport.name.toLowerCase().includes(searchQuery));

    // Clear existing markers and airport buttons
    clearMarkers();
    clearAirportButtons();

    // Create markers for filtered airports and buttons for the list
    createMarkersForFilteredAirports(filteredAirports);
    createButtonsForFilteredAirports(filteredAirports);
}

// Function to clear all markers
function clearMarkers() {
    currentMarkers.forEach(marker => marker.remove());
    currentMarkers = [];
}

// Function to create markers for filtered airports
function createMarkersForFilteredAirports(filteredAirports) {
    filteredAirports.forEach(airport => {
        const marker = addAirportMarker(airport);
        currentMarkers.push(marker);
    });
}

// Function to clear all airport buttons
function clearAirportButtons() {
    const airportList = document.getElementById('airportData');
    while (airportList.firstChild) {
        airportList.removeChild(airportList.firstChild);
    }
}

// Function to create buttons for filtered airports
function createButtonsForFilteredAirports(filteredAirports) {
    const airportList = document.getElementById('airportData');
    filteredAirports.forEach(airport => {
        createAirportButton(airport);
    });
}

// Fetch airport data and create buttons and markers
function fetchAirportData() {
    fetch('https://flight-radar1.p.rapidapi.com/airports/list', {
        headers: {
            'X-RapidAPI-Key': '14c76f3f8amshb8be56169523917p1abdd1jsnca20b0fdcb62', // Your API key
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.rows) {
                airports = data.rows.filter(
                    airport => airport.lat && airport.lon && airport.country === 'Philippines'
                );

                // Create buttons and markers for all airports
                createButtonsForFilteredAirports(airports);
                createMarkersForAllAirports();
            } else {
                console.error('API response does not contain airport data:', data);
            }
        })
        .catch(error => console.error(error));
}

// Add event listener to search input
const searchInput = document.getElementById('airportSearch');
searchInput.addEventListener('input', handleSearchInputChange);

fetchAirportData();

// ... (previous code)

// Update the findNearestAirportAndDrawLine function
function findNearestAirportAndDrawLine(coordinates) {
  const nearestAirport = findNearestAirport(coordinates);

  if (!nearestAirport) {
      console.error('No airports found');
      return;
  }

  clearAirportButtons();

  // Draw a line to the nearest airport and show its distance
  drawLineToAirport(coordinates, nearestAirport);
  showDistanceToAirport(coordinates, nearestAirport);

  // Create a button for the nearest airport
  createAirportButton(nearestAirport);
}


// Function to calculate the distance between two sets of coordinates
function calculateDistance(coord1, coord2) {
  const lat1 = coord1[1];
  const lon1 = coord1[0];
  const lat2 = coord2[1];
  const lon2 = coord2[0];
  
  const R = 6371; // Radius of the Earth in kilometers
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

// Function to find the nearest airports
function findNearestAirport(coordinates) {
  const sortedAirports = airports.slice(); // Copy the airports array
  sortedAirports.sort((a, b) => {
      const distanceA = calculateDistance(coordinates, [a.lon, a.lat]);
      const distanceB = calculateDistance(coordinates, [b.lon, b.lat]);
      return distanceA - distanceB;
  });

  return sortedAirports[0];
}


// Function to draw a line to an airport
function drawLineToAirport(fromCoordinates, airport) {
  const lineId = `lineToAirport${airport.iata}`; // Use a unique identifier based on the airport IATA code
  
  // Check if the source exists and remove it
  if (map.getSource(lineId)) {
    map.removeSource(lineId);
  }

  // Check if the layer exists and remove it
  if (map.getLayer(lineId)) {
    map.removeLayer(lineId);
  }

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

// Function to show the distance to an airport
function showDistanceToAirport(fromCoordinates, airport) {
  const distance = calculateDistance(fromCoordinates, [airport.lon, airport.lat]);
  const formattedDistance = distance.toFixed(2) + ' km';

  const nearestAirportInfo = document.getElementById('nearestAirportInfo');

  // Create a new paragraph element for the nearest airport
  const infoElement = document.createElement('div');
  // infoElement.textContent = `${airport.name} - Distance: ${formattedDistance}`;

  infoElement.innerHTML = `<h2>${airport.name} - ${airport.iata}</h2>
    <h3>Distance: ${formattedDistance}</h3>
    <p>City: ${airport.city}</p>
    <p>Latitude: ${airport.lat}</p>
    <p>Longitude: ${airport.lon}</p>
    <p>Country: ${airport.country}</p>
    <p>Altitude: ${airport.alt} meters</p>
    <p>Timezone: ${airport.timezone.name} (${airport.timezone.abbr})</p>`;

  nearestAirportInfo.appendChild(infoElement);
}

let redMarker = null;
let previousNearestAirport = null;
let lineId = null;

// Function to remove the line
function removeLine() {
  if (lineId && map.getLayer(lineId)) {
    map.removeLayer(lineId);
  }
  if (lineId && map.getSource(lineId)) {
    map.removeSource(lineId);
  }
}

// Function to clear the nearest airport information
function clearNearestAirportInfo() {
  const nearestAirportInfo = document.getElementById('nearestAirportInfo');
  while (nearestAirportInfo.firstChild) {
      nearestAirportInfo.removeChild(nearestAirportInfo.firstChild);
  }
}

map.on('click', (e) => {
  const coordinates = e.lngLat.toArray();

  // Clear previous nearest airport info and red marker
  clearNearestAirportInfo();
  if (redMarker) {
    redMarker.remove();
  }

  // Remove the previous line
  removeLine();

  // Add a red marker at the clicked location
  redMarker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .addTo(map);

  // Create a unique line ID based on the current timestamp
  lineId = `lineToAirport${Date.now()}`;

  findNearestAirportAndDrawLine(coordinates);
});

// Function to draw a line to an airport
function drawLineToAirport(fromCoordinates, airport) {
  // Check if the source and layer with the same ID exist and remove them
  if (map.getSource(lineId)) {
    map.removeSource(lineId);
  }
  if (map.getLayer(lineId)) {
    map.removeLayer(lineId);
  }

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

// Function to reset the map
function resetMap() {
  // Reload the page
  location.reload();
}

const resetButton = document.getElementById('resetMap');
resetButton.addEventListener('click', resetMap);

