const Evento = require("../../models/Evento");
const Grupos = require("../../models/grupos");
const Usuarios = require("../../models/Usuarios");
const moment = require("moment");
const Sequelize = require("sequelize");

exports.mostrarEvento = async (req, res) => {
  const evento = await Evento.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [
      {
        model: Grupos,
      },
      {
        model: Usuarios,
        attributes: ["id", "nombre", "imagen"],
      },
    ],
  });
  if (!evento) {
    res.redirect("/");
  }

  //Mandamos al FrontEnd lo que nos devuelve la consulta
  res.render("mostrar-evento", {
    nombrePagina: evento.titulo,
    evento,
    moment,
  });
};

//Inscribimos usuarios en los eventos
exports.inscribirseEvento = async (req, res) => {
  const { flag } = req.body;
  console.log(req.body);
  console.log(flag);

  if (flag === "confirmar") {
    Evento.update(
      {
        asistentes: Sequelize.fn(
          "array_append",
          Sequelize.col("asistentes"),
          req.user.id
        ),
      },
      { where: { slug: req.params.slug } }
    );

    res.send("Te has Inscrito al Evento");
  } else {
    Evento.update(
      {
        asistentes: Sequelize.fn(
          "array_remove",
          Sequelize.col("asistentes"),
          req.user.id
        ),
      },
      { where: { slug: req.params.slug } }
    );
    res.send("Has Eliminado tu Suscripcion");
  }
};

//Mostramos el listado de Asistentes a un Evento
exports.traerAsistentes = async (req, res) => {
  const evento = await Evento.findOne({
    where: { slug: req.params.slug },
    attributes: ["asistentes"],
  });

  //Busamos y extraemos los Asistentes de la bd
  const { asistentes } = evento;
  const listado = await Usuarios.findAll({
    attributes: ["nombre", "imagen"],
    where: { id: asistentes },
  });
  console.log(listado);

  //Mostramos el listado en la vista
  res.render("inscritos-evento", {
    nombrePagina: "Lista de Personas Inscritas en el Evento",
    listado,
  });
};
