// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function horariosParser(horariosSelected) {
  // Debe comprobarse que no se ha elegido que ese día "no" de todas la posible lista que haya.
  // Si es así devuelve undefined, y si no devuelve la lista de días escogidos en strings
  let splitList = horariosSelected.split(', ');

  if (splitList[0].indexOf("no") != -1){ // Es -1 cuando no la encuentra
    return;
  }
  return splitList;
}

function respuestasDiasToMatrix(diasStringList) {
  /* Input: supuestamente un array con 5 arrays por cada día que tienen las horas, en strings, que se han seleccionado
  Output: supuestamente una matriz 5*13 que indica con trues que intervalos han sido seleccionados */
  let matriz = generarArrayCalendario();

  for (dayN in diasStringList) { // Para cada dia dentro del array de entrada, analizaremos que horas se han cogido
    let diaList = diasStringList[dayN]; // Array de respuestas del día dayN
    for (i in diaList) { // Para cada elemento, supondremos que una string como "9:30-10:30", buscamos donde carajo hay que meterlo en matriz
      let franjaToCheck = diaList[i]; // Esta es la string con la franja en específico
      let index = listaValuesHorario.indexOf(franjaToCheck); // Para cada string de estas, obtenemos el índice que le toca. Véase listaValuesHorario en CENSURADO.gs
      if (index != -1) { // O sea, si resulta que es -1 es que no lo encuentra, pues: si lo encuentra...
        matriz[dayN][index] = 1; // Mete en el array del día de matriz, en la posición index, eso, creo que no me explico
      }
    }
  }

  return matriz;
}

function getFranjasAceptadasDenegadas(calendario, propuesta) {
  let aceptadas = generarArrayCalendario();
  let denegadas = generarArrayCalendario();
  for (let listaDiaN in calendario) {
    for (let horaDiaN in calendario[listaDiaN]) {
      if(calendario[listaDiaN][horaDiaN]) { // Este check es el que necesito ???
        denegadas[listaDiaN][horaDiaN] = propuesta[listaDiaN][horaDiaN]; // Un poco de lógica short-circuit aquí
      }
      else {
        aceptadas[listaDiaN][horaDiaN] = propuesta[listaDiaN][horaDiaN]; // Otro poco de lógica short-circuit aquí
      }
    }
  }
  
  return [aceptadas, denegadas];
}
