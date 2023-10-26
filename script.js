mapboxgl.accessToken = 'pk.eyJ1IjoicmVnaW5hYmFja3dhcmRzIiwiYSI6ImNsbnN4Y3JqcDFoM2YybW8ycTd2ZGJqZjQifQ.uKv4TTT2HDybR6e_l8UDdg';

var api = 'https://flight-radar1.p.rapidapi.com/airports/list';
var city = '';
var apiKey = '?rapidapi-key=14c76f3f8amshb8be56169523917p1abdd1jsnca20b0fdcb62';
var button = document.querySelector('#search');

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



button.addEventListener('click', place);

async function GET() {
  let x = await fetch('https://flight-radar1.p.rapidapi.com/airports/list?rapidapi-key=14c76f3f8amshb8be56169523917p1abdd1jsnca20b0fdcb62')
  let y = await x.text();
  console.log(y);
    // .then((Response) => Response.json())
    // .then((json) => console.log(json))
}

// function search() {
//   var button = select('search');
//   button.mousePressed(place);
// }

function place() {
  const to = document.getElementById("to").value;
  // const airportCountry = new Promise((resolve, reject) => {

  //   setTimeout(() => {
      for (let i = 0; i < GET.length; i++) {
          if (to = GET.country) {
          console.log(GET);
          resolve(GET);
        } else {
        reject(console.log('Invalid Country'));
      }
    }
//   }, 500)
// });
  
  // loadJson(url, Data);
  // console.log(loadJson);

}