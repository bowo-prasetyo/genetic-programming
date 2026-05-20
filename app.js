const Home = {
    template: `
  <div class="container">

    <h1>Browser Genetic Programming</h1>
    
    <div style="margin-top:20px; margin-bottom:20px; padding:15px; border:1px solid #444; border-radius:8px;">
    
      <h2>Target Input</h2>
  
      <div style="margin-bottom:15px;">
        <label><b>Data Source:</b></label>
      
        <label style="margin-left:10px;">
          <input
            type="radio"
            value="formula"
            v-model="dataMode"
            :disabled="isRunning"
          >
          Generate From Formula
        </label>
      
        <label style="margin-left:10px;">
          <input
            type="radio"
            value="dataset"
            v-model="dataMode"
            :disabled="isRunning"
          >
          Upload Dataset
        </label>
      </div>

      <div v-if="dataMode === 'formula'">
        <div style="margin-bottom:10px;">
          <label><b>Formula:</b></label>
      
          <input
            v-model="targetFormula"
            placeholder="x*x + 2"
            style="width:300px; padding:8px; margin-left:10px;"
            :disabled="isRunning"
          />
        </div>
      
        <div style="margin-bottom:10px;">
          <label><b>X Range:</b></label>
      
          <input
            type="number"
            v-model.number="minX"
            style="width:80px; padding:8px; margin-left:10px;"
            :disabled="isRunning"
          />
      
          <span style="margin:0 10px;">to</span>
      
          <input
            type="number"
            v-model.number="maxX"
            style="width:80px; padding:8px;"
            :disabled="isRunning"
          />
        </div>
      
        <div class="code" style="margin-top:15px;">
          Current Target: y = {{ targetFormula }}
        </div>
      </div>

      <div v-if="dataMode === 'dataset'">
        <div style="margin-bottom:10px;">
          <label><b>Upload CSV:</b></label>
      
          <input
            type="file"
            accept=".csv"
            @change="handleFileUpload"
            style="margin-left:10px;"
            :disabled="isRunning"
          />
        </div>
      
        <div class="code">
          Expected CSV format:
          x,y
          -5,12
          -4,7
          ...
        </div>
      
        <div
          v-if="uploadedFileName"
          class="code"
          style="margin-top:10px;"
        >
          Loaded:
          {{ uploadedFileName }}
      
          | Points:
          {{ uploadedData.length }}
        </div>
      </div>
    </div>

<button
  @click="mainAction"
  :disabled="isRunning"
>
  {{ mainButtonText }}
</button>

<button
  v-if="!isIdle"
  @click="secondaryAction"
>
  {{ secondaryButtonText }}
</button>

    <div>
    <canvas ref="canvas" width="600" height="300"></canvas>
    </div>

    <div>
    <svg width="1200" height="600">
    
      <g v-if="best">
        <template
          v-for="(item, index) in renderTree(best, 600, 40, 300)"
          :key="index"
        >
    
          <!-- edges -->
          <line
            v-if="item.parent"
            :x1="item.parent.x"
            :y1="item.parent.y"
            :x2="item.x"
            :y2="item.y"
            stroke="white"
          />
    
          <!-- node -->
          <circle
            :cx="item.x"
            :cy="item.y"
            r="20"
            :fill="item.color"
          />
    
          <!-- label -->
          <text
            :x="item.x"
            :y="item.y + 5"
            text-anchor="middle"
            fill="black"
            font-size="12"
          >
            {{ item.label }}
          </text>
    
        </template>
      </g>
    
    </svg>
    </div>

    <div class="stats">
      <div><b>Best Fitness:</b> {{ bestFitness }}</div>
      <div><b>Best Program:</b></div>

      <div class="code">
        {{ expression }}
      </div>

      <h3>Evolution History</h3>

      <div
        v-for="(item, index) in history"
        :key="index"
        class="code"
        style="margin-top:8px"
      >
        Generation {{ item.generation }}
        | Fitness: {{ item.fitness }}
        | R<sup>2</sup>: {{ item.r2 }}
        | Error: {{ item.error }}
        | {{ item.expression }}
      </div>

    </div>

    <div style="margin-top:20px; margin-bottom:20px; padding:15px; border:1px solid #444; border-radius:8px;">
    
      <h2>GP Parameters Settings</h2>
        <div style="margin-bottom:10px;">
          <label><b>Population Size:</b></label>
      
          <input
            type="number"
            v-model.number="populationSize"
            style="width:120px; padding:8px; margin-left:10px;"
            :disabled="isRunning"
          />
        </div>
      
        <div style="margin-bottom:10px;">
          <label><b>Max Generations:</b></label>
      
          <input
            type="number"
            v-model.number="maxGenerations"
            style="width:120px; padding:8px; margin-left:10px;"
            :disabled="isRunning"
          />
        </div>
  
        <div style="margin-bottom:10px;">
        <label><b>Min Error:</b></label>
    
        <input
          type="number"
          v-model.number="minError"
          step="0.01"
          style="width:120px; padding:8px; margin-left:10px;"
          :disabled="isRunning"
        />
      </div>
      
      <div style="margin-bottom:10px;">
        <label><b>Operators:</b></label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="+" :disabled="isRunning"> +
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="-" :disabled="isRunning"> -
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="*" :disabled="isRunning"> *
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="/" :disabled="isRunning"> /
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="pow" :disabled="isRunning"> pow
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="sin" :disabled="isRunning"> sin
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="cos" :disabled="isRunning"> cos
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="tan" :disabled="isRunning"> tan
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="sinh" :disabled="isRunning"> sinh
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="cosh" :disabled="isRunning"> cosh
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="tanh" :disabled="isRunning"> tanh
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="asin" :disabled="isRunning"> asin
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="acos" :disabled="isRunning"> acos
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="atan" :disabled="isRunning"> atan
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="asinh" :disabled="isRunning"> asinh
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="acosh" :disabled="isRunning"> acosh
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="atanh" :disabled="isRunning"> atanh
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="log" :disabled="isRunning"> log
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="log2" :disabled="isRunning"> log2
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="log10" :disabled="isRunning"> log10
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="exp" :disabled="isRunning"> exp
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="sqrt" :disabled="isRunning"> sqrt
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="cbrt" :disabled="isRunning"> cbrt
        </label>
      </div>
    
      <div style="margin-bottom:10px;">
        <label><b>Mutation Rate:</b></label>
    
        <input
          type="number"
          v-model.number="mutationRate"
          step="0.1"
          style="width:120px; padding:8px; margin-left:10px;"
          :disabled="isRunning"
        />
      </div>
    
      <div style="margin-bottom:10px;">
        <label><b>Crossover Rate:</b></label>
    
        <input
          type="number"
          v-model.number="crossoverRate"
          step="0.1"
          style="width:120px; padding:8px; margin-left:10px;"
          :disabled="isRunning"
        />
      </div>

      <div style="margin-bottom:10px;">
        <label><b>Elitism Rate:</b></label>
    
        <input
          type="number"
          v-model.number="elitismRate"
          step="0.01"
          style="width:120px; padding:8px; margin-left:10px;"
          :disabled="isRunning"
        />
      </div>

      <div style="margin-bottom:10px;">
        <label><b>Tournament Size:</b></label>
    
        <input
          type="number"
          v-model.number="tournamentSize"
          style="width:120px; padding:8px; margin-left:10px;"
          :disabled="isRunning"
        />
      </div>

      <div style="margin-bottom:10px;">
        <label><b>Tree Depth:</b></label>
    
        <input
          type="number"
          v-model.number="treeDepth"
          style="width:120px; padding:8px; margin-left:10px;"
          :disabled="isRunning"
        />
      </div>

    </div>
    
  </div>
  `,

    data() {
      return {
        worker: null,
        generation: 0,
        history: [],
        best: {
          left: 'x',
          op: '+',
          right: '1'
        },
        bestFitness: 0,
        db: null,
        expressionText: '',
        targetFormula: 'x*x + 2',
        minX: -5,
        maxX: 5,
        populationSize: 100,
        minError: 0.01,
        maxGenerations: 1000,
        enabledOperators: ['+', '-', '*'],
        mutationRate: 0.1,
        crossoverRate: 0.7,
        elitismRate: 0.05,
        tournamentSize: 5,
        treeDepth: 4,
        dataMode: 'formula', // formula | dataset
        uploadedData: [],
        uploadedFileName: '',
        evolutionState: 'idle',
        // idle
        // running
        // paused
        checkpointInterval: 1,
        hasRestorableSession: false,
        eliteCheckpointRate: 0.2,
        lastCheckpointFitness: -Infinity,
        lastSavedBestFitness: -Infinity
      };
    },

    computed: {

      expression() {
        return this.expressionText;
      },

      sampleData() {

        // uploaded dataset mode
        if (this.dataMode === 'dataset') {
          return this.uploadedData;
        }

        // formula mode
        const data = [];

        for (let x = this.minX; x <= this.maxX; x += 0.5) {

          let y = 0;

          try {
            y = Function(
              'x',
              `return ${this.targetFormula};`
            )(x);

          } catch (e) {
            continue;
          }

          if (Number.isFinite(y)) {
            data.push({
              x,
              y
            });
          }
        }

        return data;
      },

      isRunning() {
        return this.evolutionState === 'running';
      },

      isPaused() {
        return this.evolutionState === 'paused';
      },

      isIdle() {
        return this.evolutionState === 'idle';
      },

      mainButtonText() {

        switch (this.evolutionState) {

          case 'idle':
            return 'Start Evolution';

          case 'paused':
            return 'Clear Results';

          case 'running':
            return 'Running...';
        }
      },

      secondaryButtonText() {

        switch (this.evolutionState) {

          case 'idle':
            return 'Stop';

          case 'running':
            return 'Stop';

          case 'paused':
            return 'Resume';
        }
      }

    },

    mounted() {
      this.initDB();
      this.drawCanvas();
      window.addEventListener(
        'beforeunload',
        () => {

          if (
            this.evolutionState === 'running'
          ) {
            this.saveCheckpoint();
          }
        }
      );
    },

    methods: {

      initDB() {

        const request = indexedDB.open('gp-db', 2);

        request.onupgradeneeded = (e) => {

          const db = e.target.result;

          if (!db.objectStoreNames.contains('bestPrograms')) {

            db.createObjectStore('bestPrograms', {
              keyPath: 'id',
              autoIncrement: true
            });
          }

          if (!db.objectStoreNames.contains('sessions')) {

            db.createObjectStore('sessions', {
              keyPath: 'id'
            });
          }
        };

        request.onsuccess = async (e) => {

          this.db = e.target.result;

          await this.checkRestorableSession();
        };
      },

      renderTree(
        node,
        x = 600,
        y = 40,
        spread = 300,
        parent = null,
        result = []
      ) {

        if (node == null) {
          return result;
        }

        // =========================
        // TERMINAL NODE
        // =========================

        if (typeof node === 'string') {

          result.push({
            x,
            y,
            label: node,
            color: 'lightgreen',
            parent
          });

          return result;
        }

        // ERC number node
        if (typeof node === 'number') {

          result.push({
            x,
            y,
            label: node.toFixed(2),
            color: 'khaki',
            parent
          });

          return result;
        }

        // =========================
        // OPERATOR NODE
        // =========================

        result.push({
          x,
          y,
          label: node.op,
          color: 'orange',
          parent
        });

        // unary operator
        if (node.child) {

          this.renderTree(
            node.child,
            x,
            y + 80,
            spread / 1.5, {
              x,
              y
            },
            result
          );

          return result;
        }

        // binary operator
        this.renderTree(
          node.left,
          x - spread,
          y + 80,
          spread / 2, {
            x,
            y
          },
          result
        );

        this.renderTree(
          node.right,
          x + spread,
          y + 80,
          spread / 2, {
            x,
            y
          },
          result
        );

        return result;
      },
    
    saveBest() {
    
      if (!this.db) return;
    
      if (
        this.bestFitness <=
        this.lastSavedBestFitness
      ) {
        return;
      }
    
      this.lastSavedBestFitness =
        this.bestFitness;
    
      const tx =
        this.db.transaction(
          ['bestPrograms'],
          'readwrite'
        );
    
      const store =
        tx.objectStore('bestPrograms');
    
      store.add({
    
        timestamp: Date.now(),
    
        fitness:
          this.bestFitness,
    
        tree:
          this.compressTree(this.best),
    
        generation:
          this.generation
      });
    },

      startEvolution() {
        if (this.worker) {
          this.worker.terminate();
        }

        this.evolutionState = 'running';

        this.generation = 0;
        this.history = [];
        this.worker = new Worker('worker.js');

        this.bindWorker();

        this.worker.postMessage({
          type: 'start',
          config: {
            targetFormula: this.targetFormula,
            minX: this.minX,
            maxX: this.maxX,
            populationSize: this.populationSize,
            minError: this.minError,
            maxGenerations: this.maxGenerations,
            operators: [...this.enabledOperators],
            mutationRate: this.mutationRate,
            crossoverRate: this.crossoverRate,
            elitismRate: this.elitismRate,
            tournamentSize: this.tournamentSize,
            treeDepth: this.treeDepth,
            dataMode: this.dataMode,
            dataset: JSON.parse(JSON.stringify(this.uploadedData))
          }
        });
      },

      stopEvolution() {

        if (!this.worker) {
          return;
        }

        this.worker.postMessage({
          type: 'stop'
        });

        this.evolutionState = 'paused';
      },

      resumeEvolution() {

        if (!this.worker) {
          return;
        }

        this.worker.postMessage({
          type: 'resume',

          config: {

            targetFormula: this.targetFormula,
            minX: this.minX,
            maxX: this.maxX,
            populationSize: this.populationSize,
            minError: this.minError,
            maxGenerations: this.maxGenerations,
            operators: [...this.enabledOperators],
            mutationRate: this.mutationRate,
            crossoverRate: this.crossoverRate,
            elitismRate: this.elitismRate,
            tournamentSize: this.tournamentSize,
            treeDepth: this.treeDepth,
            dataMode: this.dataMode,
            dataset: JSON.parse(
              JSON.stringify(this.uploadedData)
            )
          }
        });

      },

      evaluateTree(node, x) {

        if (node == null) {
          return 0;
        }

        // terminal
        if (typeof node === 'string') {

          if (node === 'x') {
            return x;
          }

          return Number(node);
        }

        // unary
        if (node.child) {

          const v =
            this.evaluateTree(node.child, x);

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

            default:
              return 0;
          }
        }

        // binary
        const left =
          this.evaluateTree(node.left, x);

        const right =
          this.evaluateTree(node.right, x);

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
      },

      drawCanvas() {
        const canvas = this.$refs.canvas;

        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // =========================
        // FIND DATA RANGE
        // =========================

        let points = this.sampleData || [];

        if (!points.length) return;

        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);

        let minY = Math.min(...ys);
        let maxY = Math.max(...ys);

        if (minY === maxY) {
          minY -= 1;
          maxY += 1;
        }

        const padding = 20;

        function toScreenX(x) {
          return padding +
            ((x - minX) / (maxX - minX)) *
            (canvas.width - padding * 2);
        }

        function toScreenY(y) {
          return canvas.height - padding -
            ((y - minY) / (maxY - minY)) *
            (canvas.height - padding * 2);
        }

        // =========================
        // DRAW GP CURVE FIRST
        // =========================

        ctx.beginPath();

        let first = true;

        for (let px = 0; px < canvas.width; px++) {

          const logicalX =
            minX + (px / canvas.width) * (maxX - minX);

          const y =
            this.evaluateTree(this.best, logicalX);

          if (!Number.isFinite(y)) continue;

          const screenX = toScreenX(logicalX);
          const screenY = toScreenY(y);

          if (first) {
            ctx.moveTo(screenX, screenY);
            first = false;
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();

        // =========================
        // DOWNSAMPLE DATA
        // =========================

        const maxPoints = 30;

        let sampled = points;

        if (points.length > maxPoints) {

          sampled = [];

          const step =
            points.length / maxPoints;

          for (let i = 0; i < maxPoints; i++) {
            sampled.push(
              points[Math.floor(i * step)]
            );
          }
        }

        // =========================
        // DRAW DATA POINTS LAST
        // =========================

        ctx.fillStyle = 'cyan';

        for (const p of sampled) {

          const sx = toScreenX(p.x);
          const sy = toScreenY(p.y);

          ctx.beginPath();

          ctx.arc(
            sx,
            sy,
            5, // bigger point radius
            0,
            Math.PI * 2
          );

          ctx.fill();
        }
      },

      handleFileUpload(event) {

        const file = event.target.files[0];

        if (!file) return;

        this.uploadedFileName = file.name;

        const reader = new FileReader();

        reader.onload = (e) => {

          const text = e.target.result;

          const lines =
            text.split(/\r?\n/);

          const data = [];

          for (let i = 1; i < lines.length; i++) {

            const line = lines[i].trim();

            if (!line) continue;

            const parts = line.split(',');

            if (parts.length < 2) continue;

            const x = Number(parts[0]);
            const y = Number(parts[1]);

            if (
              Number.isFinite(x) &&
              Number.isFinite(y)
            ) {
              data.push({
                x,
                y
              });
            }
          }

          this.uploadedData = data;

          console.log(
            'Dataset loaded:',
            data.length
          );
        };

        reader.readAsText(file);
      },

      mainAction() {

        if (this.evolutionState === 'idle') {
          this.startEvolution();
          return;
        }

        if (this.evolutionState === 'paused') {
          this.clearResults();
        }
      },

      secondaryAction() {

        if (this.evolutionState === 'running') {
          this.stopEvolution();
          return;
        }

        if (this.evolutionState === 'paused') {
          this.resumeEvolution();
        }
      },

      clearResults() {

        const confirmed =
          confirm(
            'Clear all evolution results?'
          );

        if (!confirmed) {
          return;
        }

        // stop worker completely

        if (this.worker) {

          this.worker.terminate();

          this.worker = null;
        }

        // clear memory

        this.best = null;

        this.bestFitness = 0;

        this.expressionText = '';

        this.history = [];

        this.generation = 0;

        // clear graph

        this.drawCanvas();

        // clear indexedDB

        if (this.db) {

          const tx =
            this.db.transaction(
              ['bestPrograms'],
              'readwrite'
            );

          const store =
            tx.objectStore(
              'bestPrograms'
            );

          store.clear();
        }

        this.evolutionState = 'idle';

        if (this.db) {

          const tx = this.db.transaction(
            ['sessions'],
            'readwrite'
          );

          const store = tx.objectStore('sessions');

          store.delete('latest');
        }

      },

      async saveCheckpoint() {

        if (!this.db || !this.worker) {
          return;
        }

        // save only if improved

        if (
          this.bestFitness <=
          this.lastCheckpointFitness
        ) {
          return;
        }

        this.lastCheckpointFitness =
          this.bestFitness;

        // build elite population

        const elitePopulation =
          this.buildElitePopulation(
            this.latestPopulation || []
          );

        // strip + compress

        const compactPopulation =
          this.stripPopulation(
            elitePopulation
          );

        const state = {

          id: 'latest',

          timestamp: Date.now(),

          generation: this.generation,

          population: compactPopulation,

          best: this.compressTree(
            this.best
          ),

          bestFitness: this.bestFitness,

          history: JSON.parse(
            JSON.stringify(
              this.history
            )
          ),

          expressionText: this.expressionText,

          evolutionState: this.evolutionState,

          config: {

            targetFormula: this.targetFormula,

            minX: this.minX,

            maxX: this.maxX,

            populationSize: this.populationSize,

            minError: this.minError,

            maxGenerations: this.maxGenerations,

            operators: [...this.enabledOperators],

            mutationRate: this.mutationRate,

            crossoverRate: this.crossoverRate,

            elitismRate: this.elitismRate,

            tournamentSize: this.tournamentSize,

            treeDepth: this.treeDepth,

            dataMode: this.dataMode,

            dataset: JSON.parse(
              JSON.stringify(
                this.uploadedData
              )
            )
          }
        };

        const tx =
          this.db.transaction(
            ['sessions'],
            'readwrite'
          );

        const store =
          tx.objectStore(
            'sessions'
          );

        store.put(state);
      },

      async checkRestorableSession() {

        if (!this.db) {
          return;
        }

        const tx = this.db.transaction(
          ['sessions'],
          'readonly'
        );

        const store = tx.objectStore('sessions');

        const request = store.get('latest');

        request.onsuccess = () => {

          const result = request.result;

          this.hasRestorableSession = !!result;

          if (!result) {
            return;
          }

          const confirmed = confirm(
            'Restore previous GP evolution session?'
          );

          if (!confirmed) {
            return;
          }

          this.restoreSession(result);
        };
      },

      restoreSession(state) {

        this.generation =
          state.generation || 0;

        this.best =
          this.decompressTree(
            state.best
          );

        this.bestFitness =
          state.bestFitness || 0;

        this.history =
          state.history || [];

        this.expressionText =
          state.expressionText || '';

        this.evolutionState =
          'paused';

        const config =
          state.config || {};

        this.targetFormula =
          config.targetFormula || 'x*x + 2';

        this.minX =
          config.minX ?? -5;

        this.maxX =
          config.maxX ?? 5;

        this.populationSize =
          config.populationSize || 100;

        this.minError =
          config.minError || 0.01;

        this.maxGenerations =
          config.maxGenerations || 1000;

        this.enabledOperators =
          config.operators || ['+', '-', '*'];

        this.mutationRate =
          config.mutationRate || 0.1;

        this.crossoverRate =
          config.crossoverRate || 0.7;

        this.elitismRate =
          config.elitismRate || 0.05;

        this.tournamentSize =
          config.tournamentSize || 5;

        this.treeDepth =
          config.treeDepth || 4;

        this.dataMode =
          config.dataMode || 'formula';

        this.uploadedData =
          config.dataset || [];

        this.latestPopulation =
          (state.population || [])
          .map(individual => ({

            tree: this.decompressTree(
              individual.tree
            ),

            fitness: individual.fitness
          }));

        this.worker = new Worker('worker.js');

        this.bindWorker();

        this.worker.postMessage({
          type: 'restore',
        
          state: {
            generation:
              state.generation,
        
            population:
              this.latestPopulation,
        
            config
          }
        });

        this.drawCanvas();
      },

      bindWorker() {

        this.worker.onmessage = (e) => {

          const msg = e.data;

          if (msg.type === 'update') {

            this.best = msg.best;

            this.bestFitness = msg.fitness;

            this.expressionText = msg.expression;

            this.generation = msg.generation;

            this.latestPopulation =
              msg.population;

            this.history.unshift({
              generation: msg.generation,
              fitness: this.bestFitness,
              error: msg.rawError,
              r2: msg.r2,
              expression: msg.expression
            });

            if (this.history.length > 3) {
              this.history.pop();
            }

            this.drawCanvas();

            this.saveBest();

            if (
              this.generation %
              this.checkpointInterval === 0
            ) {
              this.saveCheckpoint();
            }
          }

          if (msg.type === 'finished') {

            this.evolutionState = 'paused';

            this.saveCheckpoint();
          }
        };
      },

      compressTree(node) {

        if (node == null) {
          return null;
        }

        // terminal
        if (
          typeof node === 'string' ||
          typeof node === 'number'
        ) {
          return node;
        }

        // unary
        if (node.child) {

          return [
            node.op,
            this.compressTree(node.child)
          ];
        }

        // binary
        return [
          node.op,
          this.compressTree(node.left),
          this.compressTree(node.right)
        ];
      },

      decompressTree(node) {

        if (
          typeof node === 'string' ||
          typeof node === 'number'
        ) {
          return node;
        }

        if (!Array.isArray(node)) {
          return null;
        }

        // unary
        if (node.length === 2) {

          return {
            op: node[0],
            child: this.decompressTree(node[1])
          };
        }

        // binary
        return {
          op: node[0],

          left: this.decompressTree(node[1]),

          right: this.decompressTree(node[2])
        };
      },

      stripPopulation(population) {

        return population.map(individual => ({

          tree: this.compressTree(
            individual.tree
          ),

          fitness: individual.fitness
        }));
      },

      buildElitePopulation(population) {

        if (!population?.length) {
          return [];
        }

        const sorted = [...population]
          .sort(
            (a, b) =>
            b.fitness - a.fitness
          );

        const eliteCount =
          Math.max(
            1,
            Math.floor(
              sorted.length *
              this.eliteCheckpointRate
            )
          );

        return sorted.slice(0, eliteCount);
      }

    };

    const About = {

      data() {
        return {
          content: 'Loading README.md ...'
        };
      },

      async mounted() {

        try {

          const response = await fetch(
            'https://raw.githubusercontent.com/bowo-prasetyo/genetic-programming/main/README.md'
          );

          const markdown = await response.text();

          // Optional:
          // convert markdown -> HTML

          this.content = marked.parse(markdown);

        } catch (e) {

          this.content =
            '<p>Failed to load README.md</p>';

          console.error(e);
        }
      },

      template: `
    <div class="container">

      <div v-html="content"></div>

    </div>
  `
    };

    const routes = [{
        path: '/',
        component: Home
      },
      {
        path: '/about',
        component: About
      }
    ];

    const router = VueRouter.createRouter({
      history: VueRouter.createWebHashHistory(),
      routes
    });

    const app = Vue.createApp({});

    app.use(router);

    app.mount('#app');
