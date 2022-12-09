<template>
  <v-app>
  <MyNavbar />
  <v-content>
    <router-view></router-view>
  </v-content>

  </v-app>
</template>

<script>
import MyNavbar from '@/components/MyNavbar'
export default {
  name: 'App',
  components: { MyNavbar },
  data: () => ({
    //
  }),
};
</script>
