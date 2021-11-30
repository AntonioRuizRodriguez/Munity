//Importamos el modelo para las categorias
const Categorias = require('../models/categorias');
const Grupos = require('../models/grupos');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

//Utilizamos la dependencia Multer para subir archivos, imagenes...etc
//Configuramos multer

const configuracionMulter = {
    //Le decimos a multer donde guardamos las imagenes subidas
    // creamos un nombre único para cada archivo subido
    // limitamos el tamaño de los archivos que se pueden subir
    // con 'filesize' que es una propiedad que existe en multer
    limits: { filesize: 100000 }, //tamaño 100000kbts
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + '/../public/uploads/grupos');
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }),
    //Filtramos por formato
    fileFilter(req, file, next) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            next(null, true);
        } else {
            next(new Error('Las imagenes pueden ser .png o .jpeg'), false);
        }
    }

}

//necesitamos hacer referencia al atributo 'name' que haya en la vista 'nuevo-grupo' 
//para el elemento imagen
const upload = multer(configuracionMulter).single('imagen');


//Función que controla la subida de imagenes al servidor
exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if (error) {
            //Filtramos por errores de multer
            //si err es una instacia de multer
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'La Imagen tiene que ser menor de 100000Kbs');
                } else {
                    req.flash('error', error.message);
                }
            } else if (error.hasOwnProperty('message')) {
                req.flash('error', error.message);

            }
            res.redirect('back');
            return;
        } else {
            next();
        }
    })

}

exports.formNuevoGrupo = async(req, res) => {
    //Ulilizanos el método de Sequelize findAll() para encontrar y traernos todas las categorias
    const categorias = await Categorias.findAll();

    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un nuevo Grupo',
        //pasamos a la vista el array con el resultado
        categorias
    })
}

//Guardamos los grupos en la base de datos
exports.crearGrupo = async(req, res) => {
    req.sanitizeBody('nombre');
    req.sanitizeBody('url');

    //Nos traemos el body para leer los registros
    const grupo = req.body;

    //Sacamos el usuario que ha creado el grupo y la categoria
    //Sequelize creo dos campos en la tabla grupos para usuario y categoria... usuarioId y categoriaId

    grupo.usuarioId = req.user.id;
    grupo.categoriaId = req.body.categoria;

    //Leemos la imagen si viene en el body
    // en bd solo guardamos el nombre del archivo, no la imagen
    if (req.file) {
        grupo.imagen = req.file.filename;
    }


    try {
        //Pasamos por parámetro el grupo que hemos traido en el request
        await Grupos.create(grupo);
        req.flash('exito', 'El Grupo se ha Creado Correctamente');
        res.redirect('/panelUsuario');
    } catch (error) {
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error', erroresSequelize);
        res.redirect('/nuevo-grupo');
    }

}

//Muestra el formulario para editar un grupo por id
exports.formEditarGrupo = async(req, res) => {
    //Filtramos los grupos por la clave primaria 
    //Hacemos un array de consultas y las ejecutamos a la vez con un Promise
    //De esa forma una consulta no tiene que esperar a que se terminen las demas
    //Esta forma solo es valida si las consultas son independientes
    const consultas = [];
    consultas.push(Grupos.findByPk(req.params.grupoId));
    consultas.push(Categorias.findAll());

    const [grupo, categorias] = await Promise.all(consultas);

    res.render('editar-grupo', {
        nombrePagina: `Editar Grupo: ${ grupo.nombre}`,
        grupo,
        categorias
    })
}

//Guarda los cambios en el grupo en la base de datos
//Verificamos que el grupo existe antes de modificar nada
//Verificamos que el usuario que lo modifica es el dueño del grupo
exports.editarGrupo = async(req, res, next) => {
    const grupo = await Grupos.findOne({
        where: {
            id: req.params.grupoId,
            usuarioId: req.user.id
        }
    });
    //Si no devuelve ningun grupo la operacion no es valida
    if (!grupo) {
        req.flash('error', 'No tienes permiso para realizar esta operación');
        res.redirect('/panelUsuario');
        return next();
    }

    const { nombre, descripcion, categoriaId, url } = req.body;

    //Modificamos los valores
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoriaId;
    grupo.url = url;

    //Mandamos la modificación a la base de datos
    await grupo.save();
    req.flash('exito', 'Cambios Guardados Correctamente');
    res.redirect('/panelUsuario');

}

//Editamos la imagen del grupo
exports.formEditarImagen = async(req, res) => {
    //Comprobamos que el grupo existe y es valido
    const grupo = await Grupos.findOne({
        where: {
            id: req.params.grupoId,
            usuarioId: req.user.id
        }
    });
    //Si no devuelve ningun grupo la operacion no es valida
    if (!grupo) {
        req.flash('error', 'No tienes permiso para realizar esta operación');
        res.redirect('/iniciar-sesion');
        return next();
    }

    res.render('imagen-grupo', {
        nombrePagina: `Editar la Imagen: ${grupo.nombre}`,
        grupo
    })
}

exports.editarImagen = async(req, res, next) => {
    //Comprobamos que el grupo existe y es valido
    const grupo = await Grupos.findOne({
        where: {
            id: req.params.grupoId,
            usuarioId: req.user.id
        }
    });
    //Si no devuelve ningun grupo la operacion no es valida
    if (!grupo) {
        req.flash('error', 'No tienes permiso para realizar esta operación');
        res.redirect('/iniciar-sesion');
        return next();
    }

    //Comprobamos que el archivo es nuevo
    if (req.file) {
        console.log(req.file.filename);
    }

    //Comprobamos que exista el archivo anterior
    if (grupo.imagen) {
        console.log(grupo.imagen);
    }

    //Borramos la imagen anterior si tenemos una imagen nueva
    if (req.file && grupo.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;

        //Para eliminar archivos usamos filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if (error) {
                console.log(error);
            }
            return;
        })
    }

    //La imagen nueva la guardamos
    if (req.file) {
        grupo.imagen = req.file.filename;
    }
    await grupo.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/panelUsuario');

}

//Hacemos la consulta para verificar que el grupo existe
exports.formEliminarGrupo = async(req, res, next) => {
    const grupo = await Grupos.findOne({
        where: {
            id: req.params.grupoId,
            usuarioId: req.user.id
        }
    });
    if (!grupo) {
        req.flash('error', 'Operacion no valida');
        res.redirect('/panelUsuario');
        return next();
    }

    res.render('eliminar-grupo', {
        nombrePagina: `Eliminar Grupo : ${grupo.nombre}`
    });

}

exports.eliminarGrupo = async(req, res, next) => {
    const grupo = await Grupos.findOne({
        where: {
            id: req.params.grupoId,
            usuarioId: req.user.id
        }
    });
  
    //Borramos el fichero con la imagen 
    if (grupo.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;

        //Para eliminar archivos usamos filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if (error) {
                console.log(error);
            }
            return;
        });
    }

    //Borramos el Grupo
    await Grupos.destroy({
        where: {
            id: req.params.grupoId
        }
    });
    req.flash('exito', 'Grupo Eliminado Correctamente');
    res.redirect('/panelUsuario');
}