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
          <input type="checkbox" v-model="enabledOperators" value="sin"> sin
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
        program: this.best,
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

    evaluate(x) {
      const left = this.best.left === 'x'
        ? x
        : Number(this.best.left);

      const right = this.best.right === 'x'
        ? x
        : Number(this.best.right);

      switch (this.best.op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
      }

      return 0;
    },

    drawCanvas() {
      const canvas = this.$refs.canvas;

      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        const logicalX = (x - 300) / 30;
        const y = this.evaluate(logicalX);

        const screenY = 150 - y * 10;

        if (x === 0) {
          ctx.moveTo(x, screenY);
        } else {
          ctx.lineTo(x, screenY);
        }
      }

      ctx.strokeStyle = 'red';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 150);
      ctx.lineTo(600, 150);
      ctx.strokeStyle = 'black';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(300, 0);
      ctx.lineTo(300, 300);
      ctx.strokeStyle = 'black';
      ctx.stroke();
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
