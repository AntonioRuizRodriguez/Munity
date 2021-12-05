const Sequelize = require("sequelize");
const db = require("../config/db");
const Usuarios = require("./Usuarios");
const Evento = require("./Evento");

const Comentarios = db.define("comentario", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  comentario: Sequelize.TEXT,
});

//Cada comentario tiene una relaccion 1 a 1 con Usuario y Evento
Comentarios.belongsTo(Usuarios);
Comentarios.belongsTo(Evento);

module.exports=Comentarios;