const OPERATORS = ['+', '-', '*'];

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomTerminal() {
  const terminals = ['x', '1', '2', '3', '4', '5'];
  return terminals[randomInt(terminals.length)];
}

function randomTree(depth = 0) {
  if (depth > 2 || Math.random() < 0.3) {
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

function fitness(program) {
  let error = 0;

  for (let x = -5; x <= 5; x++) {
    const expected = x * x + 2;
    const actual = evaluate(program, x);

    error += Math.abs(expected - actual);
  }

  return error;
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

  population.sort((a, b) => fitness(a) - fitness(b));

  const best = population[0];
  const bestFitness = fitness(best);

  postMessage({
    type: 'update',
    best,
    fitness: bestFitness,
    generation,
    expression: treeToString(best)
  });

  if (bestFitness <= 0 || generation >= 1000) {
    running = false;

    postMessage({
      type: 'finished',
      best,
      fitness: bestFitness,
      generation,
      expression: treeToString(best)
    });

    return;
  }

  const survivors = population.slice(0, 10);

  const next = [...survivors];

  while (next.length < population.length) {
    const parent = survivors[randomInt(survivors.length)];
    next.push(mutate(parent));
  }

  population = next;
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
