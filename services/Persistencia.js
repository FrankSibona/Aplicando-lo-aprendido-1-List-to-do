const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/tareas.json');

/**
 * Función Impura (I/O): Carga las tareas desde el archivo JSON.
 * Recibe una función pura (parserFn) para transformar los datos.
 */
const cargarTareas = (parserFn) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        const tareasJson = JSON.parse(data);
        return parserFn(tareasJson);
    } catch (error) {
        console.error('Error al cargar las tareas:', error.message);
        return [];
    }
};

/**
 * Función Impura (Side Effect): Guarda la lista de tareas.
 */
const guardarTareas = (tareas) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(tareas, null, 2));
    } catch (error) {
        console.error('Error al guardar las tareas:', error.message);
    }
};

module.exports = {
    cargarTareas,
    guardarTareas
};