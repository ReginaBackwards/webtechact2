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

let currentMarker;

function createAirportButton(airport) {
    const airportList = document.getElementById('airportData');

    const airportButton = document.createElement('button');
    airportButton.textContent = `${airport.name} - ${airport.iata}`;
    airportButton.addEventListener('click', () => {
        // When an airport button is clicked, zoom in on the airport's location
        map.flyTo({
            center: [airport.lon, airport.lat],
            zoom: 12,
        });

        // Remove the previous marker
        if (currentMarker) {
            currentMarker.remove();
        }

        // Add a marker for the selected airport
        currentMarker = addAirportMarker(airport);
    });

    airportList.appendChild(airportButton);
}

function addAirportMarker(airport) {
    const marker = new mapboxgl.Marker()
        .setLngLat([airport.lon, airport.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${airport.name}</h3><p>${airport.iata}</p>`))
        .addTo(map);

    return marker;
}

function fetchAirportData() {
    fetch('https://flight-radar1.p.rapidapi.com/airports/list', {
        headers: {
            'X-RapidAPI-Key': '14c76f3f8amshb8be56169523917p1abdd1jsnca20b0fdcb62',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.rows) {
                data.rows.forEach(row => {
                    const airport = row;
                    if (airport.lat && airport.lon && airport.country === 'Philippines') {
                        createAirportButton(airport);
                        // Initially, add markers for all airports
                        addAirportMarker(airport);
                    }
                });
            } else {
                console.error('API response does not contain airport data:', data);
            }
        })
        .catch(error => console.error(error));
}

fetchAirportData();
