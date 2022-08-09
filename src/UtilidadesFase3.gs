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
  /* Input: Un array con 5 arrays por cada día que tienen las horas, en strings, que se han seleccionado
  Output: Una matriz 5*13 que indica con trues que intervalos han sido seleccionados */
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

function GeneradorHora(row) {
  return String(horarioIDs.getRange(row,1).getDisplayValue()) + String(horarioIDs.getRange(row,2).getDisplayValue()) + String(horarioIDs.getRange(row,3).getDisplayValue())
}

function EnviarMensajeProyectoCreadoResponsable(datosProyecto){
  let text = "TU PROYECTO HA SIDO APROBADO!!\n\nPróximamente nuestra vocal de proyectos, CRIS✨, se pondrá en contacto contigo para reuniros, hacer un tour por nuestra sala y darte la huella para que puedas acceder en el horario asignado.\n\nAquí adjunto la documentación importante:\n- protocolo COVID (¡¡¡Respetalo!!! o el demonio de Verónica te maldecira)\n-Normativa proyectos\n\nY recuerda: no rompas cosas, no te mueras y diviértete!! :))))))))";
  let archivos = carpetaDocumentacion.getFiles();
  let archivosParaEnviar = [];
  while(archivos.hasNext()){
    archivosParaEnviar.push(archivos.next().getAs(MimeType.PDF));
  }
  GmailApp.sendEmail(datosProyecto[prjIndex.responsable.email], "Proyecto aprobado super yay", text, {
    attachments: archivosParaEnviar
  })
}

function EnviarMensajeProyectoCreadoVocal(filaProj, datosProyecto){
  let mensaje = "Hola " + nombreVocalProyectos + ", El bot aquí presente viene a comentar que el proyecto " + scapeCharsHard(datosProyecto[prjIndex.titulo]) + " con ID: *" + filaProj + "* oficialmente ya ha iniciado.\nEl equipo, integrado por: " + scapeCharsHard(datosProyecto[prjIndex.responsable.nombre]) + ", " + scapeCharsHard(datosProyecto[prjIndex.personal.nombres]) + " estará trabajando en las siguientes franjas horarias:\n";
  let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  let franjasAprobadas = datosProyecto.slice(prjIndex.franjasDias.lun, prjIndex.franjasDias.vie + 1);
  for(let iterador = 0; iterador < 5; iterador++){
    if(franjasAprobadas[iterador] != ""){
      mensaje = mensaje + "\n·" + dias[iterador] + ": " + franjasAprobadas[iterador].slice(2);
    }
  }
  sendText(vocalProyectosID,scapeChars(mensaje));
}
