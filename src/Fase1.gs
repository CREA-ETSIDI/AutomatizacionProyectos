// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function ComprobacionInicial()
{
  let lastResponse = responses.getRange(lastRow, 1, 1, responses.getLastColumn()).getValues()[0]; //Almacenamos en un vector las respuestas a todas las preguntas de la última persona que ha rellenado el formulario
  let received_n_mats = [String(lastResponse[prjIndex.responsable.nMatricula])].concat(ArrayzarMatriculas(lastResponse[prjIndex.personal.nMatriculas])); //Incluimos los números de matrícula de los integrantes al vector
  let failed = ComprobarValidezMatriculas(received_n_mats);
  if(failed.length > 0)
  {
    console.log(failed);
    EnviarEmailErrorMatriculas(lastResponse[prjIndex.responsable.email], lastResponse[prjIndex.responsable.nombre], failed);
    return;
  }
  received_n_mats = ComprobarDuplicadosMatriculas(received_n_mats);
  if(received_n_mats.length != lastResponse[prjIndex.personal.cantidad])
  {
    EnviarEmailDiscrepanciaMatriculas(lastResponse[prjIndex.responsable.email], lastResponse[prjIndex.responsable.nombre], lastResponse[prjIndex.personal.cantidad], received_n_mats.length);
    return;
  }
  if(ComprobarSociosCREA(nMats) < 0.5 * received_n_mats.length)
  {
    EnviarEmailMuyPocosInscritos(lastResponse[prjIndex.responsable.email], lastResponse[prjIndex.responsable.nombre]);
  }
  EnviarMensajeSolicitudAprobacion(lastRow, lastResponse[prjIndex.responsable.nombre],lastResponse[prjIndex.titulo], lastResponse[prjIndex.descripcion], lastResponse[prjIndex.responsable.email]);
}
