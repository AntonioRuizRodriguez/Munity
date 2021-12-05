const Comentarios = require("../../models/Comentarios");

exports.guardaComentario = async (req, res, next) => {
  const { coment } = req.body;

  console.log(coment);

  await Comentarios.create({
    comentario: coment,
    usuarioId: req.user.id,
    eventoId: req.params.id,
  });

  res.redirect("back");
  next();
};

exports.eliminarComentario = async (req, res, next) => {
  res.send("Eliminando...");
};
