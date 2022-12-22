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

      <v-col cols="3" >

        <v-spacer></v-spacer>
      </v-col>
    <v-col cols="5">
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
      </v-col>
      <v-col >
        <v-btn 
        rounded 
        color="green"
       to="/classificaUtenti">Top Users!</v-btn>
      </v-col>
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
        this.$store.state.filtri.categoria = '';
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
