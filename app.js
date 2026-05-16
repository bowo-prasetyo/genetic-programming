const Home = {
  template: `
  <div class="container">

    <h1>Browser Genetic Programming</h1>

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
      expressionText: ''
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

      this.worker = new Worker('worker.js');

      this.worker.onmessage = (e) => {
        const msg = e.data;

        if (msg.type === 'update') {
          this.generation++;

          this.best = msg.best;
          this.bestFitness = msg.fitness;

          this.history.unshift({
            generation: this.generation,
            fitness: this.bestFitness,
            expression: msg.expression
          });

          if (this.history.length > 20) {
            this.history.pop();
          }

          this.drawCanvas();
          this.saveBest();
        }
      };

      this.worker.postMessage({ type: 'start' });
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
