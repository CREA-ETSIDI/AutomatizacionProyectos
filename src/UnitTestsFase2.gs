// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function test_proyectoAprobadoPorCREA() {
  const input = 3;
  proyectoAprobadoPorCREA(input);
}

function test_proyectoDecisionResponsable() {
  let aprobado = true;
  const filaRaw = 3;
  proyectoDecisionResponsable(aprobado, filaRaw);
}

function test_franjasToText() {
  let ejemploMatrizFranjas = [
  // L  M  X  J  V
    [1, 0, 0, 0, 1], // 8:30-9:30
    [1, 0, 0, 0, 0], // 9:30-10:30
    [0, 0, 0, 0, 0], // 10:30-11:30
    [0, 0, 0, 0, 0], // 11:30-12:30
    [1, 0, 1, 0, 1], // 12:30-13:30
    [0, 0, 0, 0, 0], // 13:30-14:30
    [0, 0, 0, 0, 0], // 14:30-15:30
    [1, 0, 1, 0, 1], // 15:30-16:30
    [0, 0, 0, 0, 0], // 16:30-17:30
    [0, 0, 0, 0, 0], // 17:30-18:30
    [0, 0, 0, 0, 0], // 18:30-19:30
    [1, 0, 0, 0, 0], // 19:30-20:30
    [1, 1, 0, 0, 0]  // 20:30-21:30
  ];
  let leOutput = franjasToText(ejemploMatrizFranjas);
  console.log(leOutput);
}

function test_enviarEmailFranjas() {
  let ejemploMatrizFranjasAceptadas = [
  // L  M  X  J  V
    [1, 0, 0, 0, 1], // 8:30-9:30
    [1, 0, 0, 0, 0], // 9:30-10:30
    [0, 0, 0, 0, 0], // 10:30-11:30
    [0, 0, 0, 0, 0], // 11:30-12:30
    [1, 0, 1, 0, 1], // 12:30-13:30
    [0, 0, 0, 0, 0], // 13:30-14:30
    [0, 0, 0, 0, 0], // 14:30-15:30
    [1, 0, 1, 0, 1], // 15:30-16:30
    [0, 0, 0, 0, 0], // 16:30-17:30
    [0, 0, 0, 0, 0], // 17:30-18:30
    [0, 0, 0, 0, 0], // 18:30-19:30
    [1, 0, 0, 0, 0], // 19:30-20:30
    [1, 1, 0, 0, 0]  // 20:30-21:30
  ];
  let ejemploMatrizFranjasDenegadas = [
  // L  M  X  J  V
    [1, 0, 0, 0, 1], // 8:30-9:30
    [1, 0, 0, 0, 0], // 9:30-10:30
    [0, 0, 0, 0, 0], // 10:30-11:30
    [0, 0, 0, 0, 0], // 11:30-12:30
    [1, 0, 1, 0, 1], // 12:30-13:30
    [0, 0, 0, 0, 0], // 13:30-14:30
    [0, 0, 0, 0, 0], // 14:30-15:30
    [1, 0, 1, 0, 1], // 15:30-16:30
    [0, 0, 0, 0, 0], // 16:30-17:30
    [0, 0, 0, 0, 0], // 17:30-18:30
    [0, 0, 0, 0, 0], // 18:30-19:30
    [1, 0, 0, 0, 0], // 19:30-20:30
    [1, 1, 0, 0, 0]  // 20:30-21:30
  ];
  let datosProyecto = [];
  datosProyecto[prjIndex.titulo] = "Prueba de EnviarEmailFranjasAceptadas";
  datosProyecto[prjIndex.responsable.email] = Session.getEffectiveUser().getEmail();
  datosProyecto[prjIndex.responsable.nombre] = "un hermoso desarrollador de GAppScripts";
  EnviarEmailFranjasAceptadas(ejemploMatrizFranjasAceptadas, ejemploMatrizFranjasDenegadas, datosProyecto, 0); // Importante no tocar el 0
  return;
}

function test_horariosParser() {
  const input = [ // Por confirmar que es el posible input. Deben generarse desde el formulario.
      "Martes no, 13:30-14:30, 19:30-20:00",
      "8:30-9:30",
      "8:30-9:30, 14:30-15:30, 19:30-20:30",
      "Viernes no"
  ];

  let parsedOutput = [];

  for (let testCaseN in input) {
    parsedOutput = horariosParser(input[testCaseN]);
    console.log(testCaseN + ": " + input[testCaseN]);
    console.log(parsedOutput);
  }
}

function test_respuestasDiasToMatrix() {
  const input = [
    ["8:30-9:30", "13:30-14:30", "19:30-20:30"],
    ["13:30-14:30"],
    ["8:30-9:30"],
    ["Jueves no", "8:30-9:30", "9:30-10:30"], // Aquí los noes tan solo se ignoran, el resto va igual
    ["8:30-9:30", "14:30-15:30"]
  ]

  let parsedOutput = [];

  parsedOutput = respuestasDiasToMatrix(input);
  console.log(input);
  console.log(parsedOutput);
}

function shitty_test() {
  let index = listaValuesHorario.indexOf("13:30-14:30");
  console.log(index); // Me falta calle
}
