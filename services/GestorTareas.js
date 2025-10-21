const fs = require('fs');
const path = require('path');
const Tarea = require('../models/Tarea');

const DATA_FILE = path.join(__dirname, '../data/tareas.json');

function GestorTareas() {
    this.tareas = [];
    this.cargarTareas();
}

GestorTareas.prototype.cargarTareas = function() {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        const tareasJson = JSON.parse(data);
        this.tareas = tareasJson.map(function(obj) {
            return Object.assign(new Tarea(), obj);
        });
    }
};

GestorTareas.prototype.guardarTareas = function() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.tareas, null, 2));
};

GestorTareas.prototype.agregarTarea = function(titulo, opciones) {
    opciones = opciones || {};
    const tarea = new Tarea(titulo, opciones);
    this.tareas.push(tarea);
    this.guardarTareas();
    return tarea;
};

GestorTareas.prototype.listarTareas = function() {
    return this.tareas;
};

GestorTareas.prototype.cambiarEstadoTarea = function(indice, nuevoEstado) {
    if (this.tareas[indice]) {
        this.tareas[indice].cambiarEstado(nuevoEstado);
        this.guardarTareas();
    } else {
        throw new Error('Tarea no encontrada');
    }
};

GestorTareas.prototype.eliminarTarea = function(indice) {
    if (this.tareas[indice]) {
        this.tareas.splice(indice, 1);
        this.guardarTareas();
    } else {
        throw new Error('Tarea no encontrada');
    }
};

module.exports = GestorTareas;