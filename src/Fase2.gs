// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function proyectoAprobado(filaProyectoRaw) { // Como mínimo debe ser 2, no sé si incluirlo en un if
  let datosProyecto = responses.getRange(filaProyectoRaw, 1, 1, responses.getLastColumn()).getValues()[0];
  let opcionesHorasSolicitadas = [
    horariosParser(datosProyecto[lunesIndex]),
    horariosParser(datosProyecto[martesIndex]),
    horariosParser(datosProyecto[miercolesIndex]),
    horariosParser(datosProyecto[juevesIndex]),
    horariosParser(datosProyecto[viernesIndex]),
  ] // Matriz con las horas seleccionadas en listas de strings
  let franjasSolicitadas = respuestasDiasToMatrix(opcionesHorasSolicitadas); // Matriz 5*13 de ceros y unos
  console.log(franjasSolicitadas);

  let franjasOcupadas    = horarios.getRange(2, 4, 5, 13).getValues(); // Franjas ya ocupadas por otros proyectos
  console.log(franjasOcupadas);

  let [franjasAceptadas, franjasDenegadas]  = getFranjasAceptadasDenegadas(franjasOcupadas, franjasSolicitadas);
  console.log(franjasAceptadas);
  console.log(franjasDenegadas);

  return;
}
