<template>
    <v-card>
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-row>
                        <v-col>
                            NOME UTENTE
                        </v-col>                  
                        <v-col>
                            RATING
                        </v-col>
                        <v-col>
                           RECENSIONI RICEVUTE
                        </v-col>
                        <v-col>
                            TOTALE TRANSAZIONI
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="utente in utenti" :key="utente.username">
                <v-list-item-content>
                    <v-row>
                        <v-col>
                            {{ utente._id }}
                        </v-col>                    
                        <v-col>
        
                            <v-row dense>
                                <v-col>
                                    {{ utente.rating.toFixed(1) }}
                                </v-col>
                                <v-col>

                                    <v-rating :value="utente.rating" color="amber" dense half-increments readonly size="14">
                                        
                                    </v-rating>
                                </v-col>
                                
                            </v-row>
                
                        </v-col>
                        <v-col>
                            {{ utente.recensioniRicevute }}
                        </v-col>
                        <v-col>
                            {{ utente.transazioniCompletate }}
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>

export default {
    data() {
        return {
            classificaUtenti: []
        }
    },
    computed: {
        utenti() {
            return this.classificaUtenti.filter(v => v.recensioniRicevute !== 0);
        }
    },
    methods: {
        async getBest() {
            try {
                fetch(this.$url + "api/p/getbest/", {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) => resp.json())
                    .then(data => {
                        this.classificaUtenti = data;
                        console.log(data);
                    })
            } catch (error) {
                console.error(error);
            }
        }
    },
    created() {
      this.getBest();  
    },
}
</script>