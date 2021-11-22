const Sequelize = require('sequelize');
const db = require('../config/db');

//Importamos uuid para crear ids únicos para los grupos
const uuid = require('uuid').v4;

//Relaccionamos la tabla Grupos con Categorias y el Usuario que crea el grupo
//Relaccion 1 a 1, un grupo solo puede tener una categoria y un usuario que lo crea
//Importamos los modelos para categorias y usuarios
const Categorias = require('./categorias');
const Usuarios = require('./Usuarios');

const Grupos = db.define('grupos', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid()
    },
    nombre: {
        type: Sequelize.TEXT(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El Grupo necesita un Nombre'
            }
        }
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Describe tu Grupo'
            }
        }
    },
    url: Sequelize.TEXT,
    imagen: Sequelize.TEXT
})

//Incluimos en el modelo grupos, el elemento categorias y el elemento usuario
//El método belongsTo() permite una relacción 1 a 1 con otro modelo
Grupos.belongsTo(Categorias);
Grupos.belongsTo(Usuarios);

module.exports = Grupos;