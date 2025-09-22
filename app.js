const GestorTareas = require('./services/GestorTareas');
const { agregarTarea, verTareas, buscarTarea, eliminarTarea, editarEstadoTarea } = require('./utils/accionesTareas');

const gestor = new GestorTareas();
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mostrarMenu() {
    console.log('\n--- Gestor de Tareas ---');
    console.log('1 - Agregar nueva tarea');
    console.log('2 - Ver tareas');
    console.log('3 - Buscar tarea');
    console.log('4 - Eliminar tarea');
    console.log('5 - Editar estado de tarea');
    console.log('6 - Salir');
    rl.question('Elige una opción: ', manejarOpcion);
}

function manejarOpcion(opcion) {
    switch (opcion.trim()) {
        case '1':
            agregarTarea(rl, gestor, mostrarMenu);
            break;
        case '2':
            verTareas(gestor, mostrarMenu);
            break;
        case '3':
            buscarTarea(rl, gestor, mostrarMenu);
            break;
        case '4':
            eliminarTarea(rl, gestor, mostrarMenu);
            break;
        case '5':
            editarEstadoTarea(rl, gestor, mostrarMenu);
            break;
        case '6':
            rl.close();
            break;
        
        default:
            console.log('Opción inválida.');
            mostrarMenu();
    }
}

mostrarMenu();