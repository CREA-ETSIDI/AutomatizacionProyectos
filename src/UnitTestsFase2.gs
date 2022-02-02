// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function test_proyectoAprobadoPorCREA() {
  const input = 2;
  proyectoAprobadoPorCREA(input);
}

function test_proyectoDecisionResponsable() {
  let aprobado = true;
  const filaRaw = 2;
  proyectoDecisionResponsable(aprobado, filaRaw);
}

function test_franjasToText() {
  let input = [ 
    [ 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0 ] ];
  let leOutput = franjasToText(input);
  console.log(leOutput);
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
    ["Martes no", "8:30-9:30", "9:30-10:30"], // Aquí los noes tan solo se ignoran, el resto va igual
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
