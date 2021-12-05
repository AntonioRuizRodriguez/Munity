const Evento = require("../../models/Evento");
const Grupos = require("../../models/grupos");
const Usuarios = require("../../models/Usuarios");
const moment = require("moment");
const Sequelize = require("sequelize");
const Categorias = require("../../models/categorias");
const Comentarios = require("../../models/Comentarios");

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

   const comentarios = await Comentarios.findAll({
    where: { eventoId: evento.id },
    include: [{ model: Usuarios, attributes: ["id", "nombre", "imagen"] }],
  });

  //Mandamos al FrontEnd lo que nos devuelve la consulta
  res.render("mostrar-evento", {
    nombrePagina: evento.titulo,
    evento,
    moment,
    comentarios
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

//Agrupamos los eventos por Categorias
exports.porCategorias = async (req, res, next) => {
  const categoria = await Categorias.findOne({
    attributes: ["id", "nombre"],
    where: { slug: req.params.categoria },
  });

  const evento = await Evento.findAll({
    include: [
      {
        model: Grupos,
        where: { categoriaId: categoria.id },
      },
      {
        model: Usuarios,
      },
    ],
    order: [["fecha", "ASC"]],
  });
  res.render("categoria", {
    nombrePagina: `Categoria: ${categoria.nombre}`,
    evento,
    moment,
  });
};
