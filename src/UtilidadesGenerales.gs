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

function establecerEstadoProy(filaProj, estado) {
  responses.getRange(filaProj, prjIndex.estado +1).setValue(prjStatusTxt[estado]);
  return;
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

//Funciones básicas Telegram
function sendText(id, mensaje){
  var data = {
    method: 'post',
    payload: {
      method: 'sendMessage',
      chat_id: String(id),
      text: mensaje,
      parse_mode: 'MarkdownV2'
    }
  }
  let nuevomensaje = UrlFetchApp.fetch(telegramUrl + '/', data);
  return nuevomensaje;
}

function sendTextConBotones(id, mensaje, botones){
  botones = JSON.stringify(botones);
  var data = {
    method: 'post',
    payload: {
      method: 'sendMessage',
      chat_id: String(id),
      text: mensaje,
      reply_markup: botones
    }
  }
  let nuevomensaje = UrlFetchApp.fetch(telegramUrl + '/', data);
  return nuevomensaje;
}

function editText(mychat_id, mymessage_id, mensaje){
  var data = {
    method: 'post',
    payload: {
      method: 'editMessageText',
      chat_id: String(mychat_id),
      message_id: String(mymessage_id),
      text: mensaje
    }
  }
  return nuevomensaje = UrlFetchApp.fetch(telegramUrl + '/', data);
}

function editTextConBotones(mychat_id, mymessage_id, mensaje, botones){
  botones = JSON.stringify(botones);
  var data = {
    method: 'post',
    payload: {
      method: 'editMessageText',
      chat_id: String(mychat_id),
      message_id: String(mymessage_id),
      text: mensaje,
      reply_markup: botones
    }
  }
  return nuevomensaje = UrlFetchApp.fetch(telegramUrl + '/', data);
}

function scapeChars(text){
  let caracteresProhibidos = ['>', '#', '+', '-', '=', '{', '}', '.', ',', '!'] //No se incluyen los caracteres * _ ~ ` [] () ya que se usan en el markdown
  //let caracteresProhibidos = ['*', '_', '~', "`", '[', ']', '(', ')', '#', '+', '-', '=', '{', '}', '.', ',', '!'] //No se incluyen el caracter > ya que se usan en el HTML
  for(let i = 0; i < caracteresProhibidos.length; i++)
  {
    let nextCharBase = 0;
    let nextCharIndex = text.slice(nextCharBase).indexOf(caracteresProhibidos[i]);
    while(nextCharIndex > -1 && nextCharIndex > nextCharBase)
    {
      text = text.slice(0, nextCharIndex) + "\\" +  text.slice(nextCharIndex); //Son 2 barras porque una es el scape de la anterior
      nextCharBase = nextCharIndex + 3;
      nextCharIndex = text.slice(nextCharBase).indexOf(caracteresProhibidos[i]) + nextCharBase; //Al hacer la suma, si el index es  -1, entonces nextCharIndex < nextCharBase
    }
  }
  return text;
}

function verItems_IDs() {
  let form = FormApp.getActiveForm();
  let items = form.getItems();
  for (let i in items)
  {
    Logger.log(i+' '+items[i].getTitle()+': '+items[i].getId());
  }
}
