function agregarTarea(rl, gestor, callback) {
    rl.question('Título de la tarea: ', (titulo) => {
        rl.question('¿Descripción? (opcional): ', (descripcion) => {
            rl.question('¿Fecha de vencimiento? (DD-MM-AAAA, opcional): ', (fechaVencimiento) => {
                rl.question('Dificultad (facil/medio/dificil, default facil): ', (dificultad) => {
                    gestor.agregarTarea(titulo, {
                        descripcion: descripcion,
                        fechaVencimiento: fechaVencimiento || null,
                        dificultad: dificultad || 'facil'
                    });
                    console.log('\nTarea agregada.');
                    // Debug: muestra tareas actuales
                    console.log('Tareas actuales:', gestor.listarTareas());
                    callback();
                });
            });
        });
    });
}

function verTareas(gestor, callback) {
    const tareas = gestor.listarTareas();
    console.log('DEBUG tareas:', tareas); // Verifica el array real
    if (tareas.length === 0) {
        console.log('\nNo hay tareas.');
    } else {
        tareas.forEach((t, i) => {
            console.log(`${i + 1}. ${t.titulo} [${t.estado}] - Dificultad: ${t.dificultad}${t.fechaVencimiento ? ` - Vence: ${t.fechaVencimiento}` : ''}`);
        });
    }
    callback();
}

function buscarTarea(rl, gestor, callback) {
    rl.question('Buscar por título: ', (busqueda) => {
        const tareas = gestor.listarTareas().filter(t => t.titulo.toLowerCase().includes(busqueda.toLowerCase()));
        if (tareas.length === 0) {
            console.log('\nNo se encontraron tareas.');
        } else {
            tareas.forEach((t, i) => {
                console.log(`${i + 1}. ${t.titulo} [${t.estado}] - Dificultad: ${t.dificultad}`);
            });
        }
        callback();
    });
}

function eliminarTarea(rl, gestor, callback) {
    verTareas(gestor, () => {
        rl.question('Número de tarea a eliminar: ', (num) => {
            const indice = parseInt(num) - 1;
            if (!isNaN(indice) && gestor.tareas[indice]) {
                gestor.eliminarTarea(indice);
                console.log('Tarea eliminada.');
            } else {
                console.log('Número inválido.');
            }
            callback();
        });
    });
}

function editarEstadoTarea(rl, gestor, callback) {
    const tareas = gestor.listarTareas();
    if (tareas.length === 0) {
        console.log('\nNo hay tareas para editar.');
        callback();
        return;
    }
    tareas.forEach((t, i) => {
        console.log(`${i + 1}. ${t.titulo} [${t.estado}]`);
    });
    rl.question('Número de tarea a editar estado: ', (num) => {
        const indice = parseInt(num) - 1;
        if (!isNaN(indice) && gestor.tareas[indice]) {
            rl.question('Nuevo estado (pendiente/en curso/terminada/cancelada): ', (nuevoEstado) => {
                try {
                    gestor.cambiarEstadoTarea(indice, nuevoEstado.trim());
                    console.log('Estado actualizado.');
                } catch (e) {
                    console.log('Estado inválido.');
                }
                callback();
            });
        } else {
            console.log('Número inválido.');
            callback();
        }
    });
}

module.exports = { agregarTarea, verTareas, buscarTarea, eliminarTarea, editarEstadoTarea };