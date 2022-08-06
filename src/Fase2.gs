// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

//La fase #2 consiste en detectar si las franjas horarias elegidas siguen estando disponibles y preguntar al usuario si quiere continuar el proceso

function proyectoAprobadoPorCREA(filaProyectoRaw) { // Como mínimo debe ser 2, no sé si incluirlo en un if
  responses.getRange(filaProyectoRaw, prjIndex.estado + 1).setValue("2"); //Set flag estado a 2
  let datosProyecto = responses.getRange(filaProyectoRaw, 1, 1, responses.getLastColumn()).getValues()[0];

  let opcionesHorasSolicitadas = [
    horariosParser(datosProyecto[prjIndex.franjasDias.lun]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mar]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mie]),
    horariosParser(datosProyecto[prjIndex.franjasDias.jue]),
    horariosParser(datosProyecto[prjIndex.franjasDias.vie]),
  ] // Matriz con las horas seleccionadas en listas de strings
  let franjasSolicitadas = respuestasDiasToMatrix(opcionesHorasSolicitadas); // Matriz 13*5 de ceros y unos
  let franjasOcupadas    =  getFranjasOcupadas();// Franjas ya ocupadas por otros proyectos
  let [franjasAceptadas, franjasDenegadas]  = getFranjasAceptadasDenegadas(franjasOcupadas, franjasSolicitadas);
  EnviarEmailFranjasAceptadas(franjasAceptadas, franjasDenegadas, datosProyecto, filaProyectoRaw);
  return;
}
