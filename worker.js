const OP_ARITY = {
  '+': 2,
  '-': 2,
  '*': 2,
  '/': 2,
  'pow': 2,
  'sin': 1,
  'cos': 1,
  'tan': 1,
  'sinh': 1,
  'cosh': 1,
  'tanh': 1,
  'asin': 1,
  'acos': 1,
  'atan': 1,
  'asinh': 1,
  'acosh': 1,
  'atanh': 1,
  'log': 1,
  'log2': 1,
  'log10': 1,
  'exp': 1,
  'sqrt': 1,
  'cbrt': 1
};

let targetFormula = "x*x + 2";
let OPERATORS = [{
    symbol: '+',
    arity: 2
  },
  {
    symbol: '-',
    arity: 2
  },
  {
    symbol: '*',
    arity: 2
  }
];
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
let dataMode = 'formula';
let dataset = [];

const fitnessCache = new Map();

function getFitness(node) {
  const key = JSON.stringify(node);

  if (fitnessCache.has(key)) {
    return fitnessCache.get(key);
  }

  const f = fitness(node);
  fitnessCache.set(key, f);
  return f;
}

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

  // 50% variable
  if (Math.random() < 0.5) {
    return 'x';
  }

  // ERC: random constant
  const value =
    (Math.random() * 20 - 10);

  return value.toFixed(3);
}

function randomTree(depth = 0) {

  if (depth >= treeDepth || Math.random() < 0.2) {
    return randomTerminal();
  }

  const op =
    OPERATORS[randomInt(OPERATORS.length)];

  if (op.arity === 1) {
    return {
      op: op.symbol,
      child: randomTree(depth + 1)
    };
  }

  return {
    op: op.symbol,
    left: randomTree(depth + 1),
    right: randomTree(depth + 1)
  };
}

function evaluate(node, x) {

  if (typeof node === 'string') {
    return node === 'x' ?
      x :
      Number(node);
  }

  // unary operators
  if (node.child) {

    const v = evaluate(node.child, x);

    switch (node.op) {
      case 'sin':
        return Math.sin(v);
      case 'cos':
        return Math.cos(v);
      case 'tan':
        return Math.tan(v);
      case 'sinh':
        return Math.sinh(v);
      case 'cosh':
        return Math.cosh(v);
      case 'tanh':
        return Math.tanh(v);
      case 'asin':
        return Math.asin(v);
      case 'acos':
        return Math.acos(v);
      case 'atan':
        return Math.atan(v);
      case 'asinh':
        return Math.asinh(v);
      case 'acosh':
        return Math.acosh(v);
      case 'atanh':
        return Math.atanh(v);
      case 'log':
        return Math.log(v);
      case 'log2':
        return Math.log2(v);
      case 'log10':
        return Math.log10(v);
      case 'exp':
        return Math.exp(v);
      case 'sqrt':
        return Math.sqrt(v);
      case 'cbrt':
        return Math.cbrt(v);
    }
  }

  // binary operators
  const left =
    evaluate(node.left, x);

  const right =
    evaluate(node.right, x);

  switch (node.op) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
    case 'pow':
      return Math.pow(left, right);
  }

  return 0;
}

function treeSize(node) {

  if (typeof node === 'string') {
    return 1;
  }

  if (node.child) {
    return 1 + treeSize(node.child);
  }

  return (
    1 +
    treeSize(node.left) +
    treeSize(node.right)
  );
}

function generateFormulaSamples() {

  const samples = [];

  for (
    let x = minX; x <= maxX; x++
  ) {

    const y =
      safeEvalFormula(
        targetFormula,
        x
      );

    samples.push({
      x,
      y
    });
  }

  return samples;
}

function fitness(program) {

  let points = [];

  // =========================
  // BUILD DATASET
  // =========================

  if (dataMode === 'dataset') {

    points = dataset;

  } else {

    for (let x = minX; x <= maxX; x++) {

      const y =
        safeEvalFormula(targetFormula, x);

      if (Number.isFinite(y)) {
        points.push({
          x,
          y
        });
      }
    }
  }

  if (points.length === 0) {
    return {
      rawError: Infinity,
      totalFitness: Infinity
    };
  }

  // =========================
  // MEAN OF Y
  // =========================

  let meanY = 0;

  for (const p of points) {
    meanY += p.y;
  }

  meanY /= points.length;

  // =========================
  // SS_tot and SS_res
  // =========================

  let ssTot = 0;
  let ssRes = 0;

  for (const p of points) {

    const predicted =
      evaluate(program, p.x);

    if (!Number.isFinite(predicted)) {
      return {
        rawError: Infinity,
        totalFitness: Infinity
      };
    }

    ssTot += Math.pow(p.y - meanY, 2);

    ssRes += Math.pow(p.y - predicted, 2);
  }

  // Prevent divide-by-zero
  if (ssTot === 0) {
    return {
      rawError: Infinity,
      totalFitness: Infinity
    };
  }

  // =========================
  // R²
  // =========================

  const r2 =
    1 - (ssRes / ssTot);

  // convert to minimization
  const error =
    1 - r2;

  // complexity penalty
  const complexityPenalty =
    treeSize(program) * 0.001;

  const totalFitness =
    error + complexityPenalty;

  return {
    rawError: error,
    r2,
    totalFitness
  };
}

function tournamentSelection(population, size = 5) {
  let best = null;
  let bestScore = Infinity;

  for (let i = 0; i < size; i++) {
    const candidate = population[randomInt(population.length)];
    const score = getFitness(candidate).totalFitness;

    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return clone(best);
}

function crossover(a, b) {

  // null safety
  if (a == null) return clone(b);
  if (b == null) return clone(a);

  // terminal safety
  if (
    typeof a === 'string' ||
    typeof b === 'string'
  ) {
    return Math.random() < 0.5 ?
      clone(a) :
      clone(b);
  }

  // unary node handling
  if (a.child || b.child) {

    const source =
      Math.random() < 0.5 ? a : b;

    return clone(source);
  }

  // binary node handling
  return {
    op: Math.random() < 0.5 ?
      a.op : b.op,

    left: crossover(a.left, b.left),

    right: crossover(a.right, b.right)
  };
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizeNode(node, depth = 0) {

  if (typeof node === 'string') {
    return node;
  }

  const unaryOps = ['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'asin', 'acos', 'atan', 'asinh', 'acosh', 'atanh', 'log', 'log2', 'log10', 'exp', 'sqrt', 'cbrt'];

  // unary operator
  if (unaryOps.includes(node.op)) {

    return {
      op: node.op,
      child: normalizeNode(
        node.child || node.left || node.right || randomTree(depth + 1),
        depth + 1
      )
    };
  }

  // binary operator
  return {
    op: node.op,
    left: normalizeNode(
      node.left || node.child || randomTree(depth + 1),
      depth + 1
    ),

    right: normalizeNode(
      node.right || randomTree(depth + 1),
      depth + 1
    )
  };
}

function mutate(node, depth = 0) {

  if (node == null) {
    return randomTree(depth);
  }

  if (typeof node === 'string') {

    // mutate terminal
    if (Math.random() < mutationRate) {

      // keep x sometimes
      if (node === 'x' && Math.random() < 0.5) {
        return 'x';
      }

      // numeric perturbation
      const n = Number(node);

      if (!isNaN(n)) {

        const delta =
          (Math.random() * 2 - 1);

        return (n + delta).toFixed(3);
      }

      return randomTerminal();
    }

    return node;
  }

  if (
    Math.random() < mutationRate &&
    depth < treeDepth
  ) {
    return randomTree(depth);
  }

  const child = clone(node);

  if (Math.random() < mutationRate) {

    const op =
      OPERATORS[randomInt(OPERATORS.length)];

    child.op = op.symbol;

    if (op.arity === 1) {

      delete child.left;
      delete child.right;

      child.child =
        child.child ||
        randomTree(depth + 1);

    } else {

      delete child.child;

      child.left =
        child.left ||
        randomTree(depth + 1);

      child.right =
        child.right ||
        randomTree(depth + 1);
    }
  }

  if (child.child) {
    child.child =
      mutate(child.child, depth + 1);
  } else {
    child.left =
      mutate(child.left, depth + 1);

    child.right =
      mutate(child.right, depth + 1);
  }

  return normalizeNode(child, depth);
}

function treeToString(node) {

  if (typeof node === 'string') {
    return node;
  }

  if (node.child) {
    return `${node.op}(${treeToString(node.child)})`;
  }

  if (node.op === 'pow') {
    return `pow(${treeToString(node.left)}, ${treeToString(node.right)})`;
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
    getFitness(a).totalFitness -
    getFitness(b).totalFitness
  );

  const best = population[0];
  const result = getFitness(best);
  const bestFitness =
    result.totalFitness;
  const rawError =
    result.rawError;

  postMessage({
    type: 'update',
    best,
    fitness: bestFitness,
    rawError: rawError,
    r2: result.r2,
    generation,
    expression: treeToString(best),
    population: clone(population)
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
      Math.random() < crossoverRate ?
      crossover(parentA, parentB) :
      clone(parentA);

    child = mutate(child);

    next.push(child);
  }

  // Random immigrants
  const immigrantCount = Math.floor(populationSize * 0.1);
  for (let i = 0; i < immigrantCount; i++) {
    next.push(randomTree());
  }

  while (next.length < populationSize) {
    next.push(clone(population[randomInt(population.length)]));
  }

  population = next;
  fitnessCache.clear();
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

function buildOperators(ops) {
  const operators = [];
  for (let i = 0; i < ops.length; i++) {
    operators.push({
      symbol: ops[i],
      arity: OP_ARITY[ops[i]]
    });
  }
  if (!operators || operators.length === 0) {
    return [{
        symbol: '+',
        arity: 2
      },
      {
        symbol: '-',
        arity: 2
      },
      {
        symbol: '*',
        arity: 2
      }
    ];
  }
  return operators;
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
    OPERATORS = buildOperators(msg.config.operators);
    mutationRate = msg.config.mutationRate;
    crossoverRate = msg.config.crossoverRate;
    elitismRate = msg.config.elitismRate;
    tournamentSize = msg.config.tournamentSize;
    treeDepth = msg.config.treeDepth;
    dataMode = msg.config.dataMode;
    dataset = (msg.config.dataset || []).map(p => ({
      x: Number(p.x),
      y: Number(p.y)
    })) || [];
    running = true;
    loop();
  }

  if (msg.type === 'stop') {
    running = false;
  }

  if (msg.type === 'resume') {

    // reload parameters

    targetFormula =
      msg.config.targetFormula;
    minError = msg.config.minError;
    maxGenerations = msg.config.maxGenerations;
    populationSize = msg.config.populationSize;
    minX = msg.config.minX;
    maxX = msg.config.maxX;
    OPERATORS = buildOperators(msg.config.operators);
    mutationRate = msg.config.mutationRate;
    crossoverRate = msg.config.crossoverRate;
    elitismRate = msg.config.elitismRate;
    tournamentSize = msg.config.tournamentSize;
    treeDepth = msg.config.treeDepth;
    dataMode = msg.config.dataMode;
    dataset = (msg.config.dataset || []).map(p => ({
      x: Number(p.x),
      y: Number(p.y)
    })) || [];
    running = true;
    loop();

    running = true;

    loop();
  }
  
  if (msg.type === 'restore') {
  
    const config =
      msg.state.config || {};
  
    generation =
      msg.state.generation || 0;
  
    targetFormula =
      config.targetFormula;
  
    minError =
      config.minError;
  
    maxGenerations =
      config.maxGenerations;
  
    populationSize =
      config.populationSize;
  
    minX =
      config.minX;
  
    maxX =
      config.maxX;
  
    OPERATORS =
      buildOperators(config.operators);
  
    mutationRate =
      config.mutationRate;
  
    crossoverRate =
      config.crossoverRate;
  
    elitismRate =
      config.elitismRate;
  
    tournamentSize =
      config.tournamentSize;
  
    treeDepth =
      config.treeDepth;
  
    dataMode =
      config.dataMode;
  
    dataset =
      (config.dataset || []).map(p => ({
        x: Number(p.x),
        y: Number(p.y)
      }));
  
    // IMPORTANT:
    // extract only raw trees
  
    population =
      (msg.state.population || [])
      .map(p => p.tree || p)
      .filter(Boolean);
  
    // refill missing individuals
  
    while (
      population.length <
      populationSize
    ) {
      population.push(randomTree());
    }
  
    fitnessCache.clear();
  
    running = false;
  }
  
};
