# Browser Genetic Programming System

A browser-based Genetic Programming (GP) system for symbolic regression and equation discovery using evolutionary computation.

The system evolves mathematical expression trees directly in the browser using a Web Worker-based GP engine and visualizes both the evolved programs and their curve fitting performance in real time.

## Live Demo

* [Web Interface](https://bowo-prasetyo.github.io/genetic-programming/?utm_source=chatgpt.com#/)
* [GitHub Repository](https://github.com/bowo-prasetyo/genetic-programming/?utm_source=chatgpt.com)

## Features

* Browser-based Genetic Programming engine
* Symbolic regression / equation discovery
* Formula-based dataset generation
* CSV dataset upload support
* Real-time evolution visualization
* Real-time curve plotting
* Recursive SVG expression tree renderer
* Web Worker evolution engine
* IndexedDB persistence
* Fitness caching for performance
* Tournament selection
* Subtree crossover
* Subtree mutation
* Elitism
* Random immigrants
* Ephemeral Random Constants (ERCs)
* Complexity penalty
* R²-based fitness evaluation
* Unary and binary operator support

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

## Technologies

* Vue 3
* Vue Router
* HTML5 Canvas
* SVG
* Web Workers
* IndexedDB

## Dataset Format

CSV upload format:

```csv
x,y
-5,12
-4,7
-3,2
-2,1
```

## Visualization

The system provides two visualization modes:

### Function Plot

* Uploaded dataset plotted as points
* Best evolved program plotted as a curve
* Real-time updates during evolution

### Expression Tree

Recursive SVG rendering of the evolved abstract syntax tree (AST).

Example:

```text
        +
      /   \
     *     2
   /   \
  x     x
```

## Fitness System

The GP engine uses:

* R² (coefficient of determination)
* Complexity penalty
* Invalid-number protection
* Fitness caching

This helps prevent:

* giant constant explosions
* flat-line cheating
* invalid numerical programs
* excessive tree bloat

## GP Techniques Implemented

* Tree-based Genetic Programming
* Tournament Selection
* Recursive Tree Evaluation
* Subtree Mutation
* Subtree Crossover
* Elitism Preservation
* Random Immigrant Injection
* Ephemeral Random Constants (ERCs)

## Future Ideas

* Full recursive tree UI interactions
* Tree simplification
* Multi-objective optimization
* Strongly Typed GP
* Automatically Defined Functions (ADF)
* Parallel island evolution
* Complex-number symbolic regression
* Neural-GP hybrid systems

## License

MIT License.
