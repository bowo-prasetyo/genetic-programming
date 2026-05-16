const Home = {
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
