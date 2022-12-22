<template>
    <v-card>
        <v-row>
            <v-col>
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
                        <v-col>
                            {{ transazione.venditore }}
                        </v-col>
                        <v-col>
                            {{ transazione.dataTransazione }}
                        </v-col>
                        <v-col>
                            {{ transazione.costo }}€
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        </v-col>
        <v-col>
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
                        <v-col>
                            {{ transazione.acquirente }}
                        </v-col>
                        <v-col>
                            {{ transazione.dataTransazione }}
                        </v-col>
                        <v-col>
                            {{ transazione.costo }}€
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

export default {
    data() {
        return {
            transazioniUscita: [],
            transazioniEntrata: []
        }
    },
    computed: {
        
    },
    methods: {
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
                        this.transazioniUscita = data;
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
                        this.transazioniEntrata = data;
                    })
            } catch (error) {
                console.error(error);
            }
        },
    },

    created() {
      this.getTransazioniUtente();  
    },
}
</script>