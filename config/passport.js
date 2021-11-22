const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuarios = require("../models/Usuarios");

passport.use(
    new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
        },
        async(email, password, next) => {
            //consultamos a la base de datos si existe el usuario
            const usuario = await Usuarios.findOne({
                where: { email, activo: 1 }
            });

            if (!usuario) return next(null, false, {
                message: 'El Usuario no existe'
            });

            //Si el usuario existe, validamos el Pasword 
            const verificarPass = usuario.validarPassword(password);

            //Si falla la verificacion del Password
            if (!verificarPass) return next(null, false, {
                message: 'Password Incorrecto'
            });

            //Si la autenticacion tiene exito
            return next(null, usuario);


        }

    ));

//Configuracion de Passport para serliarizar y desserializar objetos

passport.serializeUser(function(usuario, calb) {
    calb(null, usuario);
});
passport.deserializeUser(function(usuario, calb) {
    calb(null, usuario);
});

module.exports = passport;