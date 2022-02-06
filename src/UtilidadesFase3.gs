// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function GeneradorHora(row) {
  return String(horarioIDs.getRange(row,1).getDisplayValue()) + String(horarioIDs.getRange(row,2).getDisplayValue()) + String(horarioIDs.getRange(row,3).getDisplayValue())
}

function EnviarMensajeProyectoCreadoResponsable(filaProj){

}

function EnviarMensajeProyectoCreadoVocal(filaProj){
  let datosProyecto = responses.getRange(filaProj, 1, 1, responses.getLastColumn()).getValues()[0];
  let mensaje = "Hola " + nombreVocalProyectos + ", El bot aquí presente viene a comentar que el proyecto " + datosProyecto[prjIndex.titulo] + " oficialmente ya ha iniciado.\nEl equipo, integrado por: " + datosProyecto[prjIndex.responsable.nombre] + ", " + datosProyecto[prjIndex.personal.nombres] + " estará trabajando en las siguientes franjas horarias";
  sendText(vocalProyectosID, mensaje)
}
