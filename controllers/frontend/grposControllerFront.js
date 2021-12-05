const Grupos = require("../../models/grupos");
const Evento = require("../../models/Evento");
const moment = require('moment');

exports.mostrarGrupo = async (req, res, next) => {
  const querys = [];

  querys.push(Grupos.findOne({ where: { id: req.params.id } }));
  querys.push(
    Evento.findAll({
      where: { grupoId: req.params.id },
      order: [["fecha", "ASC"]],
    })
  );

  const [grupo, evento] = await Promise.all(querys);

  if (!grupo) {
    res.redirect("/");
    return next();
  }

  res.render("mostrar-grupo", {
    nombrePagina: `Datos del Grupo: ${grupo.nombre}`,
    grupo,
    evento,
    moment
  });
};
