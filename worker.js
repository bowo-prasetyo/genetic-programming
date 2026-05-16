let targetFormula = "x*x + 2";
let OPERATORS = ['+', '-', '*'];
let minError = 0.1;
let maxGenerations = 1000;
let populationSize = 100;
let minX = -5;
let maxX = 5;
let mutationRate = 0.1;
let crossoverRate = 0.7;
let elitismRate = 0.05;
let tournamentSize = 5;
let treeDepth = 4;

function safeEvalFormula(formula, x) {
  try {
    return Function('x', `return ${formula};`)(x);
  } catch (e) {
    console.error("Invalid formula:", formula);
    return x;
  }
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomTerminal() {
  const terminals = ['x', '1', '2', '3', '4', '5'];
  return terminals[randomInt(terminals.length)];
}

function randomTree(depth = 0) {
  if (depth >= treeDepth || Math.random() < 0.2) {
    return randomTerminal();
  }

  return {
    op: OPERATORS[randomInt(OPERATORS.length)],
    left: randomTree(depth + 1),
    right: randomTree(depth + 1)
  };
}

function evaluate(node, x) {
  if (typeof node === 'string') {
    return node === 'x' ? x : Number(node);
  }

  const left = evaluate(node.left, x);
  const right = evaluate(node.right, x);

  switch (node.op) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return left / right;
  }

  return 0;
}

function treeSize(node) {
  if (typeof node === 'string') {
    return 1;
  }

  return 1 + treeSize(node.left) + treeSize(node.right);
}

function fitness(program) {

  let error = 0;
  let count = 0;

  for (let x = minX; x <= maxX; x++) {

    const expected = safeEvalFormula(targetFormula, x);
    const actual = evaluate(program, x);

    if (!Number.isFinite(expected) || !Number.isFinite(actual)) continue;

    const diff = Math.abs(expected - actual);

    if (!Number.isFinite(diff)) continue;

    error += diff;
    count++;
  }

  // ⚠️ prevent divide-by-zero collapse
  if (count === 0) {
    return {
      rawError: Infinity,
      totalFitness: Infinity
    };
  }

  const avgError = error / count;

  const complexityPenalty = treeSize(program) * 0.0; //0.05-->0.0

  const total = avgError + complexityPenalty;

  return {
    rawError: avgError,
    totalFitness: Number.isFinite(total) ? total : Infinity
  };
}

function tournamentSelection(population, size = 5) {
  let best = null;

  for (let i = 0; i < size; i++) {
    const candidate = population[randomInt(population.length)];

    if (
      !best ||
      fitness(candidate).totalFitness <
        fitness(best).totalFitness
    ) {
      best = candidate;
    }
  }

  return clone(best);
}

function crossover(a, b, depth = 0) {

  if (
    typeof a === 'string' ||
    typeof b === 'string'
  ) {
    return Math.random() < 0.5
      ? clone(a)
      : clone(b);
  }

  if (Math.random() < 1 - crossoverRate) {
    return clone(b);
  }

  return {
    op: Math.random() < 0.5 ? a.op : b.op,

    left: crossover(a.left, b.left, depth + 1),

    right: crossover(a.right, b.right, depth + 1)
  };
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function mutate(node, depth = 0) {
  if (typeof node === 'string') {
    if (Math.random() < mutationRate) {
      return randomTerminal();
    }

    return node;
  }

  const child = clone(node);

  if (Math.random() < mutationRate) {
    child.op = OPERATORS[randomInt(OPERATORS.length)];
  }

  child.left = mutate(child.left, depth + 1);
  child.right = mutate(child.right, depth + 1);

  if (Math.random() < mutationRate && depth < 2) {
    return randomTree(depth);
  }

  return child;
}

function treeToString(node) {
  if (typeof node === 'string') {
    return node;
  }

  return `(${treeToString(node.left)} ${node.op} ${treeToString(node.right)})`;
}

let population = [];
let running = false;
let generation = 0;

function initPopulation(size = 100) {
  population = [];
  generation = 0;

  for (let i = 0; i < size; i++) {
    population.push(randomTree());
  }
}

function evolve() {

  generation++;

  population.sort(
    (a, b) =>
      fitness(a).totalFitness -
      fitness(b).totalFitness
  );

  const best = population[0];
  const result = fitness(best);
  const bestFitness =
    result.totalFitness;
  const rawError =
    result.rawError;

  postMessage({
    type: 'update',
    best,
    fitness: bestFitness,
    rawError: rawError,
    generation,
    expression: treeToString(best)
  });

  if (
    rawError <= minError ||
    generation >= maxGenerations
  ) {
  
    running = false;

    postMessage({
      type: 'finished',
      best,
      fitness: bestFitness,
      rawError: rawError,
      generation,
      expression: treeToString(best)
    });

    return;
  }

  const next = [];

  // Elitism
  const eliteCount = Math.floor(population.length * elitismRate);
  
  for (let i = 0; i < eliteCount; i++) {
    next.push(clone(population[i]));
  }
  
  // Breed new population
  while (next.length < population.length - 20) {

    const parentA =
      tournamentSelection(population, tournamentSize);

    const parentB =
      tournamentSelection(population, tournamentSize);
    
    let child =
      Math.random() < crossoverRate
        ? crossover(parentA, parentB)
        : clone(parentA);

    if (Math.random() < mutationRate)
      child = mutate(child);

    next.push(child);
  }

  // Random immigrants
  for (let i = 0; i < 20; i++) {
    next.push(randomTree());
  }

  population = next;
}

function loop() {
  if (!running) return;

  if (generation >= maxGenerations) {
    running = false;
    return;
  }

  evolve();
  setTimeout(loop, 50);
}

onmessage = (e) => {
  const msg = e.data;
  
  if (msg.type === 'start') {
    initPopulation(populationSize);
    targetFormula = msg.config.targetFormula;
    minError = msg.config.minError;
    maxGenerations = msg.config.maxGenerations;
    populationSize = msg.config.populationSize;
    minX = msg.config.minX;
    maxX = msg.config.maxX;
    OPERATORS = msg.config.operators;
    if (!OPERATORS || OPERATORS.length === 0) {
      OPERATORS = ['+', '-', '*'];
    }
    mutationRate = msg.config.mutationRate;
    crossoverRate = msg.config.crossoverRate;
    elitismRate = msg.config.elitismRate;
    tournamentSize = msg.config.tournamentSize;
    treeDepth = msg.config.treeDepth;
    running = true;
    loop();
  }

  if (msg.type === 'stop') {
    running = false;
  }
};
