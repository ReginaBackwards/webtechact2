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
