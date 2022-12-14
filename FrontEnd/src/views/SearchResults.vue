<template>
    <div class="searchresults">
        <v-container>

            <h1>Risultati ricerca {{ cate }}</h1>
            <input type="text" ref="input">
            <v-btn @click="onInput"> ok </v-btn>
            <h2>{{ $store.state.category }}</h2>
        </v-container>
        <v-card class="mx-auto justify-center" max-width="1000">
            <v-container v-if="!isEmpty" fluid>
                <v-row dense>
                    <v-col v-for="annuncio in annunci" :key="annuncio._id" :cols="4">
                        <v-card flat @click="selectCat(category.title)">
                            <v-img rounded :src="require('../assets/vuoto.webp')" class="white--text align-end" contain>
                            </v-img>
                            <span class="secondary right">{{ annuncio.titolo }}</span>
                            <span clas="secondary"> {{ annuncio.prezzo }}</span>
                            <v-spacer></v-spacer>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <h1 v-else>Non sono presenti risultati.</h1>
        </v-card>
    </div>

</template>

<script>
import { mapState } from "vuex";


export default {
    data () {
        return {
            annunci: [],
            localCat: '',
            endpoint: '',
            cat: '',
            method: '',
            isEmpty: false,
            API_URL: 'http://localhost:8080/api/a/'
        }
    },
    computed:  mapState({
       cate: state => state.category
    }),


    methods: {
        async getfa() {
            try {
                fetch(this.endpoint, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ categoria: this.cat }),
                }).then((resp) =>resp.json())
                .then(data => {
                  // Here you get the data to modify as you please

                this.annunci = data
                if (this.annunci[0] === undefined) this.isEmpty=true; 
                  return;
                })
                } catch(error) {
                    console.error(error); // If there is any error you will catch them here
                }
        },
        async getAll() {
            try {
                console.log(this.endpoint)
                fetch(this.endpoint, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) =>resp.json())
                .then(data => {
                  // Here you get the data to modify as you please
                this.annunci = data
                if (this.annunci[0] === undefined) this.isEmpty=true; 
                  return;
                })
                } catch(error) {
                    console.error(error); // If there is any error you will catch them here
                }
        },
    
        onInput() {
            this.cat = this.$refs.input.value
            this.$store.commit('selectCat', this.localCat)
        }
    },
    created() {
        this.cat = this.$store.state.category;
        console.log("La categoria è: ", this.cat)
        if (this.cat === '') {
            this.endpoint = this.API_URL+'getAll'
            this.method = 'GET'
            this.getAll();
            //if (this.annunci)
        } else {
            this.endpoint = this.API_URL+'getaf';
            this.method = 'POST'
            this.getfa();
        } 
        this.$store.commit('isResultView', true)           
    }    
}
</script>