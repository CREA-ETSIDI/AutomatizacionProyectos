// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

//La fase #1 consiste en hacer userproofing detectando las posibles respuesta erróneas que se hayan introducido en el formulario

function ComprobacionInicial(){
  ComprobacionVector(lastRow);
}

function ComprobacionVector(my_Fila)
{
  responses.getRange(my_Fila, prjIndex.estado + 1).setValue("Iniciado");
  let lastResponse = responses.getRange(my_Fila, 1, 1, responses.getLastColumn()).getValues()[0]; //Respuestas de la última persona que ha rellenado el formulario
  let received_n_mats = [String(lastResponse[prjIndex.responsable.nMatricula])].concat(ArrayzarMatriculas(lastResponse[prjIndex.personal.nMatriculas])); //Números de matrícula de los integrantes
  received_n_mats = RemoverDuplicadosMatriculas(received_n_mats);
  MyLog("Números de matrícula detectados: " + String(received_n_mats));

  /*if(!IsValid(received_n_mats)){
    return;
  }*/ 

  if(!Nmatriculas_igual_a_Nintegrantes(received_n_mats, lastResponse)){
    return;
  }

  if(!HaySuficientesInscritos(received_n_mats)){
    return;
  }

  EnviarMensajeSolicitudAprobacion(my_Fila, lastResponse[prjIndex.responsable.nombre], lastResponse[prjIndex.personal.nombres],lastResponse[prjIndex.titulo], lastResponse[prjIndex.descripcion], lastResponse[prjIndex.responsable.email]);
  responses.getRange(my_Fila, prjIndex.estado + 1).setValue("Pendiente de aprobación por vocalía");
}
