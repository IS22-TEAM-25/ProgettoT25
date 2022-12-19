<template>
  <v-app>
  <MyNavbar />
  <v-main>
    <router-view></router-view>
  </v-main>

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
