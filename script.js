mapboxgl.accessToken = 'pk.eyJ1IjoicmVnaW5hYmFja3dhcmRzIiwiYSI6ImNsbnN4Y3JqcDFoM2YybW8ycTd2ZGJqZjQifQ.uKv4TTT2HDybR6e_l8UDdg';

var api = 'https://flight-radar1.p.rapidapi.com/airports/list';
var city = '';
var apiKey = '?rapidapi-key=14c76f3f8amshb8be56169523917p1abdd1jsnca20b0fdcb62';
var button = document.querySelector('#search');

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});

map.addControl(new mapboxgl.NavigationControl());

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