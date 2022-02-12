let ss;
try
{
  ss = SpreadsheetApp.openById(formProyectos.getDestinationId()); //En caso de que exista hoja de cálculo de destino, la abre
}
catch //De lo contrario, lo crea y lo guarda
{
  Logger.log("No existe hoja de cálculo, creando hoja de vertido de respuestas")
  //Robadísimo de: https://developers.google.com/apps-script/reference/forms/destination-type && https://stackoverflow.com/questions/31739653/create-a-google-doc-file-directly-in-a-google-drive-folder
  ss = DriveApp.getFileById(SpreadsheetApp.create(formProyectos.getTitle() + "(respuestas)").getId()); //Crea una nueva hoja de cálculo en la carpeta raíz de drive
  sourceFolder.addFile(ss); //La almacena en la carpeta donde interesa
  DriveApp.getRootFolder().removeFile(ss); //Elimina la que queda en la carpeta raíz
  formProyectos.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId()); //Define esta hoja de cálculo como el destino del formulario de proyectos
  ss = SpreadsheetApp.openById(formProyectos.getDestinationId()); //Nos aseguramos de que la hoja de destino se haya creado correctamente
  ss.getSheets()[1].setName("En Curso").getRange(1,1,1,ss.getSheets()[0].getLastColumn() + 2).setValues([ss.getSheets()[0].getRange(1,1,1,ss.getSheets()[0].getLastColumn()).getValues()[0].concat(["ID", "Finalizado"])]);
}
const responses = ss.getSheetByName("Form Responses 1"); //Guarda la hoja de cálculo destino del form

if(ss.getSheetByName("En Curso") == null) //Si no existe la hoja "En curso"
{
  ss.insertSheet(1).setName("Depurado").setFrozenRows(1).getRange(1,1,1,ss.getSheets()[0].getLastColumn() + 2).setValues(ss.getSheets()[0].getRange(1,1,1,ss.getSheets()[0].getLastColumn()).getValues().concat(["ID", "Finalizado"])); //La crea y asigna el formato de la columna superior y congela la primera fila
}
const poolEnCurso = ss.getSheetByName("En Curso");

if(ss.getSheetByName("Horario") == null) //Si no existe la hoja "En curso"
{
  let temp = ss.insertSheet(2).setName("Horario");
  temp.deleteColumns(9,18); //La crea y da el formato correcto
  temp.deleteRows(15, 986);
  let valueMatrix = [["De", "", "A"]];
  for(let i = 8; i < 21; i++)
  {
    valueMatrix.push([String(i) + ":30", "-", String(i+1) + ":30"]);
  }
  Logger.log(valueMatrix);
  temp.getRange(1,1,14,3).setValues(valueMatrix);
  temp.getRange(1,4,1,5).setValues([["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]]);
}
const horarios = ss.getSheetByName("Horario").setColumnWidth(1,50).setColumnWidth(2,25).setColumnWidth(3,45).setColumnWidths(4,5,320).setRowHeights(1,14,50);

if(ss.getSheetByName("HorarioIDs") == null) //Si no existe la hoja "En curso"
{
  let temp = ss.insertSheet(3).setName("HorarioIDs");
  temp.deleteColumns(9,18); //La crea y da el formato correcto
  temp.deleteRows(15, 986);
  let valueMatrix = [["De", "", "A"]];
  for(let i = 8; i < 21; i++)
  {
    valueMatrix.push([String(i) + ":30", "-", String(i+1) + ":30"]);
  }
  temp.getRange(1,1,14,3).setValues(valueMatrix).getSheet().getRange(1,4,1,5).setValues([["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]]);
}
const horarioIDs  = ss.getSheetByName("HorarioIDs").setColumnWidth(1,40).setColumnWidth(2,11).setColumnWidth(3,40).setColumnWidths(4,5,65).setRowHeights(1,14,25);

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
  estado: 18,

  // Nombres deficientes de variable:
  herramientasMaterial: 10,
  herramientas: 11,
  material: 12
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

//Inscripccion
const emailIndex = 2;
const nombreIndex = 3;
const apellido1Index = 4;
const apellido2index = 5;
const nMatIndex = 6;
const dniIndex = 7;
const movilIndex = 8;

// Texto para firmar correo como automágico
const automagicoSignature = "\n --Este correo se ha generado automágicamente a partir de sus datos introducidos en el formulario.\n\
Si crees que nuestro bot ha cometido un error, no dudes en ponerte en contacto con uno de nuestros\
 humanos a través de telegram, whatsapp, discord, instagram, twitter o por la ETSIDI.\
\n\n\
Atentamente, CREABot 🤖 - Tu bot de poca confianza";
