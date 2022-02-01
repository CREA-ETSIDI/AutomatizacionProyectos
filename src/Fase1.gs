// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function ComprobacionInicial()
{
  let lastResponse = responses.getRange(lastRow, 1, 1, responses.getLastColumn()).getValues()[0]; //Almacenamos en un vector las respuestas a todas las preguntas de la última persona que ha rellenado el formulario
  let received_n_mats = [String(lastResponse[nMatResponsableIndex-1])].concat(ArrayzarMatriculas(lastResponse[nMatIntegrantesIndex-1])); //Incluimos los números de matrícula de los integrantes al vector
  let failed = ComprobarValidezMatriculas(received_n_mats);
  if(failed.length > 0)
  {
    console.log(failed);
    EnviarEmailErrorMatriculas(lastResponse[senderEmailIndex-1], lastResponse[nombreResponsableIndex-1], failed);
    return;
  }
  received_n_mats = ComprobarDuplicadosMatriculas(received_n_mats);
  if(received_n_mats.length != lastResponse[nPersonasIndex-1])
  {
    EnviarEmailDiscrepanciaMatriculas(lastResponse[senderEmailIndex-1], lastResponse[nombreResponsableIndex-1], lastResponse[nPersonasIndex-1], received_n_mats.length);
    return;
  }
  if(ComprobarSociosCREA(nMats) < 0.5 * received_n_mats.length)
  {
    EnviarEmailMuyPocosInscritos(lastResponse[senderEmailIndex-1], lastResponse[nombreResponsableIndex-1]);
  }
  
}
