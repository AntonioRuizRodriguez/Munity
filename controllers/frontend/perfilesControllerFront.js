const Usuarios = require("../../models/Usuarios");
const Grupos = require("../../models/grupos");

exports.mostarPerfil = async (req, res, next) => {
  const querys = [];

  querys.push(Usuarios.findOne({ where: { id: req.params.id } }));
  querys.push(Grupos.findAll({ where: { usuarioId: req.params.id } }));

  const [usuario, grupos] = await Promise.all(querys);

  if (!usuario) {
    res.redirect("/");
    return next();
  }

  //Mandamos el resultado de las querys a la vista
  res.render("vista-perfiles", {
    nombrePagina: `Usuario: ${usuario.nombre}`,
    usuario,
    grupos,
  });
};
