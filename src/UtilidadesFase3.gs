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
  let mensaje = "Hola " + nombreVocalProyectos + ", El bot aquí presente viene a comentar que el proyecto " + datosProyecto[prjIndex.titulo] + " oficialmente ya ha iniciado.\nEl equipo, integrado por: " + datosProyecto[prjIndex.responsable.nombre] + ", " + datosProyecto[prjIndex.personal.nombres] + " estará trabajando en las siguientes franjas horarias";
  sendText(vocalProyectosID,scapeChars(mensaje + "\n\n\\[inclusión de lista de franjas horarias aprobadas en el futuro, el rito de la linterna no se hace solo\\]"));
}
