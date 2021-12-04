import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
  const inscripciones = document.querySelector("#inscribirse-evento");
  if (inscripciones) {
    inscripciones.addEventListener("submit", inscribirseEvento);
  }
});

function inscribirseEvento(e) {
  e.preventDefault();

  const boton = document.querySelector(
    '#inscribirse-evento input[type="submit"]'
  );
  let flag = document.querySelector("#flag").value;
  const mensaje = document.querySelector("#mensaje");

  //Eliminamos el contenido previo de la variable mensaje
  while (mensaje.firstChild) {
    mensaje.removeChild(mensaje.firstChild);
  }

  const param = {
    flag,
  };

  axios.post(this.action, param).then((respuesta) => {
    if (flag === "confirmar") {
      document.querySelector("#flag").value = "Borrar Inscripcion";
      boton.value = "Borrar Inscripcion";
      boton.classList.remove("btn-azul");
      boton.classList.add("btn-rojo");
    } else {
      document.querySelector("#flag").value = "confirmar";
      boton.value = "Si";
      boton.classList.remove("btn-rojo");
      boton.classList.add("btn-azul");
    }
    mensaje.appendChild(document.createTextNode(respuesta.data));
  });
}
