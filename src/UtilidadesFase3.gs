// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function GeneradorHora(row) {
  return String(horarioIDs.getRange(row,1).getDisplayValue()) + String(horarioIDs.getRange(row,2).getDisplayValue()) + String(horarioIDs.getRange(row,3).getDisplayValue())
}

function EnviarMensajeProyectoCreadoResponsable(filaProj){
  let text = "TU PROYECTO HA SIDO APROBADO!!\n\nPróximamente nuestra vocal de proyectos, CRIS✨, se pondrá en contacto contigo para reuniros, hacer un tour por nuestra sala y darte la huella para que puedas acceder en el horario asignado.\n\nAquí adjunto la documentación importante:\n- protocolo COVID (¡¡¡Respetalo!!! o el demonio de Verónica te maldecira)\n-Normativa proyectos\n\nY recuerda: no rompas cosas, no te mueras y diviértete!! :))))))))";
  let archivos = carpetaDocumentacion.getFiles();
  let archivosParaEnviar = [];
  while(archivos.hasNext()){
    archivosParaEnviar.push(archivos.next().getAs(MimeType.PDF));
  }
  GmailApp.sendEmail(responses.getRange(filaProj,prjIndex.responsable.email + 1).getValue(), "Proyecto aprobado super yay", text, {
    attachments: archivosParaEnviar
  })
}

function EnviarMensajeProyectoCreadoVocal(filaProj){
  let datosProyecto = responses.getRange(filaProj, 1, 1, responses.getLastColumn()).getValues()[0];
  let mensaje = "Hola " + nombreVocalProyectos + ", El bot aquí presente viene a comentar que el proyecto " + scapeCharsHard(datosProyecto[prjIndex.titulo]) + " con ID: *" + filaProj + "* oficialmente ya ha iniciado.\nEl equipo, integrado por: " + scapeCharsHard(datosProyecto[prjIndex.responsable.nombre]) + ", " + scapeCharsHard(datosProyecto[prjIndex.personal.nombres]) + " estará trabajando en las siguientes franjas horarias";
  let franjasHorarias = "\[inclusión de lista de franjas horarias aprobadas en el futuro, el trabajo de automatización industrial\\]";


  franjasHorarias = "";
  let index = parseInt(EncontradorDeIndices(poolEnCurso.getRange(2, prjIndex.ID + 1,lastRow-1).getValues(), filaProj)) + 2;
  MyLog(index);
  let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  let franjasAprobadas = poolEnCurso.getRange(index, prjIndex.franjasDias.lun + 1, 1, 5).getValues()[0];
  MyLog(franjasAprobadas);
  for(let iterador = 0; iterador < 5; iterador++){
    if(franjasAprobadas[iterador] != ""){
      franjasHorarias = franjasHorarias + "\n·" + dias[iterador] + ":" + franjasAprobadas[iterador];
    }
  }
  MyLog("Mensaje a enviar: " + String(scapeChars(mensaje + "\n\n" + franjasHorarias)));
  sendText(vocalProyectosID,scapeChars(mensaje + "\n\n" + franjasHorarias));
}
