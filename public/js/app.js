import { OpenStreetMapProvider } from "leaflet-geosearch";
import inscripciones from './inscripciones'
const geocodeService = L.esri.Geocoding.geocodeService();

//Capturamos los valores de la bd que hemos mandado al cliente si no hay valores seteamos los de Badajoz
const lat = document.querySelector("#lat").value || 38.8786;
const lng = document.querySelector("#lng").value || -6.97028;
const direccion = document.querySelector("#direccion").value || "";
const map = L.map("map").setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;

//Si estamos en 'Editar Evento' ta hemos mandado a la vista la lat y long del evento
//Los usampos para colocar la marca en el mapa
if (lat && lng) {
  marker = new L.marker([lat,lng], {
    draggable: true,
    autoPan: true,
  })
    .addTo(map)
    .bindPopup(direccion)
    .openPopup();
  markers.addLayer(marker);
  
  marker.on("moveend", function (e) {
    marker = e.target;
    const posicion = marker.getLatLng();
    map.panTo(new L.LatLng(posicion.lat, posicion.lng));
    //Evento para capturar las nuevas coordenadas cuando el marcador se mueve
    //Hacemos un reverse coding de posicion, que contiene la lat y long de la nueva posicion
    geocodeService
      .reverse()
      .latlng(posicion, 15)
      .run(function (error, result) {
        console.log(result);

        //Rellenamos el formulario con los datos captudados del mapa
        rellenarFormulario(result);
        marker.bindPopup(result.address.LongLabel);
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //Escuchamos si el usuario escribe una dirección en el buscador
  const buscador = document.querySelector("#formbuscador");
  buscador.addEventListener("input", buscarDireccion);
});

//Usamos leaflet reverse geocoding
function buscarDireccion(e) {
  if (e.target.value.length > 12) {
    markers.clearLayers();

    const geocodeService = L.esri.Geocoding.geocodeService();
    const provider = new OpenStreetMapProvider();
    provider.search({ query: e.target.value }).then((resultado) => {
      geocodeService
        .reverse()
        .latlng(resultado[0].bounds[0], 15)
        .run(function (error, result) {
          console.log(result);

          //Rellenamos el formulario con los datos captudados del mapa
          rellenarFormulario(result);

          //Mostrmos el mapa resultante de la busqueda
          map.setView(resultado[0].bounds[0], 15);

          marker = new L.marker(resultado[0].bounds[0], {
            draggable: true,
            autoPan: true,
          })
            .addTo(map)
            .bindPopup(resultado[0].label)
            .openPopup();
          markers.addLayer(marker);

          //Evento para Capturar el movimiento del marker
          marker.on("moveend", function (e) {
            marker = e.target;
            const posicion = marker.getLatLng();
            map.panTo(new L.LatLng(posicion.lat, posicion.lng));
            //Evento para capturar las nuevas coordenadas cuando el marcador se mueve
            //Hacemos un reverse coding de posicion, que contiene la lat y long de la nueva posicion
            geocodeService
              .reverse()
              .latlng(posicion, 15)
              .run(function (error, result) {
                console.log(result);

                //Rellenamos el formulario con los datos captudados del mapa
                rellenarFormulario(result);
                marker.bindPopup(result.address.LongLabel);
              });
          });
        });
    });
  }
}

function rellenarFormulario(resultado) {
  document.querySelector("#direccion").value = resultado.address.Address || "";
  document.querySelector("#ciudad").value = resultado.address.City || "";
  document.querySelector("#region").value = resultado.address.Region || "";
  document.querySelector("#pais").value = resultado.address.CountryCode || "";
  document.querySelector("#lat").value = resultado.latlng.lat || "";
  document.querySelector("#lng").value = resultado.latlng.lng || "";
}
