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
      best: {
        left: 'x',
        op: '+',
        right: '1'
      },
      bestFitness: 0,
      db: null
    };
  },

  computed: {
    expression() {
      return `${this.best.left} ${this.best.op} ${this.best.right}`;
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
app.mount('#app');
