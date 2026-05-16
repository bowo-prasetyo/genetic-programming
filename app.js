const Home = {
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
