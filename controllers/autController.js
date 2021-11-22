const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/panelUsuario',
    failureRedirect: '/iniciar-sesion',
    //Mensajes de error
    failureFlash: true,
    badRequestMessage: 'Los Campos son Obligatorios'
})

//Comprobamos que el usuario está autenticado

exports.usuarioAutenticado = (req, res, next) => {
    //Usamos el método de Passport isAuthenticated() que nos devuelve true o false
    //si esta autenticado la ejecucion continua
    //si no, lo mandamos a iniciar-sesion
    if (req.isAuthenticated()) {
        return next();
    }
    //Si llega hasta aquí es que no está autenticado
    return res.redirect('/iniciar-sesion');
}