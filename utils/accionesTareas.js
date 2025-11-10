const {
    agregarTarea,
    actualizarEstadoTarea,
    eliminarTarea,
    buscarTareasPorTitulo,
    filtrarYOrdenarTareas
} = require('../services/GestorTareas'); 
const { ESTADOS_VALIDOS, DIFICULTADES_VALIDAS } = require('../models/Tarea');


/**
 * HOF: Envuelve una función pura de lógica de negocio.
 * Se encarga de actualizar el estado (mutable en app.js) y persistir (guardarTareas).
 */
const manejarAccionPura = (pureFn, mensajeExito) => (estado, rl, callback, ...args) => {
    try {
        
        const nuevasTareas = pureFn(estado.tareas, ...args);
        
        estado.tareas = nuevasTareas; 
        estado.guardar(nuevasTareas); 
        
        console.log(`\n${mensajeExito}`);
    } catch (error) {
        console.error(`\nError: ${error.message}`);
    }
    callback(estado);
};

const mostrarTareas = (tareas) => {
    if (tareas.length === 0) {
        console.log('\nNo hay tareas.');
        return;
    }
    console.log('\n--- Lista de Tareas ---');
    tareas.forEach((t, i) => {
        const vencimiento = t.fechaVencimiento ? ` - Vence: ${t.fechaVencimiento}` : '';
        const edicion = t.ultimaEdicion ? ` (Editado: ${new Date(t.ultimaEdicion).toLocaleDateString()})` : '';
        console.log(`${i + 1}. ${t.titulo} [${t.estado.toUpperCase()}] - Dificultad: ${t.dificultad.toUpperCase()}${vencimiento}${edicion}`);
    });
};

const agregarTareaIO = (estado, rl, callback) => {
    rl.question('Título de la tarea: ', (titulo) => {
        rl.question('¿Descripción? (opcional): ', (descripcion) => {
            rl.question('¿Fecha de vencimiento? (DD-MM-AAAA, opcional): ', (fechaVencimiento) => {
                rl.question(`Dificultad (${DIFICULTADES_VALIDAS.join('/')}, default facil): `, (dificultad) => {
                    const accion = manejarAccionPura(agregarTarea, 'Tarea agregada.');
                    const opciones = { descripcion, fechaVencimiento, dificultad };
                    accion(estado, rl, callback, titulo, opciones);
                });
            });
        });
    });
};

const verTareasIO = (estado, rl, callback) => {
    const tareasOrdenadas = filtrarYOrdenarTareas(estado.tareas, null, null, 'fechaCreacion', 'asc');
    mostrarTareas(tareasOrdenadas);
    callback(estado);
};

const buscarTareaIO = (estado, rl, callback) => {
    rl.question('Buscar por título: ', (busqueda) => {
        const tareasEncontradas = buscarTareasPorTitulo(estado.tareas, busqueda);
        mostrarTareas(tareasEncontradas);
        callback(estado);
    });
};

const eliminarTareaIO = (estado, rl, callback) => {
    mostrarTareas(estado.tareas);
    if (estado.tareas.length === 0) {
        callback(estado);
        return;
    }

    rl.question('Número de tarea a eliminar: ', (num) => {
        const indice = parseInt(num) - 1;
        const accion = manejarAccionPura(eliminarTarea, 'Tarea eliminada.');
        accion(estado, rl, callback, indice);
    });
};

const editarEstadoTareaIO = (estado, rl, callback) => {
    const tareas = estado.tareas;
    if (tareas.length === 0) {
        console.log('\nNo hay tareas para editar.');
        callback(estado);
        return;
    }
    mostrarTareas(tareas);

    rl.question('Número de tarea a editar estado: ', (num) => {
        const indice = parseInt(num) - 1;

        if (isNaN(indice) || indice < 0 || indice >= tareas.length) {
            console.log('Número inválido.');
            callback(estado);
            return;
        }

        rl.question(`Nuevo estado (${ESTADOS_VALIDOS.join('/')}): `, (nuevoEstado) => {
            const accion = manejarAccionPura(actualizarEstadoTarea, 'Estado actualizado.');
            accion(estado, rl, callback, indice, nuevoEstado);
        });
    });
};

module.exports = {
    agregarTareaIO,
    verTareasIO,
    buscarTareaIO,
    eliminarTareaIO,
    editarEstadoTareaIO
};