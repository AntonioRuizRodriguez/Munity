const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const usuariosController = require("../controllers/usuariosController");
const autController = require("../controllers/autController");
const userPanelController = require("../controllers/userPanelController");
const gruposController = require("../controllers/gruposController");
const eventoController = require("../controllers/eventoController");
const perfilesController = require("../controllers/perfilesController");

const eventoControllerFront = require("../controllers/frontend/eventoControllerFront");
const perfilesControllerFront = require("../controllers/frontend/perfilesControllerFront");
const grposControllerFront = require("../controllers/frontend/grposControllerFront");
const comentariosControllerFront = require("../controllers/frontend/comentariosControllerFront");

module.exports = function () {
  //Pagina de inicio y registro de cuentas
  router.get("/", homeController.home);
  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post("/crear-cuenta", usuariosController.crearNuevaCuenta);
  router.get("/confirmar-cuenta/:correo", usuariosController.confirmarCuenta);

  //Iniciar sesion
  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  router.post("/iniciar-sesion", autController.autenticarUsuario);

  //Cerrar sesion
  router.get(
    "/cerrar-sesion",
    autController.usuarioAutenticado,
    autController.cerrarSesion
  );

  //Panel de usuario
  router.get(
    "/panelUsuario",
    autController.usuarioAutenticado,
    userPanelController.panelUser
  );

  //Crear Grupos
  router.get(
    "/nuevo-grupo",
    //necesitamos la referencia del usuario que crea en grupo
    //de manera que comprobamos que está utenticado
    autController.usuarioAutenticado,
    gruposController.formNuevoGrupo
  );
  router.post(
    "/nuevo-grupo",
    autController.usuarioAutenticado,
    gruposController.subirImagen,
    gruposController.crearGrupo
  );
  //Editar un Grupo
  router.get(
    "/editar-grupo/:grupoId",
    autController.usuarioAutenticado,
    gruposController.formEditarGrupo
  );
  router.post(
    "/editar-grupo/:grupoId",
    autController.usuarioAutenticado,
    gruposController.editarGrupo
  );

  //Editar la imagen del Grupo
  router.get(
    "/imagen-grupo/:grupoId",
    autController.usuarioAutenticado,
    gruposController.formEditarImagen
  );

  router.post(
    "/imagen-grupo/:grupoId",
    autController.usuarioAutenticado,
    gruposController.subirImagen, //Autenticar imagen, comprobaciones....
    gruposController.editarImagen //Guardar la imagen en la base de datos
  );

  router.get(
    "/eliminar-grupo/:grupoId",
    autController.usuarioAutenticado,
    gruposController.formEliminarGrupo
  );
  router.post(
    "/eliminar-grupo/:grupoId",
    autController.usuarioAutenticado,
    gruposController.eliminarGrupo
  );

  //Construimos las rutas para los eventos
  router.get(
    "/nuevo-evento",
    autController.usuarioAutenticado,
    eventoController.formNuevoEvento
  );

  router.post(
    "/nuevo-evento",
    autController.usuarioAutenticado,
    eventoController.validaFormularioEvento,
    eventoController.crearEvento
  );

  //Ruta para la opcion de Editar Evento
  router.get(
    "/editar-evento/:id",
    autController.usuarioAutenticado,
    eventoController.formEditarEvento
  );
  router.post(
    "/editar-evento/:id",
    autController.usuarioAutenticado,
    eventoController.editarEvento
  );

  //Eliminar Evento
  router.get(
    "/eliminar-evento/:id",
    autController.usuarioAutenticado,
    eventoController.formEliminarEvento
  );

  router.post(
    "/eliminar-evento/:id",
    autController.usuarioAutenticado,
    eventoController.eliminarEvento
  );

  //Ruta para el perfil del usuario
  router.get(
    "/editar-perfil",
    autController.usuarioAutenticado,
    perfilesController.formEditarPerfil
  );

  router.post(
    "/editar-perfil",
    autController.usuarioAutenticado,
    perfilesController.guardarPerfil
  );

  router.get(
    "/cambiar-pasword",
    autController.usuarioAutenticado,
    perfilesController.formCambiarContr
  );

  router.post(
    "/cambiar-pasword",
    autController.usuarioAutenticado,
    perfilesController.cambiarContr
  );

  router.get(
    "/imagen-perfil",
    autController.usuarioAutenticado,
    perfilesController.formImagenPerfil
  );

  router.post(
    "/imagen-perfil",
    autController.usuarioAutenticado,
    perfilesController.subirImagenPerfil,
    perfilesController.guardarImagenPerfil
  );

  //FrontEnd -- Muestra un Evento
  router.get("/evento/:slug", eventoControllerFront.mostrarEvento);

  //Inscribirse en un Evento
  router.post(
    "/inscribirse-evento/:slug",
    eventoControllerFront.inscribirseEvento
  );

  //Mostramos asistentes al evento
  router.get("/asistentes/:slug", eventoControllerFront.traerAsistentes);

  //Mostramos los perfiles de los asistentes al evento
  router.get("/perfilesAsistentes/:id", perfilesControllerFront.mostarPerfil);

  //Mostramos los grupos en la tarjeta del eveto
  router.get("/grupos/:id", grposControllerFront.mostrarGrupo);

  //Agrupamos los Eventos por Categorias
  router.get("/categoria/:categoria", eventoControllerFront.porCategorias);

  //Incluimos los Comentarios
  router.post("/evento/:id", comentariosControllerFront.guardaComentario);

  //Eliminar Comentarios
  router.post(
    "/eliminar-comentario",
    comentariosControllerFront.eliminarComentario
  );

  return router;
};
