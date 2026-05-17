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
          >
          Generate From Formula
        </label>
      
        <label style="margin-left:10px;">
          <input
            type="radio"
            value="dataset"
            v-model="dataMode"
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
          />
        </div>
      
        <div style="margin-bottom:10px;">
          <label><b>X Range:</b></label>
      
          <input
            type="number"
            v-model.number="minX"
            style="width:80px; padding:8px; margin-left:10px;"
          />
      
          <span style="margin:0 10px;">to</span>
      
          <input
            type="number"
            v-model.number="maxX"
            style="width:80px; padding:8px;"
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
    
    <div style="margin-top:20px; margin-bottom:20px; padding:15px; border:1px solid #444; border-radius:8px;">
    
      <h2>GP Parameters Settings</h2>
        <div style="margin-bottom:10px;">
          <label><b>Population Size:</b></label>
      
          <input
            type="number"
            v-model.number="populationSize"
            style="width:120px; padding:8px; margin-left:10px;"
          />
        </div>
      
        <div style="margin-bottom:10px;">
          <label><b>Max Generations:</b></label>
      
          <input
            type="number"
            v-model.number="maxGenerations"
            style="width:120px; padding:8px; margin-left:10px;"
          />
        </div>
  
        <div style="margin-bottom:10px;">
          <label><b>Min Error:</b></label>
      
          <input
            type="number"
            v-model.number="minError"
            style="width:120px; padding:8px; margin-left:10px;"
          />
        </div>
      
      <div style="margin-bottom:10px;">
        <label><b>Operators:</b></label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="+"> +
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="-"> -
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="*"> *
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="/"> /
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="pow"> pow
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="sin"> sin
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="cos"> cos
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="tan"> tan
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="asin"> asin
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="acos"> acos
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="atan"> atan
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="log"> log
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="log2"> log2
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="log10"> log10
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="exp"> exp
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="sqrt"> sqrt
        </label>
    
        <label style="margin-left:10px;">
          <input type="checkbox" v-model="enabledOperators" value="cbrt"> cbrt
        </label>
      </div>
    
      <div style="margin-bottom:10px;">
        <label><b>Mutation Rate:</b></label>
    
        <input
          type="number"
          v-model.number="mutationRate"
          style="width:120px; padding:8px; margin-left:10px;"
        />
      </div>
    
      <div style="margin-bottom:10px;">
        <label><b>Crossover Rate:</b></label>
    
        <input
          type="number"
          v-model.number="crossoverRate"
          style="width:120px; padding:8px; margin-left:10px;"
        />
      </div>

      <div style="margin-bottom:10px;">
        <label><b>Elitism Rate:</b></label>
    
        <input
          type="number"
          v-model.number="elitismRate"
          style="width:120px; padding:8px; margin-left:10px;"
        />
      </div>

      <div style="margin-bottom:10px;">
        <label><b>Tournament Size:</b></label>
    
        <input
          type="number"
          v-model.number="tournamentSize"
          style="width:120px; padding:8px; margin-left:10px;"
        />
      </div>

      <div style="margin-bottom:10px;">
        <label><b>Tree Depth:</b></label>
    
        <input
          type="number"
          v-model.number="treeDepth"
          style="width:120px; padding:8px; margin-left:10px;"
        />
      </div>

    </div>

    <button @click="start">Start Evolution</button>
    <button @click="stop">Stop</button>

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
        | Error: {{ item.error }}
        | {{ item.expression }}
      </div>

    </div>

    <canvas ref="canvas" width="600" height="300"></canvas>

    <svg width="400" height="200">

      <line x1="200" y1="50" x2="120" y2="130" stroke="white"/>
      <line x1="200" y1="50" x2="280" y2="130" stroke="white"/>

      <circle cx="200" cy="50" r="20" fill="orange"/>
      <text x="195" y="55" fill="black">{{ best.op }}</text>

      <circle cx="120" cy="130" r="20" fill="skyblue"/>
      <text x="115" y="135" fill="black">{{ best.left }}</text>

      <circle cx="280" cy="130" r="20" fill="lightgreen"/>
      <text x="275" y="135" fill="black">{{ best.right }}</text>

    </svg>

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
      minError: 0.1,      
      maxGenerations: 1000,      
      enabledOperators: ['+', '-', '*'],
      mutationRate: 0.1,
      crossoverRate: 0.7,
      elitismRate: 0.05,
      tournamentSize: 5,
      treeDepth: 4,
      dataMode: 'formula', // formula | dataset
      uploadedData: [],
      uploadedFileName: ''
    };
  },

  computed: {
    expression() {
      return this.expressionText;
    }
  },

  mounted() {
    this.initDB();
    this.drawCanvas();
  },

  methods: {

    initDB() {
      const request = indexedDB.open('gp-db', 1);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        if (!db.objectStoreNames.contains('bestPrograms')) {
          db.createObjectStore('bestPrograms', {
            keyPath: 'id',
            autoIncrement: true
          });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
      };
    },

    saveBest() {
      if (!this.db) return;

      const tx = this.db.transaction(['bestPrograms'], 'readwrite');
      const store = tx.objectStore('bestPrograms');

      store.add({
        timestamp: Date.now(),
        program: JSON.parse(JSON.stringify(this.best)),
        fitness: this.bestFitness
      });
    },

    start() {
      if (this.worker) {
        this.worker.terminate();
      }

      this.generation = 0;
      this.history = [];
      this.worker = new Worker('worker.js');

      this.worker.onmessage = (e) => {
        const msg = e.data;

        if (msg.type === 'update') {
          this.best = msg.best;
          this.bestFitness = msg.fitness;
          this.expressionText = msg.expression;

          this.history.unshift({
            generation: msg.generation,
            fitness: this.bestFitness,
            error: msg.rawError,
            expression: msg.expression
          });

          if (this.history.length > 20) {
            this.history.pop();
          }

          this.drawCanvas();
          this.saveBest();
        }
      };

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

    stop() {
      if (!this.worker) return;

      this.worker.postMessage({ type: 'stop' });
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
    
      // no data
      if (
        this.targetMode === 'dataset' &&
        this.dataset.length === 0
      ) {
        return;
      }
    
      // determine x-range
      let minX = this.minX;
      let maxX = this.maxX;
    
      if (this.targetMode === 'dataset') {
    
        minX = Math.min(
          ...this.dataset.map(p => p.x)
        );
    
        maxX = Math.max(
          ...this.dataset.map(p => p.x)
        );
      }
    
      // determine y-range
      const ys = [];
    
      // sample GP line
      for (let px = 0; px < canvas.width; px++) {
    
        const x =
          minX +
          (px / canvas.width) *
          (maxX - minX);
    
        const y = this.evaluateTree(this.best, x);
    
        if (Number.isFinite(y)) {
          ys.push(y);
        }
      }
    
      // include dataset y
      if (this.targetMode === 'dataset') {
    
        for (const p of this.dataset) {
    
          if (Number.isFinite(p.y)) {
            ys.push(p.y);
          }
        }
      }
    
      if (ys.length === 0) return;
    
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
    
      const scaleX =
        canvas.width / (maxX - minX || 1);
    
      const scaleY =
        canvas.height / (maxY - minY || 1);
    
      // =========================
      // draw GP curve
      // =========================
    
      ctx.beginPath();
    
      let started = false;
    
      for (let px = 0; px < canvas.width; px++) {
    
        const x =
          minX +
          (px / canvas.width) *
          (maxX - minX);
    
        const y =
          this.evaluateTree(this.best, x);
    
        if (!Number.isFinite(y)) {
          started = false;
          continue;
        }
    
        const screenX =
          (x - minX) * scaleX;
    
        const screenY =
          canvas.height -
          ((y - minY) * scaleY);
    
        if (!started) {
          ctx.moveTo(screenX, screenY);
          started = true;
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
    
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
    
      // =========================
      // draw dataset points
      // =========================
    
      if (this.targetMode === 'dataset') {
    
        for (const p of this.dataset) {
    
          if (
            !Number.isFinite(p.x) ||
            !Number.isFinite(p.y)
          ) {
            continue;
          }
    
          const screenX =
            (p.x - minX) * scaleX;
    
          const screenY =
            canvas.height -
            ((p.y - minY) * scaleY);
    
          ctx.beginPath();
    
          ctx.arc(
            screenX,
            screenY,
            4,
            0,
            Math.PI * 2
          );
    
          ctx.fillStyle = 'blue';
          ctx.fill();
        }
      }
    
      // =========================
      // axes
      // =========================
    
      // x-axis
      if (minY < 0 && maxY > 0) {
    
        const y0 =
          canvas.height -
          ((0 - minY) * scaleY);
    
        ctx.beginPath();
        ctx.moveTo(0, y0);
        ctx.lineTo(canvas.width, y0);
        ctx.strokeStyle = '#888';
        ctx.stroke();
      }
    
      // y-axis
      if (minX < 0 && maxX > 0) {
    
        const x0 =
          (0 - minX) * scaleX;
    
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, canvas.height);
        ctx.strokeStyle = '#888';
        ctx.stroke();
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
            data.push({ x, y });
          }
        }
    
        this.uploadedData = data;
    
        console.log(
          'Dataset loaded:',
          data.length
        );
      };
    
      reader.readAsText(file);
    }    

  }
};

const About = {
  template: `
  <div class="container">
    <h1>About</h1>

    <p>
      This is a minimal browser-based Genetic Programming system.
    </p>

    <ul>
      <li>Vue 3 + Vue Router</li>
      <li>Canvas graph rendering</li>
      <li>SVG expression trees</li>
      <li>Web Worker evolution engine</li>
      <li>IndexedDB persistence</li>
    </ul>
  </div>
  `
};

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

const app = Vue.createApp({});

app.use(router);

app.mount('#app');
