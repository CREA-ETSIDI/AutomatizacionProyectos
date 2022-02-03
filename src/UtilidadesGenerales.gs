// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function isNumber(char)
{
  if(char >= '0' && char <= '9')
  {
    return true;
  }
  return false;
}

function ComprobarSocioCREA(numeroMat)
{
  let numerosMat = inscripciones.getRange(2, nMatIndex, inscripciones.getLastRow()-1).getValues();
  for(let i = 0; i < numerosMat.length; i++)
  {
    if(numeroMat == numerosMat[i][0])
    {
      return i + 2;
    }
  }
  return false;
}

function generarArrayCalendario() { // Genera un array de ceros de 5días * [13]franjas
  /*let array = new Array(5).fill(0); // Días de la semana
  let matriz = []; // Franjas en un día
  for (let i = 0; i < 13; i++) {
    matriz.push(array);
  }*/
  let matriz = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]
  return matriz;
}
