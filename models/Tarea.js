class Tarea {
    constructor(titulo, opciones = {}) {
        this.titulo = titulo;
        this.descripcion = opciones.descripcion || '';
        this.estado = 'pendiente';
        this.fechaCreacion = new Date();
        this.fechaVencimiento = opciones.fechaVencimiento || null;
        this.dificultad = opciones.dificultad || 'facil';
    }

    cambiarEstado(nuevoEstado) {
        const estadosValidos = ['pendiente', 'en curso', 'terminada', 'cancelada'];
        if (estadosValidos.includes(nuevoEstado)) {
            this.estado = nuevoEstado;
        } else {
            throw new Error('Estado inválido');
        }
    }
}

module.exports = Tarea;