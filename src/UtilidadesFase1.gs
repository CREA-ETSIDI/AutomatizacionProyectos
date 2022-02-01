//LicenseDisclaimer
function ArrayzarMatriculas(texto)
{
  texto = texto + " "; //Añadimos un espacio al final del texto para tener un caracter no numérico que acabe el string (a falta de un buen '\0'...)
  let myArray = []; //Se declara array que se devolverá
  let isMat = false; //Se declara flag que indica si se está reconociendo un número en deteminado punto (o en su defecto, un separador)
  let start = 0; //Se almacenará el índice en el que inician los números de matrícula
  let end = 0;   //Se almacenará el índice en el que acaban  los números de matrícula
  for(let i = 0; i < texto.length + 1; i++)//Recorremos el string
  {
    if(isNumber(texto[i]) && !isMat) //Al detectar un caracter numérico, esto significa que es el índice en el que inicia el número de matrícula
    {
      isMat = true;
      start = i;
    }
    else if(!isNumber(texto[i]) && isMat) //Al detectar un caracter no numérico, esto significa que el anterior era el último del número de matrícula
    {
      isMat = false;
      end = i;
      myArray.push(String(texto).substring(start, end)); //Al terminar de reconocer un número de matrícula se añade al vector
    }//podría ahorrar trabajo asumiendo que los números de matrícula tienen 5 dígitos, pero esto no será necesariamente así en el futuro cercano
  }
  return myArray;
}

function ComprobarValidezMatriculas(nMats)
{
  let failedMats = [];
  for(let i = 0; i < nMats.length; i++)
  {
    if(parseInt(nMats[i]) < 50000 || parseInt(nMats[i]) > 60000) //Si el número de matrícula recibido se sale del rango esperado se asume como inválido
    {
      failedMats.push(nMats[i]);
    }
  }
  return failedMats;
}

function EnviarEmailErrorMatriculas(email, nombre, failed)
{
  console.log(email);
  let text = "Loren Ipsum";
  if(failed.length == 1)
  {
    text = "Hola " + nombre + ".\nTe escribimos en relación al formulario de proyectos que has rellenado ya que uno de los números de matrícula que has introducido no es válido. El número introducido en cuestión es: " + failed[0] + ".\n\nEste correo se ha generado automágicamente, si crees que nuestro bot ha cometido un error, no dudes en ponerte en contacto con uno de nuestros humanos a través de telegram, whatsapp, discord, instagram, twitter o por la ETSIDI. De lo contrario, vuelve a rellenar el formulario introduciendo los datos correctamente, nosotros haremos como si esto no hubiese pasado ;)";
  }
  else
  {
    text = "Hola " + nombre + ".\nTe escribimos en relación al formulario de proyectos que has rellenado ya que algunos de los números de matrícula que has introducido no son válidos. Los números introducidos en cuestión son: "
    for(let i = 0; i < failed.length; i++)
    {
      text = text + failed[i] + ", ";
    }
    text = text.slice(0, -2) + "\n\nEste correo se ha generado automágicamente, si crees que nuestro bot ha cometido un error, no dudes en ponerte en contacto con uno de nuestros humanos a través de telegram, whatsapp, discord, instagram, twitter o por la ETSIDI. De lo contrario, vuelve a rellenar el formulario introduciendo los datos correctamente, nosotros haremos como si esto no hubiese pasado ;)";
  }
  GmailApp.sendEmail(email, "Error en las matrículas introducidas", text);
}

function ComprobarSociosCREA(numeroMat)
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
