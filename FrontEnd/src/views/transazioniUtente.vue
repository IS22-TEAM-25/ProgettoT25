<template>
    <v-card>
        <v-row>
            <v-col>
                <v-row>
                <v-spacer></v-spacer>

                    <v-col>
                        <h3> STORICO TRANSAZIONI</h3>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
                <v-divider></v-divider>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                    <v-row>
                        <v-col>
                            ANNUNCIO
                        </v-col>                  
                        <v-col>
                            VENDITORE
                        </v-col>
                        <v-col>
                            DATA
                        </v-col>
                        <v-col>
                            IMPORTO
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="transazione in transazioniEntrata" :key="transazione._id">
                <v-list-item-content>
                    <v-row>
                        <v-col>
                            {{ transazione.prodotto }}
                        </v-col>                    
                        <v-col @click="vaiAlProfilo(transazione.venditore)">
                            {{ transazione.venditore }}
                        </v-col>
                        <v-col>
                            {{ formattedDate(transazione.dataTransazione) }}
                        </v-col>
                        <v-col>
                            {{  euro.format(transazione.costo) }}
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        </v-col>
        <v-divider :vertical=true width="2" color="black"></v-divider>
        <v-col>
            <v-row>
                <v-spacer></v-spacer>

                    <v-col>
                        <h3> TRANSAZIONI IN USCITA</h3>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
                <v-divider></v-divider>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                    <v-row>
                        <v-col>
                            ANNUNCIO
                        </v-col>                  
                        <v-col>
                            ACQUIRENTE
                        </v-col>
                        <v-col>
                            DATA
                        </v-col>
                        <v-col>
                            IMPORTO
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="transazione in transazioniUscita" :key="transazione._id">
                <v-list-item-content>
                    <v-row>
                        <v-col>
                            {{ transazione.prodotto }}
                        </v-col>                    
                        <v-col @click="vaiAlProfilo(transazione.acquirente)">
                            {{ transazione.acquirente }}
                        </v-col>
                        <v-col>
                            {{ formattedDate(transazione.dataTransazione) }}
                        </v-col>
                        <v-col>
                            {{  euro.format(transazione.costo)}}
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        </v-col>
    </v-row>
    </v-card>
</template>

<script>
import format from 'date-fns/format';
export default {
    data() {
        return {
            transazioniUscita: [],
            transazioniEntrata: [],
            euro:
                new Intl.NumberFormat('en-DE', {
                    style: 'currency',
                    currency: 'EUR',
            })
        }
    },
    computed: {
        
    },
    methods: {
        vaiAlProfilo(utenteSelezionato) {
            this.$store.state.utenteSelezionato = utenteSelezionato;
            this.$router.push("/profiloEsterno");
        },
        async getTransazioniUtente() {
            try {
                fetch(this.$url + "api/t/gettv/" + this.$store.state.datiUtente.username, {
                    method: 'GET',
                    headers: { 
                        "Content-Type": "application/json", 
                        "x-access-token": this.$store.state.dataAuth.token
                    }
                }).then((resp) => resp.json())
                    .then(data => {
                        if(data.success === false){
                            this.transazioniUscita = [];
                        } else {
                            this.transazioniUscita = data;
                        }
                    })
            } catch (error) {
                console.error(error);
            }
            try {
                fetch(this.$url + "api/t/getta/" + this.$store.state.datiUtente.username, {
                    method: 'GET',
                    headers: { 
                        "Content-Type": "application/json", 
                        "x-access-token": this.$store.state.dataAuth.token
                    }
                }).then((resp) => resp.json())
                    .then(data => {
                        if(data.success === false){
                            this.transazioniEntrata = [];
                        } else {
                            this.transazioniEntrata = data;
                        }
                    })
            } catch (error) {
                console.error(error);
            }
        },
        formattedDate(date) {
            return format(new Date(date), 'dd/M/YYY');
        },
    },
    created() {
        if (this.$store.state.dataAuth.success === false) {
            this.$router.push("/");
        } else {
            this.$store.commit('isResultView', false);
            this.getTransazioniUtente();
        }
    },
}
</script>