const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/emails");

const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");

exports.formEditarPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  res.render("editar-perfil", {
    nombrePagina: "Editar Perfil",
    usuario,
  });
};

//Guardamos en bd los cambios en el usuario
exports.guardarPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  req.sanitizeBody("nombre");
  req.sanitizeBody("email");

  //Extraemos lo valores del formulario, los reasignamos y gardamos en bd
  const { nombre, descripcion, email } = req.body;

  usuario.nombre = nombre;
  usuario.biografia = descripcion;
  usuario.email = email;

  await usuario.save();
  req.flash("exito", "Perfil Guardado");
  res.redirect("/panelUsuario");
};

exports.formCambiarContr = (req, res) => {
  res.render("cambiar-pasword", {
    nombrePagina: "Cambiar Contraseña",
  });
};

//Verificamois si la contraseña es correcta y guardamos la nueva en bd
exports.cambiarContr = async (req, res, next) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  //Validamos la contrasela actual
  if (!usuario.validarPassword(req.body.antigua)) {
    req.flash("error", "La contraseña es Incorrecta");
    res.redirect("/panelUsuario");
    return next();
  }

  //Encriptamos la nueva Contraseña
  const hash = usuario.hashPassword(req.body.nueva);
  usuario.password = hash;
  await usuario.save();

  //Sacamos al Usuario y Obligamos a que inicie sesion con la nueva contraseña
  //Usamos el metodo de passport logout()
  req.logout();
  req.flash("exito", "Contraseña Modificada Correctamente");
  res.redirect("/iniciar-sesion");
};

//Subimos la Imagen de perfil del Usuario
exports.formImagenPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  res.render("imagen-perfil", {
    nombrePagina: "Sube una Imagen para tu Perfil",
    usuario,
  });
};

//Utilizamos la dependencia Multer para subir archivos, imagenes...etc
//Configuramos multer

const configuracionMulter = {
  //Le decimos a multer donde guardamos las imagenes subidas
  // creamos un nombre único para cada archivo subido
  // limitamos el tamaño de los archivos que se pueden subir
  // con 'filesize' que es una propiedad que existe en multer
  limits: { filesize: 100000 }, //tamaño 100000kbts
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, next) => {
      next(null, __dirname + "/../public/uploads/perfiles/");
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split("/")[1];
      next(null, `${shortid.generate()}.${extension}`);
    },
  })),
  //Filtramos por formato
  fileFilter(req, file, next) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      next(null, true);
    } else {
      next(new Error("Las imagenes pueden ser .png o .jpeg"), false);
    }
  },
};

//necesitamos hacer referencia al atributo 'name' que haya en la vista 'nuevo-grupo'
//para el elemento imagen
const upload = multer(configuracionMulter).single("imagen");

//Función que controla la subida de imagenes al servidor
exports.subirImagenPerfil = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      //Filtramos por errores de multer
      //si err es una instacia de multer
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "La Imagen tiene que ser menor de 100000Kbs");
        } else {
          req.flash("error", error.message);
        }
      } else if (error.hasOwnProperty("message")) {
        req.flash("error", error.message);
      }
      res.redirect("back");
      return;
    } else {
      next();
    }
  });
};

//Subimos la imagen del perfil a la bd, si ya existe una imagen, la elimina
exports.guardarImagenPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  if (req.file && usuario.imagen) {
    const imagenAnteriorPath =
      __dirname + `/../public/uploads/perfiles/${usuario.imagen}`;

    //Para eliminar archivos usamos filesystem
    fs.unlink(imagenAnteriorPath, (error) => {
      if (error) {
        console.log(error);
      }
      return;
    });
  }
  //La imagen nueva la guardamos
  if (req.file) {
    usuario.imagen = req.file.filename;
  }
  await usuario.save();
  req.flash("exito", "Cambios Almacenados Correctamente");
  res.redirect("/panelUsuario");
};
