// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function prjToTimetable(prjRow) {
  updateNamedTimetableFromIDsTmtble();
  updateFormTimeQuestions();
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
  return;
}
