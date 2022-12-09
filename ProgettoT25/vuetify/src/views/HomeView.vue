<template>
  <div class="home" >
    <h1 class="secondary--text mt-2 mx-3" align="center">
      <div>
        <span>Affitta o </span><span class="accent--text"> compra</span>
      </div>
        <span>
          quello che vuoi, dove vuoi e quando vuoi
        </span>
    </h1>
    
    <v-row class="mt-2 mx-3" dense>

      <v-spacer></v-spacer>
      <v-text-field

      class="d-inline-flex pa-2"
      placeholder="bicicletta, drone, consolle..."
      filled
      dense
      rounded
      append-icon="mdi-magnify"
      ></v-text-field> 
      <v-spacer></v-spacer>
    </v-row>
    <categoryGrid/>

  </div>

</template>

<script>
import categoryGrid from '@/components/categoryGrid'


  export default {
    components : { categoryGrid },
    name: 'MyHome',

  }
</script>
