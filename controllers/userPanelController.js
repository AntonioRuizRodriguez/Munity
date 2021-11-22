const Grupos = require('../models/grupos');

exports.panelUser = async(req, res) => {

    //nos traemos de la bd los grupos que tiene el usuario 
    const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });

    res.render('panelUsuario', {
        nombrePagina: 'Panel de Usuario',
        grupos
    })
}