// Copyright Club de Robótica y Electrónica 2022.
// Licensed under the EUPL-1.2

function StartUnitTesting() {
  let unitsToTest = [
    TestArrayzarMatriculas,
    TestComprobarSocioCREA,
    TestComprobarDuplicadosMatriculas,
    Test_horariosParser,
    Test_respuestasDiasToMatrix
  ]; //Declaramos un array con las funciones que testean automáticamente que las unidades funcionen correctamente
  let pass = 0;
  unitsToTest.forEach(function(element, index){ //Recorre el vector de funciones y comprueba que todo funcione
    try{
      if(element())
      {
        pass++;
        console.log("Superados: " + pass + "/" + unitsToTest.length); //En caso de que las unidades se ejecuten satisfactoriamente, se indica por consola junto al número de tests aprobados
      }
      else
      {
        console.log("Test #" + index + 1 + " Fallido"); //En caso de que alguna unidad se ejecute incorrectamente, se indica por consola su índice
      }
    }
    catch{
      console.log("Test #" + index + 1 + " Fallido catastróficamente"); //En caso de que alguna unidad se lance una excepción, se indica por consola su índice
    }
  });
  if(pass == unitsToTest.length)
  {
    console.log("Tests superados exitosamente"); //YAAAAY
  }
}

///////////
//Fase #1//
///////////

function TestArrayzarMatriculas()
{
  let textos = [
    "12345, 67890, 13579, 24680",
    "12345,67890,13579,24680",
    "12345-67890-13579-24680",
    "12345 67890 13579 24680"
  ]

  for(let i = 0; i < textos.length; i++)
  {
    if(JSON.stringify(ArrayzarMatriculas(textos[i])) != JSON.stringify(["12345", "67890", "13579", "24680"])) //Compara que las matrículas arrayzadas coincidan con el resultado esperado
    {
      return false;
    }
  }
  return true;
}

function TestComprobarDuplicadosMatriculas()
{
  let matriculas = [
    ["12345", "67890", "12345", "13579", "24680"],
    ["12345", "67890", "13579", "24680", "12345"],
    ["12345", "67890", "13579", "24680", "24680"],
    ["12345", "12345", "67890", "13579", "24680"]
  ];
  for(let i = 0; i < matriculas.length; i++)
  {
    if(JSON.stringify(RemoverDuplicadosMatriculas(matriculas[i])) != JSON.stringify(["12345", "67890", "13579", "24680"]))
    {
      return false;
    }
  }
  return true;
}

function TestComprobarSocioCREA()
{
  for(let i = 0; i < n_mats.length; i++)
  {
    if(ComprobarSocioCREA(n_mats[i]) != i_mats[i]) //Comprueba que los números de matrícula almacenados en n_mats coincidan con sus índices o que devuelvan "false" si el número no está inscrito
    {
      return false;
    }
  }
  return true;
}

///////////
//Fase #2//
///////////

function Test_horariosParser() {
  const input = "10:30-11:30, 11:30-12:30, 12:30-13:30";
  const expected_output = ["10:30-11:30", "11:30-12:30", "12:30-13:30"];
  let output = horariosParser(input);
  return isEqual(output, expected_output);
}

function Test_respuestasDiasToMatrix() {
  const input = [
    ["8:30-9:30", "13:30-14:30", "19:30-20:30"],
    ["13:30-14:30"],
    ["8:30-9:30"],
    [null],
    ["8:30-9:30", "14:30-15:30"]
  ];

  const expected_output = [
    [ 1, 0, 1, 0, 1 ],
    [ 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0 ],
    [ 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0 ]
  ];

  let parsedOutput = [];

  parsedOutput = respuestasDiasToMatrix(input);

  return isEqual(parsedOutput, expected_output);
}
