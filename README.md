# Browser Genetic Programming System

A browser-based symbolic regression and Genetic Programming (GP) playground built with JavaScript, Vue 3, Web Workers, Canvas, SVG, IndexedDB, and GitHub-hosted documentation.

The system evolves mathematical expression trees to approximate formulas or fit uploaded datasets directly inside the browser.

Repository: [genetic-programming GitHub Repository](https://github.com/bowo-prasetyo/genetic-programming/?utm_source=chatgpt.com)

Live Demo: [Browser Genetic Programming Web Interface](https://bowo-prasetyo.github.io/genetic-programming/?utm_source=chatgpt.com#/)

---

# Features

* Browser-based Genetic Programming engine
* Symbolic regression from mathematical formulas
* Dataset fitting from uploaded CSV files
* Persistent IndexedDB session restoration
* Automatic crash/shutdown recovery
* Fully resumable evolution after browser shutdown
* Dataset persistence without re-uploading CSV files
* Runtime pause/resume evolution
* Runtime GP parameter reloading
* Elite checkpointing system
* Compressed population persistence
* Best-program archival persistence
* Real-time evolution updates
* Canvas graph visualization
* Recursive SVG expression tree renderer
* Web Worker evolution engine
* IndexedDB persistence layer
* Tournament selection
* Mutation and crossover
* Elitism
* Random immigrants
* Ephemeral Random Constants (ERCs)
* Unary and binary operator support
* R²-based fitness scoring
* Complexity penalty system
* Live best-program plotting
* Dataset scatter plotting
* Automatic graph scaling
* Transparent SVG background
* Evolution state management
* GitHub README-powered About page
* Automatic README markdown rendering
* Local evolution result clearing
* IndexedDB cleanup support
* Browser-only execution (no backend required)

---

# Supported Operators

## Binary Operators

* `+`
* `-`
* `*`
* `/`
* `pow`

## Unary Operators

* `sin`
* `cos`
* `tan`
* `sinh`
* `cosh`
* `tanh`
* `asin`
* `acos`
* `atan`
* `asinh`
* `acosh`
* `atanh`
* `log`
* `log2`
* `log10`
* `exp`
* `sqrt`
* `cbrt`

---

# Technologies

* [Vue.js](https://vuejs.org/?utm_source=chatgpt.com)
* [Vue Router](https://router.vuejs.org/?utm_source=chatgpt.com)
* [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API?utm_source=chatgpt.com)
* [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API?utm_source=chatgpt.com)
* [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG?utm_source=chatgpt.com)
* [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API?utm_source=chatgpt.com)
* [Marked.js](https://marked.js.org/?utm_source=chatgpt.com)
* [GitHub Raw Content](https://docs.github.com/en/repositories/working-with-files/using-files/viewing-and-understanding-files?utm_source=chatgpt.com)

---

# How To Use

## 1. Choose Data Source

The application supports two modes:

## Generate From Formula

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

The system automatically generates sample points from the formula and evolves programs that approximate the generated curve.

---

## Upload Dataset

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

Uploaded datasets are fully used during GP fitness evaluation and evolution.

Large datasets are visually downsampled only for canvas rendering performance.

Uploaded datasets are now automatically persisted into IndexedDB checkpoints and restored after browser shutdowns without requiring CSV re-uploading.

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

Example configurations:

* Arithmetic-only symbolic regression
* Trigonometric symbolic regression
* Exponential/logarithmic discovery
* Power-function discovery
* Mixed symbolic search spaces

---

# Evolution Workflow

## 4. Start Evolution

Press:

* `Start Evolution`

The GP engine immediately starts evolving candidate programs.

When evolution is running:

* All inputs become locked
* Parameter controls are disabled
* Data-source switching becomes disabled
* Dataset upload becomes disabled
* Only the `Stop` button remains active

---

## 5. Stop Evolution

Press:

* `Stop`

to pause the evolution process.

The application will:

* Pause GP evolution
* Preserve the evolved population
* Preserve generation history
* Preserve best evolved program
* Preserve datasets
* Preserve runtime configuration
* Preserve IndexedDB checkpoints

After stopping:

* `Stop` changes to `Resume`
* `Start Evolution` changes to `Clear Results`
* Inputs become editable again

---

## 6. Resume Evolution

Press:

* `Resume`

to continue evolution from the previously paused population state.

The system will:

* Restore compressed population trees
* Restore datasets from IndexedDB
* Restore generation history
* Restore best evolved programs
* Continue from the previous population state
* Continue generation counting
* Re-enable full runtime evolution

Resume works even after:

* Browser shutdown
* Tab closing
* Browser crash
* Device restart

No CSV re-upload is required anymore because datasets are stored inside IndexedDB checkpoints.

---

## 7. Automatic Session Restoration

When the application starts, it automatically checks IndexedDB for restorable GP sessions.

If a previous session exists, the application prompts:

```txt
Restore previous GP evolution session?
```

If restored, the system rebuilds:

* Population
* Expression trees
* Best programs
* Runtime configuration
* Uploaded datasets
* Evolution history

The restored evolution can then continue seamlessly using the `Resume` button.

---

## 8. Clear Results

Press:

* `Clear Results`

to completely reset the application state.

The application will:

* Stop the worker
* Remove evolution history
* Clear best evolved programs
* Reset graph visualization
* Delete IndexedDB checkpoints
* Delete stored sessions
* Return UI to idle mode

---

# Visualizations

## Function Graph Canvas

The top canvas displays:

* Uploaded dataset points (cyan dots)
* Best evolved program (red line)

The graph automatically rescales based on dataset range.

The graph updates live during evolution.

Large datasets are visually downsampled only for rendering efficiency.

All original data points are still used internally for fitness evaluation.

---

## Recursive Expression Tree

The SVG renderer visualizes the best evolved program as a recursive tree structure.

Node colors:

| Node Type    | Color       |
| ------------ | ----------- |
| Operator     | Orange      |
| Variable     | Light Green |
| ERC Constant | Khaki       |

Unary operators are rendered with single-child branches.

Binary operators are rendered with left and right child branches.

The SVG background is transparent.

---

# Fitness System

The GP engine uses:

* R² (coefficient of determination)
* Error penalties
* Complexity penalties

This avoids degenerate solutions such as meaningless constant horizontal lines.

The fitness system minimizes:

(1 - R^2) + \text{complexity penalty}

Programs producing invalid numeric outputs automatically receive infinite fitness penalties.

---

# Ephemeral Random Constants (ERCs)

The system supports automatically generated floating-point constants during evolution.

Example evolved constants:

```txt
3.892
-2.395
9.666
```

Mutation can also perturb numeric constants incrementally during evolution.

This significantly improves symbolic regression capability.

---

# Evolution Architecture

The GP engine runs inside a dedicated Web Worker.

Benefits:

* Non-blocking UI
* Smooth rendering
* Responsive controls
* Background evolution loop

The evolution loop includes:

* Tournament selection
* Crossover
* Mutation
* Elitism
* Random immigrants
* Fitness caching

Fitness caching reduces repeated tree evaluations and improves performance.

---

# Persistence Architecture

The system uses IndexedDB as a persistent local storage layer.

Persisted components include:

* Best evolved programs
* Compressed population trees
* Uploaded datasets
* Runtime GP configuration
* Evolution history
* Current generation state

The checkpoint system uses:

* Elite population compression
* Tree serialization
* Automatic restoration
* Crash-safe persistence

Compressed tree storage dramatically reduces IndexedDB storage usage.

---

# Runtime Evolution States

The UI uses three evolution states:

| State     | Description                    |
| --------- | ------------------------------ |
| `idle`    | No evolution running           |
| `running` | Active evolution               |
| `paused`  | Evolution paused and resumable |

These states control:

* Button behavior
* Input locking
* Resume logic
* Worker communication
* Dataset upload locking
* Runtime restoration behavior

---

# About Page

The About page dynamically loads the latest `README.md` directly from GitHub:

```txt
https://raw.githubusercontent.com/bowo-prasetyo/genetic-programming/main/README.md
```

Markdown content is rendered live inside the browser using Marked.js.

This ensures documentation always matches the latest repository version without manual duplication.

---

# Example Discoveries

Target:

```js
x*x + 2/x
```

Possible evolved result:

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

* [Salary Dataset - Simple linear regression](https://www.kaggle.com/datasets/abhishek14398/salary-dataset-simple-linear-regression?utm_source=chatgpt.com)

Possible evolved result:

```txt
9.667 * (((8.220 * 9.254) * 6.426) * ((x + 5.258) + x))
```

---

* [👩‍🏫 Student Scores - Simple 🗃️ Dataset](https://www.kaggle.com/datasets/samira1992/student-scores-simple-dataset?utm_source=chatgpt.com)

Possible evolved result:

```txt
10.174 * x
```

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

# Project Structure

```txt
index.html
app.js
worker.js
README.md
```

| File         | Description                          |
| ------------ | ------------------------------------ |
| `index.html` | Main application page                |
| `app.js`     | Vue application and UI logic         |
| `worker.js`  | Genetic Programming evolution engine |
| `README.md`  | Project documentation                |

---

# Current Capabilities

The system now supports:

* Fully browser-side GP evolution
* Persistent resumable GP sessions
* Browser crash recovery
* Runtime evolution continuation
* Dataset persistence
* Elite checkpointing
* Worker-based background evolution
* Symbolic regression
* CSV dataset fitting
* Live visualization
* Dynamic operator sets
* Incremental GP experimentation

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
* Export/import GP sessions
* Multiple-variable symbolic regression
* Animated evolution playback
* Operator weighting
* Adaptive mutation rate
* Distributed browser evolution
* WebRTC peer-to-peer GP islands
* Shared decentralized browser evolution
* WASM acceleration
* Auto-simplified symbolic expressions

---

# License

MIT License

---

# Assisted By

[ChatGPT](https://chatgpt.com/)
