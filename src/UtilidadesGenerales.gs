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
