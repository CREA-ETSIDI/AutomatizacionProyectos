// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function prjToTimetable(filaProj) {
  updateNamedTimetableFromIDsTmtble();
  updateFormTimeQuestions();
  EnviarMensajeProyectoCreadoResponsable(filaProj);
  EnviarMensajeProyectoCreadoVocal(filaProj);
}

function updateNamedTimetableFromIDsTmtble() {
  let originPrjctRange = responses.getRange(1, 1, responses.getLastRow(), responses.getLastColumn()).getValues(); // datos de todos los proyectos
  let originTimetable  = horarioIDs.getRange(2, 4, 13, 5).getValues(); // valores de todas las IDs en el calendario
  let namedTmtbleArray = generarArrayCalendario(); // un array vacío con las dimensiones de un horario, al que se meten los nombres
  let namedTimetable   = horarios.getRange(2, 4, 13, 5);
  let prjctData = "";
  let prjctID   = 0;
  let allNames  = "";

  for (let franjaN in originTimetable) {
    for (let diaN in originTimetable[0]) {
      prjctID = originTimetable[franjaN][diaN];
      if (prjctID <= 1) {
        if (prjctID == 1) {
          console.warn("ID1 (no ocupar) encontrada en " + franjaN + " " + diaN);
        }
        continue;
      }
      prjctData = originPrjctRange[prjctID - 1];
      allNames = prjctData[prjIndex.responsable.nombre] + " (responsable), " + prjctData[prjIndex.personal.nombres];
      namedTmtbleArray[franjaN][diaN] = allNames;
    }
  }

  namedTimetable.setValues(namedTmtbleArray);
  return;
}

function updateFormTimeQuestions() {
  let form = FormApp.getActiveForm();
  let timeIDs = ["1078195515", "1480306668", "2587648", "477819459", "1481751245"];
  let originTimetable  = horarioIDs.getRange(2, 4, 13, 5).getValues();
  for(i in timeIDs){
    let pregunta = form.getItemById(timeIDs[i]).asCheckboxItem();
    let answers = [pregunta.createChoice("Este día no")];
    for(let j = 0; j < horarioIDs.getLastRow()-2; j++){
      if(originTimetable[j][i] < 1){
        answers.push(pregunta.createChoice(GeneradorHora(j+2)));
      }
    }
    pregunta.setChoices(answers);
  }
  return;
}
