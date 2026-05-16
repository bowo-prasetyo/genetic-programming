const OPERATORS = ['+', '-', '*'];

  switch (program.op) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
  }

  return 0;
}

function fitness(program) {
  let error = 0;

  for (let x = -5; x <= 5; x++) {
    const expected = x * x + 2;
    const actual = evaluate(program, x);
    error += Math.abs(expected - actual);
  }

  return error;
}

function mutate(program) {
  const child = structuredClone(program);

  const part = randomInt(3);

  if (part === 0) child.left = randomGene();
  if (part === 1) child.op = OPERATORS[randomInt(OPERATORS.length)];
  if (part === 2) child.right = randomGene();

  return child;
}

let population = [];
let running = false;

function initPopulation(size = 100) {
  population = [];

  for (let i = 0; i < size; i++) {
    population.push(randomProgram());
  }
}

function evolve() {
  population.sort((a, b) => fitness(a) - fitness(b));

  const best = population[0];
  const bestFitness = fitness(best);

  const next = [best];

  while (next.length < population.length) {
    next.push(mutate(best));
  }

  population = next;

  postMessage({
    type: 'update',
    best,
    fitness: bestFitness
  });
}

function loop() {
  if (!running) return;

  evolve();

  setTimeout(loop, 50);
}

onmessage = (e) => {
  const msg = e.data;

  if (msg.type === 'start') {
    initPopulation();
    running = true;
    loop();
  }

  if (msg.type === 'stop') {
    running = false;
  }
};
