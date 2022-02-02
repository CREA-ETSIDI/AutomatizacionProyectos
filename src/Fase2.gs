// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function proyectoAprobado(filaProyectoRaw) { // Como mínimo debe ser 2, no sé si incluirlo en un if
  let datosProyecto = responses.getRange(filaProyectoRaw, 1, 1, responses.getLastColumn()).getValues()[0];

  let opcionesHorasSolicitadas = [
    horariosParser(datosProyecto[proyIndex.franjasDias.lun]),
    horariosParser(datosProyecto[proyIndex.franjasDias.mar]),
    horariosParser(datosProyecto[proyIndex.franjasDias.mie]),
    horariosParser(datosProyecto[proyIndex.franjasDias.jue]),
    horariosParser(datosProyecto[proyIndex.franjasDias.vie]),
  ] // Matriz con las horas seleccionadas en listas de strings
  let franjasSolicitadas = respuestasDiasToMatrix(opcionesHorasSolicitadas); // Matriz 5*13 de ceros y unos

  let franjasOcupadas    = horarios.getRange(2, 4, 5, 13).getValues(); // Franjas ya ocupadas por otros proyectos

  let [franjasAceptadas, franjasDenegadas]  = getFranjasAceptadasDenegadas(franjasOcupadas, franjasSolicitadas);

  // Ahora debe informarse al líder del proyecto de cuáles se han aceptado y cuáles denegado (¿hacer func aparate?)
  let tmpCorreoProcesamientoSolicitudes = "Hola, te informamos de los horarios que se pueden reservar y cuáles no de su previa solicitud: \nFranjas reservadas:\n";
  tmpCorreoProcesamientoSolicitudes += franjasToText(franjasAceptadas);
  tmpCorreoProcesamientoSolicitudes += "\nDebido al protocolo de prevención covid, no podemos dejarte las siguientes franjas:\n";
  tmpCorreoProcesamientoSolicitudes += franjasToText(franjasDenegadas);
  tmpCorreoProcesamientoSolicitudes += automagicoSignature;
  //console.log(tmpCorreoProcesamientoSolicitudes); // Yujuuuu, parece que funciona

  GmailApp.sendEmail(datosProyecto[proyIndex.responsable.email],
    "Confirmar horario disponible para su proyecto " + datosProyecto[proyIndex.titulo],
    tmpCorreoProcesamientoSolicitudes);

  return;
}
