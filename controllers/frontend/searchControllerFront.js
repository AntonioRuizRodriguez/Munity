const Evento = require("../../models/Evento");
const Grupos = require("../../models/grupos");
const Usuarios = require("../../models/Usuarios");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");

exports.searchResult = async (req, res) => {
  const { categoria, titulo, ciudad, pais } = req.query;

  let cat;
  if(categoria===''){
      cat='';
  }else{
      cat= `where: {
        categoriaId: { [Op.eq]: ${categoria} },
      }`
  }

  const eventos = await Evento.findAll({
    where: {
      titulo: { [Op.iLike]: '%' + titulo + '%' },
      ciudad: { [Op.iLike]: '%' + ciudad + '%' },
      pais: { [Op.iLike]: '%' + pais +'%' },
    },
    include: [
      {
        model: Grupos,
        cat,
      },
      {
        model: Usuarios,
        attributes: ["id", "nombre", "imagen"],
      },
    ],
  });

  res.render("search", {
    nombrePagina: "Tu Búsqueda",
    eventos,
    moment,
  });
};
