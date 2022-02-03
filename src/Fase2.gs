// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function proyectoAprobadoPorCREA(filaProyectoRaw) { // Como mínimo debe ser 2, no sé si incluirlo en un if
  let datosProyecto = responses.getRange(filaProyectoRaw, 1, 1, responses.getLastColumn()).getValues()[0];

  let opcionesHorasSolicitadas = [
    horariosParser(datosProyecto[prjIndex.franjasDias.lun]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mar]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mie]),
    horariosParser(datosProyecto[prjIndex.franjasDias.jue]),
    horariosParser(datosProyecto[prjIndex.franjasDias.vie]),
  ] // Matriz con las horas seleccionadas en listas de strings
  let franjasSolicitadas = respuestasDiasToMatrix(opcionesHorasSolicitadas); // Matriz 13*5 de ceros y unos
  let franjasOcupadas    = horarios.getRange(2, 4, 13, 5).getValues(); // Franjas ya ocupadas por otros proyectos
  let [franjasAceptadas, franjasDenegadas]  = getFranjasAceptadasDenegadas(franjasOcupadas, franjasSolicitadas);
  EnviarEmailFranjasAceptadas(franjasAceptadas, franjasDenegadas, datosProyecto)
  return;
}

function proyectoDecisionResponsable(esAprobado, filaProj) {
  let rangoProyecto = responses.getRange(filaProj, 1, 1, responses.getLastColumn())
  let datosProyecto = rangoProyecto.getValues()[0];
  let opcionesHorasSolicitadas = [
    horariosParser(datosProyecto[prjIndex.franjasDias.lun]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mar]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mie]),
    horariosParser(datosProyecto[prjIndex.franjasDias.jue]),
    horariosParser(datosProyecto[prjIndex.franjasDias.vie]),
  ] // Matriz con las horas seleccionadas en listas de strings

  if (esAprobado) {
    console.info("Se ha aceptado el proyecto " + datosProyecto[prjIndex.titulo] + " en fila #" + filaProj + ". Moviendolo a lista de proyectos aceptados");

    // Añadir contenido al pool de proyectos en curso
    poolEnCurso.getRange(poolEnCurso.getLastRow()+1, 1, 1, poolEnCurso.getLastColumn()).setValues([datosProyecto.concat(filaProj)]);

    //Ocupar las franjas en el horario
    let franjasSolicitadas = respuestasDiasToMatrix(opcionesHorasSolicitadas); // Matriz 13*5 de ceros y unos
    let franjasOcupadas    = horarios.getRange(2, 4, 13, 5).getValues(); // Franjas ya ocupadas por otros proyectos
    let nuevoHorario = generarArrayCalendario();

    for(i in nuevoHorario){
      for(j in nuevoHorario[0])
      {
        nuevoHorario[i][j] = franjasSolicitadas[i][j] | franjasOcupadas[i][j];
      }
    }
    horarios.getRange(2,4,13,5).setValues(nuevoHorario);
    
    // Eliminar viejo contenido del origen de proyectos
    //rangoProyecto.clear(); //WTF?! Por qué?
  }
  else {
    // Qué hacemos? Lo eliminamos? Sería una forma de saber qué fue de él, pero se perdería la info. ¿Moverlo a una hoja de cancelados con la razón?
    //Voto por no hacer nada, pedirle que vuelva a rellenar el form y fin
    return;
  }
  return;
}
