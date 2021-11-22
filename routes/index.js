const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const usuariosController = require("../controllers/usuariosController");
const autController = require("../controllers/autController");
const userPanelController = require("../controllers/userPanelController");
const gruposController = require("../controllers/gruposController");
const eventoController = require("../controllers/eventoController");


module.exports = function() {
    //Crea las cuentas
    router.get("/", homeController.home);
    router.get("/crear-cuenta", usuariosController.formCrearCuenta);
    router.post("/crear-cuenta", usuariosController.crearNuevaCuenta);
    router.get("/confirmar-cuenta/:correo", usuariosController.confirmarCuenta);

    //Iniciar sesion
    router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
    router.post("/iniciar-sesion", autController.autenticarUsuario);

    //Panel de usuario
    router.get("/panelUsuario",
        autController.usuarioAutenticado,
        userPanelController.panelUser
    );

    //Crear Grupos
    router.get("/nuevo-grupo",
        //necesitamos la referencia del usuario que crea en grupo
        //de manera que comprobamos que está utenticado
        autController.usuarioAutenticado,
        gruposController.formNuevoGrupo
    );
    router.post("/nuevo-grupo",
            autController.usuarioAutenticado,
            gruposController.subirImagen,
            gruposController.crearGrupo
        )
        //Editar un Grupo
    router.get('/editar-grupo/:grupoId',
        autController.usuarioAutenticado,
        gruposController.formEditarGrupo
    );
    router.post('/editar-grupo/:grupoId',
        autController.usuarioAutenticado,
        gruposController.editarGrupo
    );

    //Editar la imagen del Grupo
    router.get('/imagen-grupo/:grupoId',
        autController.usuarioAutenticado,
        gruposController.formEditarImagen
    );

    router.post('/imagen-grupo/:grupoId',
        autController.usuarioAutenticado,
        gruposController.subirImagen, //Autenticar imagen, comprobaciones....
        gruposController.editarImagen //Guardar la imagen en la base de datos
    );

    router.get('/eliminar-grupo/:grupoId',
        autController.usuarioAutenticado,
        gruposController.formEliminarGrupo
    );
    router.post('/eliminar-grupo/:grupoId',
        autController.usuarioAutenticado,
        gruposController.eliminarGrupo
    );

    //Construimos las rutas para los eventos
    router.get('/nuevo-evento',
        autController.usuarioAutenticado,
        eventoController.formNuevoEvento
    );

    return router;
};