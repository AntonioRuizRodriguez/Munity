import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const btnsEliminar = document.querySelectorAll(".eliminar-comentario");

  if (btnsEliminar.length > 0) {
    btnsEliminar.forEach((btn) => {
      btn.addEventListener("submit", borrarComentario);
    });
  }
});

function borrarComentario(e) {
    e.preventDefault();
   
    axios.post(this.action).then(res=>{
        console.log(res);
    })
}