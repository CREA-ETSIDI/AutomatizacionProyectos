// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function horariosParser(horariosSelected) {
  /* Toma la respuesta en string de la hoja de respuestas, y la convierte en un array de strings de horas escogidas */
  // Si se ha elegido que ese día "no", devuelve undefined (se ignoran otras posibles respuestas)
  let splitList = horariosSelected.split(', ');

  if (splitList[0].indexOf("no") > -1){ // Es -1 cuando no la encuentra
    return;
  }
  return splitList;
}

function respuestasDiasToMatrix(diasStringList) {
  /* Convierte una lista de listas por cada día con las horas en las que se quiere acceder */ 
  /* Input: supuestamente un array con 5 arrays por cada día que tienen las horas, en strings, que se han seleccionado
  Output: supuestamente una matriz 5*13 que indica con trues que intervalos han sido seleccionados */
  let matriz = generarArrayCalendario();

  for (dayN in diasStringList) { // Para cada dia dentro del array de entrada, analizaremos que horas se han cogido
    let diaList = diasStringList[dayN]; // Array de respuestas del día dayN
    for (i in diaList) { // Para cada elemento, supondremos que una string como "9:30-10:30", buscamos donde hay que meterlo en matriz
      let franjaToCheck = diaList[i]; // Esta es la string con la franja en específico
      let index = listaValuesHorario.indexOf(franjaToCheck); // Para cada string de estas, obtenemos el índice que le toca. Véase listaValuesHorario en CENSURADO.gs
      if (index != -1) { // O sea, si resulta que es -1 es que no lo encuentra, pues: si lo encuentra...
        matriz[index][dayN] = 1; // Mete en el array del día de matriz, en la posición index, eso, creo que no me explico
      }
    }
  }

  return matriz;
}

function getFranjasAceptadasDenegadas(calendario, propuesta) {
  /* Obtiene las franjas aceptadas y denegadas, o sea, las que coinciden y las que no, de una propuesta respecto de un calendario */
  // Problema dimensional aquí
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

function franjasToText(franja) {
  /* Convierte un array de franjas en un texto legible que indica cuáles hay por día */
  let tmpTxt = "";
  let escogidoAlguno = false;
  for (let dayN in franja[0]) {
    escogidoAlguno = false;
    tmpTxt += listaValuesDias[dayN] + ": ";
    for (let franjaN in franja) {
      if (franja[franjaN][dayN]) {
        escogidoAlguno = true;
        tmpTxt += listaValuesHorario[franjaN] + ", ";
      }
    }
    if (!escogidoAlguno) {
      tmpTxt += "Nada que mostrar";
    }
    else {
      // Eliminamos coma y espacio del final
      tmpTxt = tmpTxt.slice(0, -2);
    }
    tmpTxt += "\n";
  }

  return tmpTxt;
}

function addFranjasToCalendarioSheet(matrizFranjas, proyID) {
  /* Toma una matriz numérica de franjas y las mete al calendario */
  // Problema dimensional aquí
  for (let listaDiaN in matrizFranjas) {
    for (let horaDiaN in matrizFranjas[listaDiaN]) {
      if(!matrizFranjas[listaDiaN][horaDiaN]) { // Este check es el que necesito ???
        horarios.getRange(2+horaDiaN, 4+listaDiaN).setValue(proyID); // Ponemos el ID del proyecto para que luego sea más fácil hacer una búsqueda inversa
      }
    }
  }
}

function EnviarEmailFranjasAceptadas(franjasAceptadas, franjasDenegadas, datosProyecto){
  // Ahora debe informarse al líder del proyecto de cuáles se han aceptado y cuáles denegado
  let tmpCorreoProcesamientoSolicitudes = "Hola, te informamos de los horarios que se pueden reservar y cuáles no de su previa solicitud: \nFranjas reservadas:\n"
  + franjasToText(franjasAceptadas)
  +"\nDebido al protocolo de prevención covid, no podemos dejarte las siguientes franjas:\n"
  + franjasToText(franjasDenegadas)
  + automagicoSignature;

  GmailApp.sendEmail(datosProyecto[proyIndex.responsable.email],"Confirmar horario disponible para su proyecto " + datosProyecto[proyIndex.titulo], tmpCorreoProcesamientoSolicitudes);

  console.info("Se ha enviado un correo a " + datosProyecto[proyIndex.responsable.nombre] + " para ver si acepta los horarios ")
}
