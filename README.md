# Browser Genetic Programming System

A browser-based symbolic regression and Genetic Programming (GP) playground built with JavaScript, Vue 3, Web Workers, Canvas, and SVG.

The system evolves mathematical expression trees to approximate formulas or fit uploaded datasets directly inside the browser.

Repository: [genetic-programming GitHub Repository](https://github.com/bowo-prasetyo/genetic-programming/?utm_source=chatgpt.com)

Live Demo: [Browser Genetic Programming Web Interface](https://bowo-prasetyo.github.io/genetic-programming/?utm_source=chatgpt.com#/)

---

## Features

* Browser-based Genetic Programming engine
* Symbolic regression from mathematical formulas
* Dataset fitting from uploaded CSV files
* Real-time evolution updates
* Canvas graph visualization
* Recursive SVG expression tree renderer
* Web Worker evolution engine
* IndexedDB persistence
* Tournament selection
* Mutation and crossover
* Elitism
* Random immigrants
* Ephemeral Random Constants (ERCs)
* Unary and binary operator support
* R²-based fitness scoring
* Live best-program plotting
* Dataset scatter plotting
* Automatic graph scaling
* Transparent SVG background

---

## Supported Operators

### Binary Operators

* `+`
* `-`
* `*`
* `/`
* `pow`

### Unary Operators

* `sin`
* `cos`
* `tan`
* `asin`
* `acos`
* `atan`
* `log`
* `log2`
* `log10`
* `exp`
* `sqrt`
* `cbrt`

---

## Technologies

* [Vue.js](https://vuejs.org/?utm_source=chatgpt.com)
* [Vue Router](https://router.vuejs.org/?utm_source=chatgpt.com)
* [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API?utm_source=chatgpt.com)
* [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API?utm_source=chatgpt.com)
* [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG?utm_source=chatgpt.com)
* [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API?utm_source=chatgpt.com)

---

# How To Use

## 1. Choose Data Source

The application supports two modes:

### Generate From Formula

Select:

* `Generate From Formula`

Then enter:

* Target formula
* Minimum X
* Maximum X

Example:

```js
x*x + 2
```

or:

```js
Math.sin(x)
```

---

### Upload Dataset

Select:

* `Upload Dataset`

Then upload a CSV file.

Expected format:

```csv
x,y
-5,12
-4,7
-3,3
...
```

The system will evolve programs that best fit the uploaded data.

---

## 2. Configure GP Parameters

The UI provides configurable GP parameters:

| Parameter       | Description                    |
| --------------- | ------------------------------ |
| Population Size | Number of individuals          |
| Max Generations | Maximum evolution iterations   |
| Min Error       | Stop threshold                 |
| Mutation Rate   | Mutation probability           |
| Crossover Rate  | Crossover probability          |
| Elitism Rate    | Percentage of elites preserved |
| Tournament Size | Tournament selection size      |
| Tree Depth      | Maximum generated tree depth   |

---

## 3. Select Operators

Enable or disable operators dynamically using checkboxes.

This controls the GP primitive set and significantly changes search behavior.

Example:

* Arithmetic only
* Trigonometric symbolic regression
* Exponential/logarithmic discovery

---

## 4. Start Evolution

Press:

* `Start Evolution`

The GP engine immediately starts evolving candidate programs.

Press:

* `Stop`

to stop the evolution manually.

---

# Visualizations

## Function Graph Canvas

The top canvas displays:

* Uploaded dataset points (cyan dots)
* Best evolved program (red line)

The graph automatically rescales based on dataset range.

The graph updates live during evolution.

---

## Recursive Expression Tree

The SVG renderer visualizes the best evolved program as a recursive tree structure.

Node colors:

| Node Type    | Color       |
| ------------ | ----------- |
| Operator     | Orange      |
| Variable     | Light Green |
| ERC Constant | Khaki       |

The SVG background is transparent.

---

# Fitness System

The GP engine uses:

* R² (coefficient of determination)
* Error penalties
* Complexity penalties

This avoids degenerate solutions such as meaningless constant horizontal lines.

---

# Ephemeral Random Constants (ERCs)

The system supports automatically generated floating-point constants during evolution.

Example evolved constants:

```txt
3.892
-2.395
9.666
```

This dramatically improves symbolic regression capability.

---

# Example Discoveries

Target:

```js
x*x + 2/x
```

Evolved result:

```txt
(((4 / (2 * x)) + ((x * x) - 5)) + 5)
```

---

Target:

```js
Math.sin(x)
```

Possible evolved approximation:

```txt
(((5 / x) - x) / 4)
```

---

# Example Datasets

* [👩‍🏫 Student Scores - Simple 🗃️ Dataset](https://www.kaggle.com/datasets/samira1992/student-scores-simple-dataset)

---

# Running Locally

Clone repository:

```bash
git clone https://github.com/bowo-prasetyo/genetic-programming.git
```

Open:

```txt
index.html
```

in a modern browser.

No build step required.

---

# Future Ideas

* Strongly Typed GP
* Automatically Defined Functions (ADF)
* Complex numbers
* Multi-objective GP
* Semantic GP
* GPU acceleration
* Parallel island evolution
* AST simplification
* Tree pruning
* Grammar-guided GP
* Neural-GP hybrids
* Program synthesis
* JavaScript control-flow primitives (`if`, `while`, `for`)
* Full program evolution instead of pure symbolic regression

---

# License

MIT License
