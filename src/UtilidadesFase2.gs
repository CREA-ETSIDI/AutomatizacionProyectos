// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function getFranjasAceptadasDenegadas(calendario, propuesta) {
  /* Obtiene las franjas aceptadas y denegadas, o sea, las que coinciden y las que no, de una propuesta respecto de un calendario */
  // Problema dimensional aquí
  let aceptadas = generarArrayCalendario();
  let denegadas = generarArrayCalendario();
  for (let listaDiaN = 0; listaDiaN < 5; listaDiaN++) {
    for (let horaDiaN in calendario[listaDiaN]) {
      if(calendario[2 * listaDiaN][horaDiaN] > 0 && calendario[2 * listaDiaN + 1][horaDiaN] > 0) { // Este check es el que necesito ???
        denegadas[listaDiaN][horaDiaN] = propuesta[listaDiaN][horaDiaN]; // Un poco de lógica short-circuit aquí
      }
      else {
        aceptadas[listaDiaN][horaDiaN] = propuesta[listaDiaN][horaDiaN]; // Otro poco de lógica short-circuit aquí
      }
    }
  }
  
  return [aceptadas, denegadas];
}

function franjasToText(franja) {
  /* Convierte un array de franjas en un texto legible que indica cuáles hay por día */
  let tmpTxt = "";
  let escogidoAlguno = false;
  for (let dayN in franja[0]) {
    // Variable que almacena si para un día hay alguna franja escogida
    escogidoAlguno = false;

    // Comprobamos si hay algún día escogido, ya que de eso depende el output
    for (let franjaN in franja) {
      if (franja[franjaN][dayN]) {
        escogidoAlguno = true;
        break;
      }
    }

    if (escogidoAlguno) {
      tmpTxt += listaValuesDias[dayN] + ": ";
      for (let franjaN in franja) {
        if (franja[franjaN][dayN]) {
          tmpTxt += listaValuesHorario[franjaN] + ", ";
        }
      }
      // Eliminamos coma y espacio del final
      tmpTxt = tmpTxt.slice(0, -2);
      tmpTxt += "<br>";
    }
  }

  return tmpTxt;
}

function EnviarEmailFranjasAceptadas(franjasAceptadas, franjasDenegadas, datosProyecto, filaProyectoRaw){
  // Ahora debe informarse al líder del proyecto de cuáles se han aceptado y cuáles denegado
  let salt = Math.round(5000 * Math.random());
  let cuerpo = HtmlService.createHtmlOutput(("Hola, te informamos de los horarios que se pueden reservar y cuáles no de su previa solicitud: <br>Franjas reservadas:<br>"
  + franjasToText(franjasAceptadas)
  +"<br>Debido al protocolo de prevención covid, no podemos dejarte las siguientes franjas:<br>"
  + franjasToText(franjasDenegadas)
  +'<br><br>Si quieres continuar con el proceso de inscripción del proyecto pulsa <a href="'
  + queryAprobado(filaProyectoRaw, salt)
  +'">aquí</a>, de lo contrario, pulsa <a href="'
  + queryDenegado(filaProyectoRaw, salt)
  +'">aquí</a>'
  + automagicoSignature).replace("\n"," <br> <br> ")).getContent();
  GmailApp.sendEmail(datosProyecto[prjIndex.responsable.email],"Confirmar horario disponible para su proyecto " + datosProyecto[prjIndex.titulo], "", {htmlBody: cuerpo});
  console.info("Se ha enviado un correo a " + datosProyecto[prjIndex.responsable.nombre] + " para ver si acepta los horarios ")
}

function getFranjasOcupadas(){
  let raw = horarioIDs.getRange(2, 4, 13, 10).getValues();
  let output = new Array(13).fill(new Array(5));
  Logger.log(raw[0][0]=='');
  for(let x = 0; x < 5; x++){
    for(let y = 0; y < 13; y++){
      output[y][x] = !(raw[y][2*x]=='' && raw[y][2*x + 1]=='');
    }
  }
  Logger.log(output);
  return output;
}
