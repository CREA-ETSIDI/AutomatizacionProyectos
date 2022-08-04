//Hoja de cálculo de vertido de respuestas
let ss;
try
{
  ss = SpreadsheetApp.openById(formProyectos.getDestinationId()); //En caso de que exista hoja de cálculo de destino, la abre
}
catch //De lo contrario, lo crea y lo guarda
{
  MyLog("No existe hoja de cálculo, creando hoja de vertido de respuestas");
  //Robadísimo de: https://developers.google.com/apps-script/reference/forms/destination-type && https://stackoverflow.com/questions/31739653/create-a-google-doc-file-directly-in-a-google-drive-folder
  ss = DriveApp.getFileById(SpreadsheetApp.create(formProyectos.getTitle() + "(respuestas)").getId()).moveTo(sourceFolder); //Crea una nueva hoja de cálculo en la carpeta raíz de drive
  formProyectos.removeDestination();
  formProyectos.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId()); //Define esta hoja de cálculo como el destino del formulario de proyectos
  ss = SpreadsheetApp.openById(formProyectos.getDestinationId()); //Nos aseguramos de que la hoja de destino se haya creado correctamente
  ss.getSheets()[1].setName("En Curso").getRange(1,1,1,ss.getSheets()[0].getLastColumn() + 2).setValues([ss.getSheets()[0].getRange(1,1,1,ss.getSheets()[0].getLastColumn()).getValues()[0].concat(["ID", "Finalizado"])]);
}
const responses = ss.getSheetByName("Form Responses 1"); //Guarda la hoja de cálculo destino del form

//Hoja de proyectos en curso
if(ss.getSheetByName("En Curso") == null)
{
  ss.insertSheet(1).setName("Depurado").setFrozenRows(1).getRange(1,1,1,ss.getSheets()[0].getLastColumn() + 2).setValues(ss.getSheets()[0].getRange(1,1,1,ss.getSheets()[0].getLastColumn()).getValues().concat(["ID", "Finalizado"])); //La crea y asigna el formato de la columna superior y congela la primera fila
}
const poolEnCurso = ss.getSheetByName("En Curso");


//Hoja de IDs de horario
if(ss.getSheetByName("HorarioIDs") == null) //Si no existe la hoja "HorarioIDs"
{
  let temp = ss.insertSheet(3).setName("HorarioIDs");
  temp.deleteColumns(14,13); //La crea y da el formato correcto
  temp.deleteRows(15, 986);
  let valueMatrix = [["De", "", "A"]];
  for(let i = 8; i < 21; i++)
  {
    valueMatrix.push([String(i) + ":30", "-", String(i+1) + ":30"]);
  }
  temp.getRange(1,1,14,3).setValues(valueMatrix);
  for(let i = 0; i < 5; i++){
    temp.getRange(1,4+2*i,1,2).merge().setValue(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][i]);
  }
  FormatoHorariosID(temp);
}
const horarioIDs  = ss.getSheetByName("HorarioIDs").setColumnWidths(1,3,40).setColumnWidth(2,11).setColumnWidths(4,10,32).setRowHeights(1,14,25);
ss = null; //#Safety

const lastRow = responses.getLastRow(); //Innecesiarísimo, pero creo que me ayudará a dejar el código más limpio

//Declaramos la columna en la que se encuentran las respuestas a cada pregunta, porque como el formulario seguirá cambiando pa rato, no tener que sufrir cambiando numeros individuales
//TL;DR: No queremos números mágicos

const prjIndex = { // Diccionario con indexes de una fila de proyecto EN EL ARRAY (sumar 1 para el spreadsheet)
  timestamp: 0,
  titulo: 2,
  descripcion: 3,
  responsable: {
    email: 1,
    nMatricula: 4,
    nombre: 5,
  },
  personal: {
    cantidad: 6,
    nMatriculas: 7,
    nombres: 8
  },
  esAcademico: 9,
  franjasDias: {
    lun: 13,
    mar: 14,
    mie: 15,
    jue: 16,
    vie: 17
  },
  estado: 19,

  // Nombres deficientes de variable:
  herramientasMaterial: 10,
  herramientas: 11,
  material: 12,
  ID: 19
};

const prjStatusNumber = {
  unSet: 0,
  aceptado: {
    porCREA: 10,
    porLider: 11
  },
  cancelado: {
    porCREA: 20,
    porLider: 21,
  },
  enCurso: 30,
  finalizado: 40,
  
};

const prjStatusTxt = {
  0: "Sin definir",

  10: "Aceptado por vocal (CREA)",
  11: "Aceptado por líder de proyecto",

  20: "Cancelado por vocal (CREA)",
  21: "Cancelado por líder de proyecto",

  30: "Aprobado y en curso",

  40: "Finalizado"
}

const listaValuesHorario = [
"8:30-9:30",
"9:30-10:30",
"10:30-11:30",
"11:30-12:30",
"12:30-13:30",
"13:30-14:30",
"14:30-15:30",
"15:30-16:30",
"16:30-17:30",
"17:30-18:30",
"18:30-19:30",
"19:30-20:30",
"20:30-21:30" ];
const listaValuesDias = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes"
];

// Texto para firmar correo como automágico
const automagicoSignature = "\n --Este correo se ha generado automágicamente a partir de sus datos introducidos en el formulario.\n\
Si crees que nuestro bot ha cometido un error, no dudes en ponerte en contacto con uno de nuestros\
 humanos a través de telegram, whatsapp, discord, instagram, twitter o por la ETSIDI.\
\n\n\
Atentamente, CREABot 🤖 - Tu bot de poca confianza";
