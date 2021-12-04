document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#ubicacion-evento")) {
    mostrarMapa();
  }
});

function mostrarMapa() {
  //Capturamos las coordenadas para mostrar el evento en el mapa
  const lat = document.querySelector('#lat').value;
  const lng = document.querySelector('#lng').value;
  const direccion = document.querySelector('#direccion').value;

  let map = L.map("ubicacion-evento").setView([lat, lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(direccion)
    .openPopup();
}
