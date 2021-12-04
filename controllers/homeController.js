const Categorias = require("../models/categorias");
const Evento = require("../models/Evento");
const Grupos = require("../models/grupos");
const Usuarios = require("../models/Usuarios");
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.home = async (req, res) => {
  //Existen dos consultas en la pagina, las colocamos en un array
  //La clausula include equivale al join de SQL para traernos la relaccion con la tabla Grupos y Usuario
  const consultas = [];
  consultas.push(Categorias.findAll({}));
  consultas.push(
    Evento.findAll({
      attributes: ["slug", "titulo", "fecha", "hora"],
      where: { fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") } },
      limit: 3,
      order: [["fecha", "ASC"]],
      include: [
        {
          model: Grupos,
          attributes: ["imagen"],
        },
        {
          model: Usuarios,
          attributes: ["nombre", "imagen"],
        },
      ],
    })
  );

  const [categorias, eventos] = await Promise.all(consultas);

  console.log(eventos);
  console.log(eventos.length);

  res.render("home", {
    nombrePagina: "Inicio",
    categorias,
    eventos,
    moment,
  });
};
