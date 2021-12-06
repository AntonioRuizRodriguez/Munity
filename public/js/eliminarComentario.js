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

  Swal.fire({
    title: "El Comentario se Eliminará",
    text: "El Comentario no se podrá Recuperar",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Eliminar!",
    cancelButtonText: "No Eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      //Capturamos el id del comentario que corresponde con el input hidden del html
      const comentarioId = this.children[0].value;

      //Objeto que pasaremos al post de Axios
      const obj = {
        comentarioId,
      };

      axios
        .post(this.action, obj)
        .then((res) => {
          Swal.fire("Borrado!", res.data, "success");

          //Actualizamos el Formulario para que el comentario desaparezca
          this.parentElement.parentElement.remove();
        })
        .catch((e) => {
          console.log(e.response);
          Swal.fire("Error", e.response.data, "error");
        });
    }
  });
}
