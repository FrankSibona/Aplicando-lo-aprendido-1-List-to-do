const readline = require('readline');

const { cargarTareas, guardarTareas } = require('./services/Persistencia');
const { hidratarTareas } = require('./services/GestorTareas'); 
const {
    agregarTareaIO,
    verTareasIO,
    buscarTareaIO,
    eliminarTareaIO,
    editarEstadoTareaIO
} = require('./utils/accionesTareas');


const appState = {
    tareas: cargarTareas(hidratarTareas),
    guardar: guardarTareas
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mostrarMenu() {
    console.log('\n--- Gestor de Tareas Funcional (FP) ---');
    console.log('1 - Agregar nueva tarea');
    console.log('2 - Ver tareas (Ordenadas por Creación)');
    console.log('3 - Buscar tarea por título');
    console.log('4 - Eliminar tarea');
    console.log('5 - Editar estado de tarea');
    console.log('6 - Salir');
    rl.question('Elige una opción: ', manejarOpcion);
}

/**
 * HOF: Crea una función que ejecuta una acción de I/O y vuelve a mostrar el menú.
 * Esto mantiene el flujo de la aplicación.
 */
const crearManejadorAccion = (accionIO) => () => {
    accionIO(appState, rl, (estadoActualizado) => {
        appState.tareas = estadoActualizado.tareas;
        mostrarMenu();
    });
};

function manejarOpcion(opcion) {
    const acciones = {
        '1': crearManejadorAccion(agregarTareaIO),
        '2': crearManejadorAccion(verTareasIO),
        '3': crearManejadorAccion(buscarTareaIO),
        '4': crearManejadorAccion(eliminarTareaIO),
        '5': crearManejadorAccion(editarEstadoTareaIO),
        '6': () => rl.close()
    };

    const accion = acciones[opcion.trim()];
    if (accion) {
        accion();
    } else {
        console.log('Opción inválida.');
        mostrarMenu();
    }
}

mostrarMenu();