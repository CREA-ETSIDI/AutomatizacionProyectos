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
  let franjasOcupadas    = horarioIDs.getRange(2, 4, 13, 5).getValues(); // Franjas ya ocupadas por otros proyectos
  let [franjasAceptadas, franjasDenegadas]  = getFranjasAceptadasDenegadas(franjasOcupadas, franjasSolicitadas);
  EnviarEmailFranjasAceptadas(franjasAceptadas, franjasDenegadas, datosProyecto, filaProyectoRaw);
  return;
}

function proyectoDecisionResponsable(filaProj) {
  let rangoProyecto = responses.getRange(filaProj, 1, 1, responses.getLastColumn())
  let datosProyecto = rangoProyecto.getValues()[0];
  let opcionesHorasSolicitadas = [
    horariosParser(datosProyecto[prjIndex.franjasDias.lun]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mar]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mie]),
    horariosParser(datosProyecto[prjIndex.franjasDias.jue]),
    horariosParser(datosProyecto[prjIndex.franjasDias.vie]),
  ] // Matriz con las horas seleccionadas en listas de strings

    console.info("Se ha aceptado el proyecto " + datosProyecto[prjIndex.titulo] + " en fila #" + filaProj + ". Moviendolo a lista de proyectos aceptados");

  // Añadir contenido al pool de proyectos en curso
  poolEnCurso.getRange(poolEnCurso.getLastRow()+1, 1, 1, poolEnCurso.getLastColumn()).setValues([datosProyecto.concat(filaProj)]);

  //Ocupar las franjas en el horario
  let franjasSolicitadas = respuestasDiasToMatrix(opcionesHorasSolicitadas); // Matriz 13*5 de ceros y unos
  let franjasOcupadas    = horarioIDs.getRange(2, 4, 13, 5).getValues(); // Franjas ya ocupadas por otros proyectos
  let nuevoHorario = generarArrayCalendario();

  for(i in nuevoHorario){
    for(j in nuevoHorario[0])
    {
      // Ocupamos el nuevo horario con los valores de las ocupadas a menos de que sea 0 o vacío (= libre)
      // en cuyo caso sustituimos por el ID de la solicitada
      nuevoHorario[i][j] = franjasOcupadas[i][j] ? franjasOcupadas[i][j] : franjasSolicitadas[i][j]*filaProj;
    }
  }
  horarioIDs.getRange(2,4,13,5).setValues(nuevoHorario);
  return;
}
