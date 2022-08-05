// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

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
  MyLog(nMats);
  for(let i = 0; i < nMats.length; i++)
  {
    if((parseInt(nMats[i]) < 50000 || parseInt(nMats[i]) > 60000) && (nMats[i] != "210235")) //Si el número de matrícula recibido se sale del rango esperado se asume como inválido
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
  if(failed.length == 1) //Se generan textos distintos según sea en singular o plural
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
  MyLog(text);
  GmailApp.sendEmail(email, "Error en las matrículas introducidas", text);
  sendText(vocalProyectosID, scapeChars(nombre + " ha intentado inscribir su proyecto pero ha instroducido un número de matrícula que se ha detectado como inválido, habla con el responsable para asegurarte de que sea el caso"));
}

function EnviarEmailDiscrepanciaMatriculas(email, nombre, n_integrantes, n_matriculas)
{
  text = "Hola " + nombre + ".\nTe escribimos en relación al formulario de proyectos que has rellenado ya que el número de integrantes que has introducido (" + n_integrantes + ") no coincide con la cantidad de números de matrícula introducidos (" + n_matriculas + ") .\n\nEste correo se ha generado automágicamente, si crees que nuestro bot ha cometido un error, no dudes en ponerte en contacto con uno de nuestros humanos a través de telegram, whatsapp, discord, instagram, twitter o por la ETSIDI. De lo contrario, vuelve a rellenar el formulario introduciendo los datos correctamente, nosotros haremos como si esto no hubiese pasado ;)";
  GmailApp.sendEmail(email, "Error en las matrículas introducidas", text);
  sendText(vocalProyectosID, scapeChars(nombre + " ha intentado inscribir su proyecto pero ha metido menos números de matrícula que integrantes"));
}

//https://dev.to/huyddo/find-duplicate-or-repeat-elements-in-js-array-3cl3#:~:text=Using%20iteration,the%20array%20contains%20duplicate%20elements.
function RemoverDuplicadosMatriculas(nMats)
{
  for(let i = 0; i < nMats.length; i++)
  {
    if(nMats.indexOf(nMats[i]) != nMats.lastIndexOf(nMats[i]))
    {
      nMats.splice(nMats.lastIndexOf(nMats[i]), 1);
    }
  }
  return nMats;
}

function ComprobarSociosCREA(nMats)
{
  let inscritos = 0;
  for(let i = 0; i < nMats.length; i++)
  {
    if(ComprobarSocioCREA(nMats[i]))
    {
      inscritos++;
    }
  }
  return inscritos;
}

function EnviarEmailMuyPocosInscritos(email, nombre)
{
  text = "Hola " + nombre + ".\nTe escribimos en relación al formulario de proyectos que has rellenado ya que hemos detectado que menos del 50% de los integrantes están inscritos en el CREA, por lo que el proyecto no puede iniciar.\n\nEste correo se ha generado automágicamente, si crees que nuestro bot ha cometido un error, no dudes en ponerte en contacto con uno de nuestros humanos a través de telegram, whatsapp, discord, instagram, twitter o por la ETSIDI. De lo contrario, inscribios :v";
  GmailApp.sendEmail(email, "Error en las matrículas introducidas", text);
  sendText(vocalProyectosID, scapeChars(nombre + " ha intentado inscribir su proyecto pero menos del 50% están inscritos en el CREA"));
}

function EnviarMensajeSolicitudAprobacion(fila, nombre, integrantes, titulo, descripcion, email)
{
  let botones = {
    'inline_keyboard': [
      [{
        'text': '✅',
        'callback_data': 'pr11' + fila
      },{
        'text': '❌',
        'callback_data': 'pr10' + email
      }],
    ]
  };
  let gag = Math.random()>0.75?" (que por cierto, vaya mierda de nombre xD) ":" ";
  let texto = "Hola " + nombreVocalProyectos + ", El bot aquí presente viene a comentar que " + nombre + " quiere iniciar un proyecto llamado " + titulo + gag + "que consiste en " + descripcion + ". Y lo va a hacer junto a " + integrantes + ".\nAsí que... Qué dices? Se aprueba?"
  MyLog("Enviando")
  sendTextConBotones(vocalProyectosID, texto, botones);
  MyLog("Enviado")
}

//Detecta si las matrículas pertenecientes a un array son válidas, de lo contrario se encarga de avisar
function IsValid(received_n_mats){
  let failed = ComprobarValidezMatriculas(received_n_mats);
  if(failed.length > 0)
  {
    console.log(failed);
    EnviarEmailErrorMatriculas(lastResponse[prjIndex.responsable.email], lastResponse[prjIndex.responsable.nombre], failed);
    responses.getRange(my_Fila, prjIndex.estado + 1).setValue("Error: Matrícula inválida");
    return false;
  }
  return true;
}

//Detecta si el número de matrículas introducidas coincide con el número de participantes en el proyecto
function Nmatriculas_igual_a_Nintegrantes(received_n_mats, lastResponse){
  if(received_n_mats.length != lastResponse[prjIndex.personal.cantidad])
  {
    EnviarEmailDiscrepanciaMatriculas(lastResponse[prjIndex.responsable.email], lastResponse[prjIndex.responsable.nombre], lastResponse[prjIndex.personal.cantidad], received_n_mats.length);
    responses.getRange(my_Fila, prjIndex.estado + 1).setValue("Error: nMats != nIntegrantes");
    return false;
  }
  return true;
}

//Detecta si más de la mitad de los integrantes están inscritos en el CREA
function HaySuficientesInscritos(received_n_mats){
  if(ComprobarSociosCREA(received_n_mats) < 0.5 * received_n_mats.length)
  {
    EnviarEmailMuyPocosInscritos(lastResponse[prjIndex.responsable.email], lastResponse[prjIndex.responsable.nombre]);
    responses.getRange(my_Fila, prjIndex.estado + 1).setValue("Error: Muy pocos inscritos");
    return false;
  }
  return true;
}
