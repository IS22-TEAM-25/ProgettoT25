<template>
    <v-card>
        <v-row>
            <v-col>
                <v-row>
                <v-spacer></v-spacer>

                    <v-col>
                        <h3> RECENSIONI RICEVUTE</h3>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
                <v-divider></v-divider>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                    <v-row>
                        <v-col>
                            UTENTE RECENSORE
                        </v-col>                  
                        <v-col>
                            STELLE
                        </v-col>
                        <v-col cols="5">
                            DESCRIZIONE
                        </v-col>
                        <v-col>
                            DATA
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="recensione in recensioniUscita" :key="recensione._id">
                <v-list-item-content>
                    <v-row>

                        <v-col @click="vaiAlProfilo(recensione.utenteRecensore)">
                            {{ recensione.utenteRecensore }}
                        </v-col>                    
                        <v-col>
                            <v-rating :value="recensione.stelle" color="amber" dense half-increments readonly size="14">
                        
                            </v-rating>
                        </v-col> 
                        <v-col cols="5">                      
                            {{ recensione.descrizione }}
                        </v-col>
                        <v-col>
                            {{ formattedDate(recensione.dataRecensione) }}
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
                        <h3> RECENSIONI EFFETTUATE</h3>
                    </v-col>
                <v-spacer></v-spacer>

                </v-row>
                <v-divider></v-divider>

            <v-list>
                <v-list-item>
                    <v-list-item-content>
                    <v-row>
                        <v-col>
                            UTENTE RECENSITO
                        </v-col>                  
                        <v-col>
                            STELLE
                        </v-col>
                        <v-col cols="5">
                            DESCRIZIONE
                        </v-col>
                        <v-col>
                            DATA
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="recensione in recensioniEntrata" :key="recensione._id">
                <v-list-item-content>
                    <v-row>
                        <v-col @click="vaiAlProfilo(recensione.utenteRecensito)">
                            {{ recensione.utenteRecensito }}
                        </v-col>                    
                        <v-col>
                            <v-rating :value="recensione.stelle" color="amber" dense half-increments readonly size="14">
                        
                            </v-rating>
                        </v-col> 
                        <v-col cols="5">
                            {{ recensione.descrizione }}
                        </v-col>
                        <v-col>
                            {{ formattedDate(recensione.dataRecensione) }}
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
            recensioniUscita: [],
            recensioniEntrata: []
        }
    },
    computed: {
        
    },
    methods: {
        vaiAlProfilo(utenteSelezionato) {
            this.$store.state.utenteSelezionato = utenteSelezionato;
            this.$router.push("/profiloEsterno");
        },
        async getRecensioniUtente() {
            try {
                fetch(this.$url + "api/r/getrv/" + this.$store.state.datiUtente.username, {
                    method: 'GET',
                    headers: { 
                        "Content-Type": "application/json", 
                    }
                }).then((resp) => resp.json())
                    .then(data => {
                        if (data.success === false) {
                            this.recensioniUscita = [];
                        } else {
                            this.recensioniUscita = data;
                        }
                    })
            } catch (error) {
                console.error(error);
            }
            try {
                fetch(this.$url + "api/r/getra/" + this.$store.state.datiUtente.username, {
                    method: 'GET',
                    headers: { 
                        "Content-Type": "application/json", 
                        "x-access-token": this.$store.state.dataAuth.token
                    }
                }).then((resp) => resp.json())
                    .then(data => {
                        if (data.success === false) {
                            this.recensioniEntrata = [];
                        } else {
                            this.recensioniEntrata = data;
                        }
                    })
            } catch (error) {
                console.error(error);
            }
        },
        formattedDate(date) {
            return format(new Date(date), 'dd/M/YYY');
        }
    },

    async created() {
        if (this.$store.state.dataAuth.success === false) {
            this.$router.push("/");
        } else {
            this.$store.commit('isResultView', false);
            await this.getRecensioniUtente();
        }
    },

}
</script>