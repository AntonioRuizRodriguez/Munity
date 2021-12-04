const Grupos = require("../models/grupos");
const Evento = require("../models/Evento");

//Importamos el ORM (sequelize) y los operadores (> < >= <= ...etc) para usarlos en consultas a la bd
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//Pasamos la libreria que formatea las fechas a la vista
const moment = require("moment");

exports.panelUser = async (req, res) => {
  //nos traemos de la bd los grupos que tiene el usuario y los eventos
  // !!!
  const querys = [];
  querys.push(Grupos.findAll({ where: { usuarioId: req.user.id } }));
  querys.push(
    Evento.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") },
      },
      order:[["fecha", "ASC"]]
    })
  );
  querys.push(
    Evento.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: { [Op.lt]: moment(new Date()).format("YYYY-MM-DD") },
      },
    })
  );

  //sacamos el resultado de la consulta de eventos del array
  const [grupos, evento, pasados] = await Promise.all(querys);

  // Anterior
  // const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });

  res.render("panelUsuario", {
    nombrePagina: "Panel de Usuario",
    grupos,
    evento,
    pasados,
    moment,
  });
};
