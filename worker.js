const OPERATORS = ['+', '-', '*'];
let maxGenerations = 1000;
let populationSize = 100;
let minX = -5;
let maxX = 5;

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomTerminal() {
  const terminals = ['x', '1', '2', '3', '4', '5'];
  return terminals[randomInt(terminals.length)];
}

function randomTree(depth = 0) {
  if (depth > 4 || Math.random() < 0.2) {
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

  for (let x = minX; x <= maxX; x++) {

    const expected = x * x + 2;

    const actual = evaluate(program, x);

    error += Math.abs(expected - actual);
  }

  const complexityPenalty =
    treeSize(program) * 0.05;

  return {
    rawError: error,
    totalFitness: error + complexityPenalty
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

  if (Math.random() < 0.3) {
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
    if (Math.random() < 0.2) {
      return randomTerminal();
    }

    return node;
  }

  const child = clone(node);

  if (Math.random() < 0.15) {
    child.op = OPERATORS[randomInt(OPERATORS.length)];
  }

  child.left = mutate(child.left, depth + 1);
  child.right = mutate(child.right, depth + 1);

  if (Math.random() < 0.05 && depth < 2) {
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
    rawError <= 2 ||
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
  next.push(clone(best));

  // Breed new population
  while (next.length < population.length - 20) {

    const parentA =
      tournamentSelection(population);

    const parentB =
      tournamentSelection(population);

    let child =
      crossover(parentA, parentB);

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
    maxGenerations = msg.config.maxGenerations;
    populationSize = msg.config.populationSize;
    minX = msg.config.minX;
    maxX = msg.config.maxX;
    running = true;
    loop();
  }

  if (msg.type === 'stop') {
    running = false;
  }
};
