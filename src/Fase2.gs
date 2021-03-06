// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function proyectoAprobadoPorCREA(filaProyectoRaw) { // Como mínimo debe ser 2, no sé si incluirlo en un if
  responses.getRange(lastRow, prjIndex.estado + 1).setValue("2"); //Set flag estado a 2
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
  let rangoProyecto = responses.getRange(filaProj, 1, 1, (prjIndex.estado + 1) - 1)
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
  Logger.log(poolEnCurso.getRange(poolEnCurso.getLastRow()+1, 1, 1, poolEnCurso.getLastColumn()).getValues()[0].length)
  Logger.log([datosProyecto.concat(filaProj)][0].length);
  poolEnCurso.getRange(poolEnCurso.getLastRow()+1, 1, 1, poolEnCurso.getLastColumn()).setValues([datosProyecto.concat(filaProj).concat("0")]);

  //Ocupar las franjas en el horario
  let franjasSolicitadas = respuestasDiasToMatrix(opcionesHorasSolicitadas); // Matriz 13*5 de ceros y unos
  Logger.log(franjasSolicitadas);
  let franjasOcupadas    = horarioIDs.getRange(2, 4, 13, 5).getValues(); // Franjas ya ocupadas por otros proyectos
  Logger.log(franjasOcupadas);
  let nuevoHorario = generarArrayCalendario();

  let franjasAceptadas = ["","","","",""];
  for(i in nuevoHorario){
    for(j in nuevoHorario[0])
    {
      // Ocupamos el nuevo horario con los valores de las ocupadas a menos de que sea 0 o vacío (= libre)
      // en cuyo caso sustituimos por el ID de la solicitada
      nuevoHorario[i][j] = franjasOcupadas[i][j] ? franjasOcupadas[i][j] : franjasSolicitadas[i][j]*filaProj;
      franjasAceptadas[j] += franjasOcupadas[i][j]?"":franjasSolicitadas[i][j]?(", " + listaValuesHorario[i]):""; 
    }
  }
  Logger.log(JSON.stringify(franjasAceptadas));
  Logger.log(nuevoHorario);
  SpreadsheetApp.flush();
  poolEnCurso.getRange(poolEnCurso.getLastRow(),prjIndex.franjasDias.lun + 1, 1, 5).setValues([franjasAceptadas]);
  horarioIDs.getRange(2,4,13,5).setValues(nuevoHorario);
  responses.getRange(lastRow, prjIndex.estado + 1).setValue("3"); //Set flag estado a 3
  prjToTimetable(filaProj);
  return;
}
