
const ESTADOS_VALIDOS = ['pendiente', 'en curso', 'terminada', 'cancelada'];
const normalizeEstado = (estado) => {
    const norm = (estado || 'pendiente').toLowerCase().trim();
    if (!ESTADOS_VALIDOS.includes(norm)) {
        throw new Error(`Estado inválido: ${estado}. Los valores válidos son: ${ESTADOS_VALIDOS.join(', ')}`);
    }
    return norm;
};


const DIFICULTADES_VALIDAS = ['facil', 'medio', 'dificil'];
const normalizeDificultad = (dificultad) => {
    const norm = (dificultad || 'facil').toLowerCase().trim();
    if (!DIFICULTADES_VALIDAS.includes(norm)) {
        throw new Error(`Dificultad inválida: ${dificultad}. Los valores válidos son: ${DIFICULTADES_VALIDAS.join(', ')}`);
    }
    return norm;
};

/**
 * Función pura para crear una nueva tarea inmutable.
 * @param {string} titulo - Título de la tarea (requerido).
 * @param {object} opciones - Opciones de la tarea.
 * @returns {object} La nueva tarea inmutable (con Object.freeze).
 */
const crearTarea = (titulo, opciones = {}) => {
    const t = titulo.trim();
    if (!t || t.length > 100) {
        throw new Error('El título es requerido y no debe exceder los 100 caracteres.');
    }
    const ahora = new Date().toISOString();

    const tareaBase = {
        titulo: t,
        descripcion: (opciones.descripcion || '').trim().slice(0, 500),
        estado: normalizeEstado(opciones.estado),
        fechaCreacion: ahora,
        ultimaEdicion: ahora, 
        fechaVencimiento: opciones.fechaVencimiento || null,
        dificultad: normalizeDificultad(opciones.dificultad)
    };

    return Object.freeze(tareaBase);
};

/**
 * Actualiza una tarea de forma inmutable.
 * @param {object} tarea - Tarea original.
 * @param {object} campos - Campos a actualizar.
 * @returns {object} Tarea actualizada.
 */
const actualizarTarea = (tarea, campos = {}) => {
    const nuevosCampos = {};
    if (campos.estado) {
        nuevosCampos.estado = normalizeEstado(campos.estado);
    }
    if (campos.dificultad) {
        nuevosCampos.dificultad = normalizeDificultad(campos.dificultad);
    }

    return Object.freeze({
        ...tarea,
        ...campos,
        ...nuevosCampos,
        ultimaEdicion: new Date().toISOString()
    });
};


const cambiarEstado = (tarea, nuevoEstado) => {
    return actualizarTarea(tarea, { estado: nuevoEstado });
};

module.exports = {
    crearTarea,
    cambiarEstado,
    actualizarTarea,
    ESTADOS_VALIDOS,
    DIFICULTADES_VALIDAS
};