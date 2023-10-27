// Replace with your Mapbox Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoicmVnaW5hYmFja3dhcmRzIiwiYSI6ImNsbnN4Y3JqcDFoM2YybW8ycTd2ZGJqZjQifQ.uKv4TTT2HDybR6e_l8UDdg';

// Define the boundaries for the Philippines
const philippinesBounds = {
    latMin: 4.5, // Adjust as needed (lower latitude)
    latMax: 21.5, // Adjust as needed (higher latitude)
    lonMin: 115.0, // Adjust as needed
    lonMax: 128.0, // Adjust as needed
};

// Create a map with the adjusted view
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // Mapbox style URL
    center: [121, 13], // Center the map on the Philippines (longitude, latitude)
    zoom: 7, // Set the initial zoom level for the Philippines
    maxBounds: [
        [philippinesBounds.lonMin, philippinesBounds.latMin],
        [philippinesBounds.lonMax, philippinesBounds.latMax]
    ],
});

// Function to fetch airport data and display markers on the map
function fetchAirportData() {
    fetch('https://flight-radar1.p.rapidapi.com/airports/list', {
        headers: {
            'X-RapidAPI-Key': '14c76f3f8amshb8be56169523917p1abdd1jsnca20b0fdcb62',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.rows) {
                const airportList = document.getElementById('airportData');

                data.rows.forEach(row => {
                    const airport = row;
                    if (airport.lat && airport.lon && airport.country === 'Philippines') {
                        // Create a list item for each airport in the Philippines
                        const listItem = document.createElement('li');
                        listItem.textContent = `${airport.name} - ${airport.iata}`;
                        listItem.addEventListener('click', () => {
                            // When a list item representing an airport is clicked, display a marker on the map
                            new mapboxgl.Marker()
                                .setLngLat([airport.lon, airport.lat])
                                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${airport.name}</h3><p>${airport.iata}</p>`))
                                .addTo(map);
                        });
                        airportList.appendChild(listItem);
                    }
                });

                // Add markers to the map for Philippine airports
                data.rows.forEach(row => {
                    const airport = row;
                    if (airport.lat && airport.lon && airport.country === 'Philippines') {
                        new mapboxgl.Marker()
                            .setLngLat([airport.lon, airport.lat])
                            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${airport.name}</h3><p>${airport.iata}</p>`))
                            .addTo(map);
                    }
                });
            } else {
                console.error('API response does not contain airport data:', data);
            }
        })
        .catch(error => console.error(error));
}

// Call the fetchAirportData function to load and display markers for Philippine airports
fetchAirportData();
