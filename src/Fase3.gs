// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

//La fase #3 consiste en finalizar el proceso y formalizar lo que queda

//Una vez que el responsable ha aceptado, se ocupan las franjas horarias correspondientes
function proyectoDecisionResponsable(filaProj, datosProyecto) {
  const opcionesHorasSolicitadas = [
    horariosParser(datosProyecto[prjIndex.franjasDias.lun]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mar]),
    horariosParser(datosProyecto[prjIndex.franjasDias.mie]),
    horariosParser(datosProyecto[prjIndex.franjasDias.jue]),
    horariosParser(datosProyecto[prjIndex.franjasDias.vie]),
  ] // Matriz con las horas seleccionadas en listas de strings

  //MyLog("Se ha aceptado el proyecto " + datosProyecto[prjIndex.titulo] + " en fila #" + filaProj + ". Moviendolo a lista de proyectos aceptados");

  //Ocupar las franjas en el horario
  const franjasSolicitadas = respuestasDiasToMatrix(opcionesHorasSolicitadas); // Matriz 13*5 de ceros y unos
  const franjasOcupadas = horarioIDs.getRange(2, 4, 13, 10).getValues(); // Franjas ya ocupadas por otros proyectos
  let nuevoHorario = JSON.parse(JSON.stringify(franjasOcupadas));

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
  datosProyecto = datosProyecto.slice(0, prjIndex.franjasDias.lun).concat(franjasAceptadas).concat(datosProyecto[prjIndex.franjasDias.vie + 1]).concat(filaProj).concat("0");
  poolEnCurso.appendRow(datosProyecto);
  horarioIDs.getRange(2,4,13,10).setValues(nuevoHorario);


  //prjToTimetable
  updateFormTimeQuestions(nuevoHorario);
  EnviarMensajeProyectoCreadoResponsable(datosProyecto);
  EnviarMensajeProyectoCreadoVocal(filaProj, datosProyecto);


  responses.getRange(lastRow, prjIndex.estado + 1).setValue("3"); //Set flag estado a 3
  return;
}

function updateFormTimeQuestions(originTimetable) {
  let form = FormApp.getActiveForm();
  let timeIDs = ["1073410961", "1043751643", "1937379817", "257979111", "2101640527"];
  for(i in timeIDs){
    let pregunta = form.getItemById(timeIDs[i]).asCheckboxItem();
    let answers = [pregunta.createChoice("Este día no")];
    for(let j = 0; j < horarioIDs.getLastRow()-1; j++){
      if(originTimetable[j][2*i] == 0 || originTimetable[j][2*i+1] == 0){
        answers.push(pregunta.createChoice(GeneradorHora(j+2)));
      }
    }
    pregunta.setChoices(answers);
  }
  return;
}
