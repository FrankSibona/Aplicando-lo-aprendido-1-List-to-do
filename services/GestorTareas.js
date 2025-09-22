const fs = require('fs');
const path = require('path');
const Tarea = require('../models/Tarea');

const DATA_FILE = path.join(__dirname, '../data/tareas.json');

class GestorTareas {
    constructor() {
        this.tareas = [];
        this.cargarTareas();
    }

    cargarTareas() {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            const tareasJson = JSON.parse(data);
            this.tareas = tareasJson.map(obj => Object.assign(new Tarea(), obj));
        }
    }

    guardarTareas() {
        fs.writeFileSync(DATA_FILE, JSON.stringify(this.tareas, null, 2));
    }

    agregarTarea(titulo, opciones = {}) {
        const tarea = new Tarea(titulo, opciones);
        this.tareas.push(tarea);
        this.guardarTareas();
        return tarea;
    }

    listarTareas() {
        return this.tareas;
    }

    cambiarEstadoTarea(indice, nuevoEstado) {
        if (this.tareas[indice]) {
            this.tareas[indice].cambiarEstado(nuevoEstado);
            this.guardarTareas();
        } else {
            throw new Error('Tarea no encontrada');
        }
    }

    eliminarTarea(indice) {
        if (this.tareas[indice]) {
            this.tareas.splice(indice, 1);
            this.guardarTareas();
        } else {
            throw new Error('Tarea no encontrada');
        }
    }
}

module.exports = GestorTareas;