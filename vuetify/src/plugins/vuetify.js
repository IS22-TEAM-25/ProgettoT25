import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
    icons: {
        iconfont: 'md' || 'fa'
    },
    theme: {
      themes: {
        light: {
          primary: '#F0F0F0',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c',
        },
      },
    },
  })

  export default vuetify;