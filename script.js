mapboxgl.accessToken = 'pk.eyJ1IjoicmVnaW5hYmFja3dhcmRzIiwiYSI6ImNsbnN4Y3JqcDFoM2YybW8ycTd2ZGJqZjQifQ.uKv4TTT2HDybR6e_l8UDdg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});

const draw = new MapboxDraw({
  // Instead of showing all the draw tools, show only the line string and delete tools.
  displayControlsDefault: false,
  controls: {
    line_string: true,
    trash: true
  },
  // Set the draw mode to draw LineStrings by default.
  defaultMode: 'draw_line_string',
  styles: [
    // Set the line style for the user-input coordinates.
    {
      id: 'gl-draw-line',
      type: 'line',
      filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#438EE4',
        'line-dasharray': [0.2, 2],
        'line-width': 4,
        'line-opacity': 0.7
      }
    },
    // Style the vertex point halos.
    {
      id: 'gl-draw-polygon-and-line-vertex-halo-active',
      type: 'circle',
      filter: [
        'all',
        ['==', 'meta', 'vertex'],
        ['==', '$type', 'Point'],
        ['!=', 'mode', 'static']
      ],
      paint: {
        'circle-radius': 12,
        'circle-color': '#FFF'
      }
    },
    // Style the vertex points.
    {
      id: 'gl-draw-polygon-and-line-vertex-active',
      type: 'circle',
      filter: [
        'all',
        ['==', 'meta', 'vertex'],
        ['==', '$type', 'Point'],
        ['!=', 'mode', 'static']
      ],
      paint: {
        'circle-radius': 8,
        'circle-color': '#438EE4'
      }
    }
  ]
});

function removeRoute() {
  if (!map.getSource('route')) return;
  map.removeLayer('route');
  map.removeSource('route');
}

map.on('draw.delete', removeRoute);
map.addControl(new mapboxgl.NavigationControl());
map.addControl(draw);

var button = document.getElementById('search'); // Define the button element

button.addEventListener('click', getAirports);

async function GET() {
  try {
    const response = await fetch('https://flight-radar1.p.rapidapi.com/airports/list?rapidapi-key=14c76f3f8amshb8be56169523917p1abdd1jsnca20b0fdcb62');
    const airportData = await response.json();
    console.log(airportData);
    return airportData;
  } catch (error) {
    console.error('Error fetching airport data:', error);
    return null;
  }
}

async function getAirports() {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;

  // Fetch airport data
  const airportData = await GET();

  if (!airportData) {
    return;
  }

  // Convert airport data to an array if it's not already
  const airportArray = Array.isArray(airportData) ? airportData : Object.values(airportData);

  // Filter airports based on the "From" and "To" locations
  const filteredAirports = airportArray.filter(airport => {
    return (
      (airport.city === from || airport.country === from || airport.name === from) ||
      (airport.city === to || airport.country === to || airport.name === to)
    );
  });

  // Display filtered airports
  console.log('Filtered Airports:', filteredAirports);

  // Calculate the route and display it on the map
  const coordinates = draw.getAll().features[0].geometry.coordinates;
  if (coordinates.length >= 2) {
    const routeGeoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    };

    if (map.getSource('route')) {
      map.getSource('route').setData(routeGeoJSON);
    } else {
      map.addSource('route', { type: 'geojson', data: routeGeoJSON });
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#438EE4',
          'line-width': 4
        }
      });
    }
  } else {
    console.error('Please draw a valid route on the map.');
  }
}
