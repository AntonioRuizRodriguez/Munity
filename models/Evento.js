const Sequelize = require('sequelize');
const db = require('../config/db');

//Para generar un id unico para cada evento
const uuid = require('uuid').v4;

//Para generar una url unica para cada evento
const slug = require('slug');
const shortid = require('shortid');

//A que usuario y grupo pertenece el evento
const Usuarios = require('../models/Usuarios');
const Grupos = require('../models/grupos');

const Evento = db.define(
    'evento', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuid()
        },
        titulo: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Todos los Eventos deben tener un Titulo'
                }
            }
        },
        slug: {
            type: Sequelize.STRING
        },
        invitado: Sequelize.STRING,
        aforo: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Describe tu Evento'
                }
            }
        },
        fecha: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: '¿Cuando se Celebrará tu Evento?'
                }
            }
        },
        hora: {
            type: Sequelize.TIME,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Pon la Hora de tu Evento'
                }
            }
        },
        direccion: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La Dirección de tu Evento'
                }
            }
        },
        ciudad: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: '¿En que ciudad?'
                }
            }
        },
        region: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: '¿Donde?'
                }
            }
        },
        pais: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El pais es necesario'
                }
            }
        },
        geoloc: {
            type: Sequelize.GEOMETRY('POINT')
        },
        asistentes: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue: []
        }
    }, {
        //Antes de crear el evento creamos su url
        hooks: {
            async beforeCreate(evento) {
                const url = slug(evento.titulo).toLocaleLowerCase();
                evento.slug = `${url}-${shortid.generate()}`;
            }
        }
    });
//Cardinalidad uno a muchos
//Cada Evento pertenece a un Usuario y un Grupo
Evento.belongsTo(Usuarios);
Evento.belongsTo(Grupos);

module.exports = Evento;