// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

//La fase #2 consiste en finalizar el proceso y formalizar lo que queda

//Una vez que el responsable ha aceptado, se ocupan las franjas horarias correspondientes
function proyectoDecisionResponsable(filaProj) {
  let rangoProyecto = responses.getRange(filaProj, 1, 1, (prjIndex.estado + 1) - 1)
  let datosProyecto = rangoProyecto.getValues()[0];
  let opcionesHorasSolicitadas = [
    horariosParser(datosProyecto[prjIndex.franjasDias.lun]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mar]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mie]),
    horariosParser(datosProyecto[prjIndex.franjasDias.jue]),
    horariosParser(datosProyecto[prjIndex.franjasDias.vie]),
  ] // Matriz con las horas seleccionadas en listas de strings

  MyLog("Se ha aceptado el proyecto " + datosProyecto[prjIndex.titulo] + " en fila #" + filaProj + ". Moviendolo a lista de proyectos aceptados");

  // Añadir contenido al pool de proyectos en curso
  MyLog(poolEnCurso.getRange(poolEnCurso.getLastRow()+1, 1, 1, poolEnCurso.getLastColumn()).getValues()[0].length)
  MyLog([datosProyecto.concat(filaProj)][0].length);
  poolEnCurso.getRange(poolEnCurso.getLastRow()+1, 1, 1, poolEnCurso.getLastColumn()).setValues([datosProyecto.concat(filaProj).concat("0")]);

  //Ocupar las franjas en el horario
  let franjasSolicitadas = respuestasDiasToMatrix(opcionesHorasSolicitadas); // Matriz 13*5 de ceros y unos
  MyLog(franjasSolicitadas);
  let franjasOcupadas = horarioIDs.getRange(2, 4, 13, 10).getValues(); // Franjas ya ocupadas por otros proyectos
  MyLog(franjasOcupadas);
  let nuevoHorario = new Array(13).fill(new Array(10).fill(0));

  let franjasAceptadas = ["","","","",""];
  for(let y = 0; y < 13; y++){
    for(let x = 0; x < 10; x++)
    {
      if(franjasOcupadas[y][x] == false && franjasSolicitadas[y][Math.floor(x/2)] == true){
        nuevoHorario[y][x] = filaProj;
        franjasAceptadas[Math.floor(x/2)] += (", " + listaValuesHorario[y]);
        if(x%2 == 0){
          x++;
        }
      }
    }
  }
  MyLog(JSON.stringify(franjasAceptadas));
  MyLog(nuevoHorario);
  SpreadsheetApp.flush();
  poolEnCurso.getRange(poolEnCurso.getLastRow(),prjIndex.franjasDias.lun + 1, 1, 5).setValues([franjasAceptadas]);
  horarioIDs.getRange(2,4,13,10).setValues(nuevoHorario);
  prjToTimetable(filaProj);
  responses.getRange(lastRow, prjIndex.estado + 1).setValue("3"); //Set flag estado a 3
  return;
}

function prjToTimetable(filaProj) {
  updateFormTimeQuestions();
  EnviarMensajeProyectoCreadoResponsable(filaProj);
  EnviarMensajeProyectoCreadoVocal(filaProj);
}

function updateFormTimeQuestions() {
  let form = FormApp.getActiveForm();
  let timeIDs = ["1073410961", "1043751643", "1937379817", "257979111", "2101640527"];
  let originTimetable  = horarioIDs.getRange(2, 4, 13, 10).getValues();
  for(i in timeIDs){
    let pregunta = form.getItemById(timeIDs[i]).asCheckboxItem();
    let answers = [pregunta.createChoice("Este día no")];
    for(let j = 0; j < horarioIDs.getLastRow()-2; j++){
      if(originTimetable[j][2*i] == 0 || originTimetable[j][2*i+1] == 0){
        answers.push(pregunta.createChoice(GeneradorHora(j+2)));
      }
    }
    pregunta.setChoices(answers);
  }
  return;
}
