const Comentarios = require("../../models/Comentarios");
const Evento = require("../../models/Evento");

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
  //Recibimos el Id desde el FrontEnd
  const { comentarioId } = req.body;

  //Con el Id nos traemos el comentario de la bd
  const comentario = await Comentarios.findOne({ where: { id: comentarioId } });

  if (!comentario) {
    res.status(404).send("Acción no permitida");
    return next;
  }

  //Nos traemos de la bd el Evento al que pertenece el comentario
  const evento = await Evento.findOne({ where: { id: comentario.eventoId } });

  if (comentario.usuarioId === req.user.id || evento.usuarioId===req.user.id) {
    await Comentarios.destroy({
      where: {
        id: comentario.id,
      },
    });
    res.status(200).send("Borrado Correctamente");
    return next();
  } else {
    res.status(403).send("Acción no permitida");
    return next();
  }
};
