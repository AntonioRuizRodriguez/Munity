//Necesitamos importar el modelo de Grupos para poder hacer la consulta
//y asignar los eventos que se creen a algún grupo existente
const Grupos = require('../models/grupos');


//Mostramos el formulario para nuevos crear nuevos eventos
exports.formNuevoEvento = async(req, res) => {

    //Nos traemos todos los grupos del usuario registrado
    const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });

    res.render('nuevo-evento', {
        nombrePagina: 'Crea un Evento Nuevo',
        grupos
    });
}