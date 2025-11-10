const { crearTarea, actualizarTarea, cambiarEstado } = require('../models/Tarea');


/**
 * @param  {...Function} fns 
 * @returns {Function} 
 */
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);



/**
 * Función pura para hidratar tareas desde JSON.
 */
const hidratarTareas = (tareasJson) => {
    return tareasJson.map(t => {
        try {
            
            return actualizarTarea(t);
        } catch (e) {
            return null;
        }
    }).filter(t => t !== null); 
};

/**
 * Función pura para agregar una nueva tarea (Inmutabilidad).
 */
const agregarTarea = (tareas, titulo, opciones) => {
    const nuevaTarea = crearTarea(titulo, opciones);
    // Retorna un *nuevo* array
    return [...tareas, nuevaTarea];
};

/**
 * Función pura para eliminar una tarea por índice (Inmutabilidad).
 */
const eliminarTarea = (tareas, indice) => {
    if (indice < 0 || indice >= tareas.length) {
        throw new Error('Índice de tarea no válido.');
    }
    
    return tareas.filter((_, i) => i !== indice);
};

/**
 * Función pura para actualizar el estado de una tarea por índice (Inmutabilidad).
 */
const actualizarEstadoTarea = (tareas, indice, nuevoEstado) => {
    if (indice < 0 || indice >= tareas.length) {
        throw new Error('Índice de tarea no válido.');
    }

    const tareaOriginal = tareas[indice];
    const tareaActualizada = cambiarEstado(tareaOriginal, nuevoEstado);

    // Usa map para retornar un *nuevo* array con la tarea actualizada
    return tareas.map((t, i) => (i === indice ? tareaActualizada : t));
};

/**
 * Función pura para buscar tareas por título (Inmutabilidad).
 */
const buscarTareasPorTitulo = (tareas, busqueda) => {
    const b = busqueda.toLowerCase().trim();
    
    return tareas.filter(t => t.titulo.toLowerCase().includes(b));
};

/**
 * Función pura para ordenar tareas.
 */
const ordenarTareas = (tareas, campo, direccion = 'asc') => {
    
    const tareasCopia = [...tareas];

    const sortFn = (a, b) => {
        const valA = a[campo] || '';
        const valB = b[campo] || '';

        let comparison = 0;
        if (valA > valB) comparison = 1;
        else if (valA < valB) comparison = -1;

        return direccion === 'desc' ? comparison * -1 : comparison;
    };

    return tareasCopia.sort(sortFn);
};
/**

 */
const filtrarYOrdenarTareas = (tareas, busquedaTitulo, estado, campoOrden = 'fechaCreacion', direccionOrden = 'asc') => {

    const crearFiltroPorCampo = (campo, predicado) => (tarea) => predicado(tarea[campo]);

    const filtroTitulo = (lista) => busquedaTitulo
        ? buscarTareasPorTitulo(lista, busquedaTitulo)
        : lista;

    const filtroEstado = (lista) => estado
        ? lista.filter(crearFiltroPorCampo('estado', (val) => val === estado.toLowerCase().trim()))
        : lista;

    const ordenamiento = (lista) => ordenarTareas(lista, campoOrden, direccionOrden);

    
    const pipeline = compose(
        ordenamiento,
        filtroEstado,
        filtroTitulo
    );

    return pipeline(tareas);
};


module.exports = {
    hidratarTareas,
    agregarTarea,
    eliminarTarea,
    actualizarEstadoTarea,
    buscarTareasPorTitulo,
    ordenarTareas,
    filtrarYOrdenarTareas
};