//Necesitamos importar el modelo de Grupos para poder hacer la consulta
//y asignar los eventos que se creen a algún grupo existente
const Grupos = require("../models/grupos");
const Evento = require("../models/Evento");

const uuid = require("uuid").v4;

//Mostramos el formulario para nuevos crear nuevos eventos
exports.formNuevoEvento = async (req, res) => {
  //Nos traemos todos los grupos del usuario registrado
  const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });

  res.render("nuevo-evento", {
    nombrePagina: "Crea un Evento Nuevo",
    grupos,
  });
};

//Introducimos los Eventos en la bd 
exports.crearEvento = async (req, res) => {
  //traemos los datos del body
  const evento = req.body;
  console.log(evento);
  //Usuario
  evento.usuarioId = req.user.id;

  //Ubicacion
  const point = {
    type: "Point",
    coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)],
  };
  evento.geoloc = point;

  //Aforo
  if (req.body.aforo == "") {
    evento.aforo = 0;
  }

  try {
    await Evento.create(evento);
    req.flash("exito", "El evento se ha creado Correctamente");
    res.redirect("/panelUsuario");
  } catch (error) {
    const erroresSequelize = error.errors.map((err) => err.message);
    req.flash("error", erroresSequelize);
    console.log(error);
    res.redirect("/nuevo-evento");
  }
};

//Valda los campos del formulario para que los inputs sean del Tipo de la bd
exports.validaFormularioEvento = (req, res, next) => {
  req.sanitizeBody("titulo");
  req.sanitizeBody("invitado");
  req.sanitizeBody("aforo");
  req.sanitizeBody("fecha");
  req.sanitizeBody("hora");
  req.sanitizeBody("direccion");
  req.sanitizeBody("ciudad");
  req.sanitizeBody("region");
  req.sanitizeBody("pais");
  req.sanitizeBody("lat");
  req.sanitizeBody("lng");
  req.sanitizeBody("grupoId");

  next();
};

//Lanzamos la vista del fromulario para editar los eventos
exports.formEditarEvento = async (req, res, next) => {
  const consultas = [];
  consultas.push(Grupos.findAll({ where: { usuarioId: req.user.id } }));
  consultas.push(Evento.findByPk(req.params.id));

  const [grupos, evento] = await Promise.all(consultas);
  console.log(evento);
  if (!grupos || !evento) {
    req.flash("error", "No tienes permiso para esta operacion");
    console.log(error);
    res.redirect("/panelUsuario");
    return next();
  }

  res.render("editar-evento", {
    nombrePagina: `Editar Evento : ${evento.titulo}`,
    grupos,
    evento,
  });
};

//Llevamos los cambios en el evento a la bd
exports.editarEvento = async (req, res, next) => {
  const evento = await Evento.findOne({
    where: { id: req.params.id, usuarioId: req.user.id },
  });
  if (!evento) {
    req.flash("error", "No tienes permiso para esta operacion");
    console.log(error);
    res.redirect("/panelUsuario");
    return next();
  }

  const {
    grupoId,
    titulo,
    invitado,
    fecha,
    hora,
    aforo,
    descripcion,
    direccion,
    ciudad,
    region,
    pais,
    lat,
    lng,
  } = req.body;

  //Reasignamos los valores
  evento.grupoId = grupoId;
  evento.titulo = titulo;
  evento.invitado = invitado;
  evento.fecha = fecha;
  evento.hora = hora;
  evento.aforo = aforo;
  evento.descripcion = descripcion;
  evento.direccion = direccion;
  evento.ciudad = ciudad;
  evento.region = region;
  evento.pais = pais;

  const punto = {
    type: "POINT",
    coordinates: [parseFloat(lat), parseFloat(lng)],
  };

  evento.geoloc = punto;

  //Guardando...
  await evento.save();
  req.flash("exito", "El evento se Actualizó Correctamente");
  res.redirect("/panelUsuario");
};

//Borramos eventos de la bd 
exports.formEliminarEvento = async (req, res, next) => {
  const evento = await Evento.findOne({
    where: { id: req.params.id, usuarioId: req.user.id },
  });
  if (!evento) {
    req.flash("error", "Operacion no valida");
    res.redirect("/panelUsuario");
    return next();
  }
  res.render("eliminar-evento", {
    nombrePagina: `Eliminar Evento : ${evento.titulo}`,
  });
};

exports.eliminarEvento = async (req, res) => {
  await Evento.destroy({
    where: { id: req.params.id },
  });
  req.flash("exito", "El Evento se ha Eliminado");
  res.redirect("/panelUsuario");
};
