<template>
    <div class="searchresults">
       
        <v-card class="mx-auto justify-center" max-width="1000">
            <v-container v-if="!isEmpty" fluid>
                <v-row dense>
                    <v-col v-for="annuncio in annunci" :key="annuncio._id" :cols="4">
                        <v-card  :id="annuncio.titolo" @click="vaiAlleSpec(annuncio)" on >
                            <v-img  rounded :src="require('../assets/vuoto.webp')"  class="white--text align-end"  contain> </v-img>
                            <v-card >
                            <v-card-title color="grey" class="indigo--text">{{ annuncio.titolo }}</v-card-title>
                                <v-card-text class="black--text" > 
                                    <v-card flat v-if="annuncio.modalitaTransazione ==='Vendita'"
                                    align="center"
                                    class="mx-0"
                                    >
                                    <h4 class="grey--text">
                                        prezzo proposto
                                    </h4>
                                    <h4>
                                        {{ euro.format(annuncio.prezzo) }} 
                                    </h4>
                                    
                                </v-card>
                                <v-card flat v-else-if="annuncio.modalitaTransazione === 'Affitto'"
                                align="center"
                                class="mx-0"
                                >
                                <h4 class="grey--text">ora     /     giorno     /    settimana</h4>

                                <h4>
                                   {{euro.format(annuncio.prezzoAffittoAllOra)}}    /   {{euro.format(annuncio.prezzoAffittoAlGiorno)}}     /   {{euro.format(annuncio.prezzoAffittoSettimanale)}} 
                                </h4>
                            
                            </v-card>
                            <!-- capire perchè le recensioni  -->
                                <v-card >
                                    <span> {{ annuncio.rating }} asdf</span>
                                    <v-rating :value="annuncio.rating" color="amber" dense half-increments readonly size="14" ></v-rating>
                                    <div class="grey--text"> {{annuncio.inserzionista}} 
                                        {{ annuncio.nRecensioni }}
                                    </div>
                                    <div>Pubblicato il: {{ formattedDate(annuncio.dataPubblicazione) }}</div>
                                </v-card>
                                </v-card-text>
                            </v-card>
                            <v-spacer></v-spacer>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <h1 v-else>{{ message }}</h1>
        </v-card>
    </div>

</template>

<script>
import { mapState } from "vuex";
import format from 'date-fns/format';

export default {
    data () {
        return {
            headerAffitto: [
                "€/ora",
                "€/giorno",
                "€/settimana"
            ],
            prezziAffitto: [

            ],
            message:'',
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
    computed:  {

        ...mapState({
            cate: 'category',
            //annunci: state => state.annunci
        }),
        annunci() {
            return this.$store.state.annunci.filter(this.filtraggio)
        },
        annuncioRating() {
            return this.$store.state.annunci.rating;
        }
    },


    methods: {
        formattedDate(date) {
            return format(new Date(date), 'dd/M/YYY')
        },
        async getRating(annuncio) {
            try {
                fetch(this.$url + "api/p/getp/" + annuncio.inserzionista, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) => resp.json())
                .then(data => {
                    annuncio.rating = data.rating;
                    console.log("Il rating per", annuncio.inserzionista, " è di ", annuncio.rating)
                })
            } catch (error) {
                console.error(error);
            }
        },  
        async getNumRecensioni(annuncio) {
            try {
                fetch(this.$url + "api/p/getp/" + annuncio.inserzionista, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) => resp.json())
                .then(data => {
                console.log("il numero di recensioni ricevute da ", annuncio.inserzionista, " sono:", data.recensioniRicevute)
                annuncio.nRecensioni = data.recensioniRicevute;
                })
            } catch (error) {
                console.error(error);
            }
        },  
        async getfa() {
            try {
                fetch(this.endpoint, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ categoria: this.cat }),
                }).then((resp) =>resp.json())
                .then(data => {
                // Here you get the data to modify as you please
                    if(data[0] === undefined) {
                        this.isEmpty=true; 
                        this.message = "Non è presente alcun articolo disponibile per questa categoria.";
                        return;
                    }
                    this.$store.state.annunci=data.filter(a => a.visibile === true);
                    this.$store.state.annunci = this.$store.state.annunci.filter(a => a.inserzionista !== this.$store.state.datiUtente.username);
                    if (this.$store.state.annunci[0] === undefined) {
                        this.isEmpty=true; 
                        this.message = "Non è presente alcun articolo disponibile per questa categoria.";
                        return;
                    }
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
                    this.$store.state.annunci = data;
                    if (this.$store.state.annunci[0] === undefined) {
                        this.isEmpty=true; 
                        this.message = this.$store.state.annunci.message;
                        return;
                    }
                    console.log()
                    this.$store.state.annunci = this.$store.state.annunci.filter(a => a.visibile === true)
                    this.$store.state.annunci = this.$store.state.annunci.filter(a => a.inserzionista !== this.$store.state.datiUtente.username);
                    })
                } catch(error) {
                    console.error(error); // If there is any error you will catch them here
                }
        },
        vaiAlleSpec(annuncio) {
            this.$store.state.annuncioSelezionato = annuncio;
            this.$router.push("/productspecs");
        },  
        onInput() {
            this.cat = this.$refs.input.value
            this.$store.commit('selectCat', this.localCat)
        },
        filtraggio(x) {  
          var ok = true;
          if (!this.$store.state.filtri.affitto && x.modalitaTransazione === 'Affitto')  {
            ok = false;
        }
          if (!this.$store.state.filtri.vendita && x.modalitaTransazione === 'Vendita') {
            ok = false;
          }
          if (x.modalitaTransazione === "Vendita") {
            if (x.prezzo < this.$store.state.filtri.prezzoVenditaMin) {
                ok = false;
            }
            if (x.prezzo > this.$store.state.filtri.prezzoVenditaMax) {
                ok = false;
            }
          }
          if (x.modalitaTransazione === "Affitto") {
            if (x.prezzoAffittoAlGiorno < this.$store.state.filtri.prezzoAffittoMin) {
                ok = false;
            }
            if (x.prezzoAffittoAlGiorno > this.$store.state.filtri.prezzoAffittoMax) {
                ok = false;
            }
          }
          if (this.$store.state.filtri.categoria !== '' && x.categoria !== this.$store.state.filtri.categoria) {
            ok = false;
            }
            if(this.$store.state.filtri.pagamentoOnline && this.$store.state.filtri.pagamentoOnline === true) {
                if(this.$store.state.filtri.pagamentoOnline !== x.pagamentoOnline) {
                    ok = false;
                } 
            } 
          return ok;
        }

    },
    async created() {
        console.log(this.$store.state.dallaWL)
        if(!this.$store.state.dallaWL) {
            console.log("ciaoooo")
            this.cat = this.$store.state.filtri.categoria;
            if(this.$store.state.keyword !== '') {
                this.endpoint = this.API_URL + "getkt/" + this.$store.state.keyword;
                await this.getAll();
            }
            else if (this.cat === '') {
                this.endpoint = this.API_URL+'getAll';
                await this.getAll();
            } else {
                this.endpoint = this.API_URL+'getaf';
                await this.getfa();
            } 
        }
        this.$store.commit('isResultView', true);
        for (let i = 0; i < this.$store.state.annunci.length; i++) {
            this.getRating(this.$store.state.annunci[i]);
            console.log(i);
            console.log(this.$store.state.annunci[i].rating)
        }
        // this.$store.state.annunci.forEach(annuncio => this.getRating(annuncio));
        // this.$store.state.annunci.forEach(annuncio => this.getNumRecensioni(annuncio));
        this.$store.state.dallaWL = false;
    },
    updated() {
        if(this.$store.state.annunci[0] === undefined) this.isEmpty = true;
    } 
}
</script>