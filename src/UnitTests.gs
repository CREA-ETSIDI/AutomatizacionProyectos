function StartUnitTesting() {
  let unitsToTest = [
    TestArrayzarMatriculas,
    TestComprobarSociosCREA,
    TestComprobarDuplicadosMatriculas
  ]; //Declaramos un array con las funciones que testean automáticamente que las unidades funcionen correctamente
  let pass = 0;
  unitsToTest.forEach(function(element, index){ //Recorre el vector de funciones y comprueba que todo funcione
    try{
      if(element())
      {
        pass++;
        console.log("Passed: " + pass + "/" + unitsToTest.length); //En caso de que las unidades se ejecuten satisfactoriamente, se indica por consola junto al número de tests aprobados
      }
      else
      {
        console.log("Failed " + index); //En caso de que alguna unidad se ejecute incorrectamente, se indica por consola su índice
      }
    }
    catch{
      console.log("Failed catastrophically " + index); //En caso de que alguna unidad se lance una excepción, se indica por consola su índice
    }
  });
  if(pass == unitsToTest.length)
  {
    console.log("All test passed"); //YAAAAY
  }
}

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
    if(JSON.stringify(ComprobarDuplicadosMatriculas(matriculas[i])) != JSON.stringify(["12345", "67890", "13579", "24680"]))
    {
      return false;
    }
  }
  return true;
}

function TestComprobarSociosCREA()
{
  for(let i = 0; i < n_mats.length; i++)
  {
    if(ComprobarSociosCREA(n_mats[i]) != i_mats[i]) //Comprueba que los números de matrícula almacenados en n_mats coincidan con sus índices o que devuelvan "false" si el número no está inscrito
    {
      return false;
    }
  }
  return true;
}

function test()
{
  let text = "0123456789";
  console.log(text.substring(2,7));
}
