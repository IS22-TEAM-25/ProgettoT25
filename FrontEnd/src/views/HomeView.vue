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
      v-model="keyword"
      
      placeholder="bicicletta, drone, consolle..."
      color="accent acccent-3"
      filled
      dense
      rounded
      append-icon="mdi-magnify"
      @keyup.enter="ricercakw"
      @click:append="ricercakw"
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
    data () {
      return {
        keyword: '',
      }
    },
    methods: {
      ricercakw() {
        this.$store.state.keyword = this.keyword;
        this.$store.state.category = '';
        this.$router.push("/searchresults") 
      }
    },
    mounted()  {
      this.$store.commit('isResultView', false);
      this.$store.commit('resetResult');
      this.$store.commit('resettaFiltri');

    }
  }
</script>
