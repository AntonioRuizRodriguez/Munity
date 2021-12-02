const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/emails");

exports.formCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    nombrePagina: "Crea tu Cuenta",
  });
};

exports.crearNuevaCuenta = async (req, res) => {
  const usuario = req.body;

  //Validamos el campo Repetir Password y confirmamos que no venga vacio

  req
    .checkBody("confirmar", "El campo Repite Password no puede estar vacio")
    .notEmpty();
  req
    .checkBody("confirmar", "Los Passwords no Coinciden")
    .equals(req.body.password);

  //Errores de Express
  const erroresExpress = req.validationErrors();
  console.log("primeros errores: " + erroresExpress.msg);

  //Puede que se cree correctamente o no
  //Administramos el error

  try {
    await Usuarios.create(usuario);

    //Url de confirmación

    const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

    //Enviar mail de confirmacion

    await enviarEmail.eviarEmail({
      usuario,
      url,
      subject: "Confirma tu cuenta de Munity",
      archivo: "confirmar-cuenta",
    });

    req.flash("exito", "Se ha enviado un e-mail para que confirmes tu cuenta");
    res.redirect("/iniciar-sesion");
  } catch (error) {
    //Errores de Sequelize
    //Los errores de la Base de Datos vienen en el campo message
    //Extraemos message
    const erroresSequelize = error.errors.map((err) => err.message);
    console.log("Los errores de Sequelize son: " + erroresSequelize);

    //Los errores de Express vienen en el campo msg
    //Extraemos msg
    const errExp = erroresExpress.map((err) => err.msg);

    console.log("Los errores de Express son: " + errExp);

    //Unimos todos lo errores en una sola lista de Errores

    const listaErrores = [...erroresSequelize, ...errExp];

    //Pasamos los errores a flahs
    //Redireccionamos a la ruta donde queremos mostrar los errores

    req.flash("error", listaErrores);
    res.redirect("crear-cuenta"); //Se imprimen los mensajes en los Locals
  }
};

//Confirma la cuenta del Usuario

exports.confirmarCuenta = async (req, res, next) => {
  //verificar que el usuario existe
  const usuario = await Usuarios.findOne({
    where: { email: req.params.correo },
  });

  //sino existe, redirecionar
  if (!usuario) {
    req.flash("error", "No existe la cuenta de usuario especificada");
    res.redirect("/crear-cuenta");
    return next();
  }

  //si existe, confirmar suscripcion
  usuario.activo = 1;
  await usuario.save();

  req.flash("exito", "Se ha confirmado la cuenta. Inicia Sesion");
  res.redirect("/iniciar-sesion");
};

//Formulario de Inicio de Sesion
exports.formIniciarSesion = (req, res) => {
  res.render("iniciar-sesion", {
    nombrePagina: "Iniciar Sesion",
  });
};



