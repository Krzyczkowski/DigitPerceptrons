const perceptrons = [];
const noise_prob = 0.001;
class Perceptron {
  constructor(size = 48) {
    this.weights = new Array(size).fill(0.01);
    this.bias = 0.01; // bias (obciążenie)
    this.learningRate = 1; // współczynnik uczenia
    // dane dla kieszonki:
    this.pocketWeights = [...this.weights];
    this.pocketBias = this.bias;
    this.pocketScore = -Infinity;  // początkowy wynik dla kieszonki
  }


  // funkcja aktywacji perceptronu
  // przyjmuje jedynie matrix!
  activate(input) {
    let sum = this.bias;
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * this.weights[i];
    }
    return sum >= 0 ? 1 : -1; 
  }

  pocketActivate(input) {
    let sum = this.pocketBias;
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * this.pocketWeights[i];
    }
    return sum >= 0 ? 1 : -1;
  }

  // obliczanie trafności 
  evaluate(inputs, target) { 
    let correct = 0;
    inputs.forEach(input => {
      const output = this.activate(input.matrix);
      if(output===1 && input.target===target)
         correct++;
      if(output===-1 && input.target!=target)
         correct++;
    });
    return correct / inputs.length;
  }

  // uczenie z kieszonką (noisedInputs opcjonalne)
  train(inputs, target, noisedInputs) {
    //ponizszy kod słuzy zapewnieniu opcjonalnego dodania zaszumionych danych
    let validInputs = inputs;
    if(noisedInputs!= null){
      inputs = noisedInputs;
    }
    inputs.forEach((input)=>{
      const output = this.activate(input.matrix);

      let targetValue = -1;

      // jesli target czyli CYFRA perceptronu
      // jest rowna targetowi w zbiorze danych
      if(target==input.target) targetValue = 1;

      const error = targetValue - output;     
      
      if (error !== 0) {
        // obliczenie nowych wag
        for (let i = 0; i < this.weights.length; i++) {
          this.weights[i] += this.learningRate * error * input.matrix[i];
        }
        // obliczenie nowego biasu
        this.bias += this.learningRate * error;
      }

      // ocena modelu na podstawie validInputs czyli niezaszumionego zbioru
      const currentScore = this.evaluate(validInputs, target);

      // aktualizacja kieszonki
      if (currentScore > this.pocketScore) {
        this.pocketWeights = [...this.weights];
        this.pocketBias = this.bias;
        this.pocketScore = currentScore;
      }
  
      });
    
   
}
}
function noise(data, probability) {
    let dcopy = [...data];
    dcopy.forEach((pixel, index) => {
        if (Math.random() < probability) {
            // zmiana wartości
            dcopy[index] = dcopy[index] === 0 ? 1 : 0;
        }
    });

    return dcopy;
}

// funkcja pomocnicza dla danych
function dataForDigit(digit) {
  switch (digit) {
    case 0:
      return zero_data;
    case 1:
      return one_data;
    case 2:
      return two_data;
    case 3:
      return three_data;
    case 4:
      return four_data;
    case 5:
      return five_data;
    case 6:
      return six_data;
    case 7:
      return seven_data;
    case 8:
      return eight_data;
    case 9:
      return nine_data;
    default:
      return [];
  }
}
window.dataForDigit = dataForDigit;
const learnData = [
  zero_data,
  one_data,
  two_data,
  three_data,
  four_data,
  five_data,
  six_data,
  seven_data,
  eight_data,
  nine_data,
];

// preparing data
// flat data to tablica z wszystkimi danymi w postaci [ {matrix: [1,0,1,0 ...], target: 0 }, ...  ]
let flat_data = [];
learnData.forEach((data, index)=>{
  data.forEach(matrix =>{
    flat_data.push({matrix, target:index})
  });
});

for (let i = 0; i < 10; i++) {
  perceptrons.push(new Perceptron(6 * 8));
}

perceptrons.forEach((perceptron, perceptronIndex) => {
  for (// epoki
    let e = 0;
    e < 100;
    e++ 
  ) {

    // wersja bez szumu:
    // perceptron.train(flat_data,perceptronIndex);

    // wersja z szumem:
    let noised_flat_data = [];
    flat_data.forEach(data =>{
      noised_flat_data.push({matrix: noise(data.matrix,noise_prob), target: data.target});
    });
    perceptron.train(flat_data,perceptronIndex,noised_flat_data);
  }
});


// dane pomocnicze (test wewnętrzny)
const test_data = [
    [ // Zero
    1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
    1, 1, 0, 0, 1, 1,
    1, 1, 0, 0, 1, 1,
    1, 1, 0, 0, 1, 1,
    1, 1, 0, 0, 1, 1,
    1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
],
[  // jeden 
    0, 0, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0,
    ]
];
// (test wewnętrzny)
function test_perceptron(test_data) {
  for (const input of test_data) {
    for (let i = 0; i < perceptrons.length; i++) {
      console.log(i + ":" + perceptrons[i].pocketActivate(input));
    }
  }
}
test_perceptron(test_data);

// wypisanie na konsoli statystyk perceptronow
function print_perceptron_statistics(perceptrons){
  // bez kieszonki:
  console.log("staty bez kieszonki:\n");
  perceptrons.forEach( (perceptron, index) => {
   console.log("p"+ index + ": " + perceptron.evaluate(flat_data, index) * 100 + "%");
  })
  // z kieszonka:
  console.log("staty z kieszonką:\n");
  perceptrons.forEach( (perceptron, index) =>{
    console.log("p"+ index + ": " + perceptron.pocketScore * 100 + "%");
  })
}
print_perceptron_statistics(perceptrons);


function getPerceptronsStatistics(){
  return perceptrons.map(e =>{ return e.pocketScore});
}
window.getPerceptronsStatistics = getPerceptronsStatistics;


// funkcja do wywolywania w innym pliku na kazde nacisniecie w piksel
function perceptronsActivation(binary) {
  let results = [];
  for (let i = 0; i < perceptrons.length; i++) {
    results.push(perceptrons[i].pocketActivate(binary));
  }
  return results;
}

window.perceptronsActivation = perceptronsActivation;
