<template>
    <div class="searchresults">
       
        <v-card class="mx-auto justify-center" max-width="1000">
            <v-container v-if="!isEmpty" fluid>
                <v-row dense>
                    <v-col v-for="annuncio in annunci" :key="annuncio._id" :cols="4">
                        <v-card flat @click="vaiAlleSpec" on>
                            <v-img 
                            rounded 
                            :src="require('../assets/vuoto.webp')" 
                            class="white--text align-end" 
                            contain>
                            </v-img>
                            <v-card>
                            <v-card-title class="black--text">{{ annuncio.titolo }}</v-card-title>
                                <v-card-text class="black--text"> 
                                    <v-row
                                    align="center"
                                    class="mx-0"
                                    >
                                    
                                    <h2>

                                        {{ euro.format(annuncio.prezzo) }} 
                                    </h2>
                                    
                                </v-row>
                                <v-row>
                                    
                                    <v-rating
                                    :value="4.5"
                                    color="amber"
                                    dense
                                    half-increments
                                    readonly
                                    size="14"
                                    ></v-rating>
                                    <div class="grey--text"> {{annuncio.inserzionista}} (10)</div>
                                </v-row>
                                </v-card-text>
                            </v-card>
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
            localCat: '',
            endpoint: '',
            cat: '',
            method: '',
            keyword: '',
            isEmpty: false,
            API_URL: this.$url + 'api/a/',
            euro:  
            new Intl.NumberFormat('en-DE', {
                style: 'currency',
                currency: 'EUR',
            })

        }
    },
    computed:  mapState({
       cate: state => state.category,
       annunci: state => state.annunci
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

                this.$store.state.annunci = data
                if (this.$store.state.annunci[0] === undefined) this.isEmpty=true; 
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
                this.$store.state.annunci = data
                if (this.$store.state.annunci[0] === undefined) this.isEmpty=true; 
                  return;
                })
                } catch(error) {
                    console.error(error); // If there is any error you will catch them here
                }
        },
        vaiAlleSpec() {
            this.$router.push("/productspecs")
        },  
        onInput() {
            this.cat = this.$refs.input.value
            this.$store.commit('selectCat', this.localCat)
        }
    },
    created() {
        this.cat = this.$store.state.category;
        if(this.$store.state.keyword !== '') {
            this.endpoint = this.API_URL + "getkt/" + this.$store.state.keyword;
            this.getAll();
        }
        else if (this.cat === '') {
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