Copyright Club de Robótica y Electrónica 2022.
Licensed under the EUPL-1.2

function Fase1()
{
  //DoStuff
  ComprobarSociosCREA();
}

function ComprobarSociosCREA(numeroMat)
{
  for(let i = 1; i <= inscripciones.getLastRow(); i++)
  {
    if(numeroMat == inscripciones.getRange(i, 5).getValue)
    {
      return i;
    }
  }
  return false;
}