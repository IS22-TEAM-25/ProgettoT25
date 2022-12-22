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

                        <v-col>
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
        <v-divider vertical="true" width="2" color="black"></v-divider>
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
                        <v-col>
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
        async getRecensioniUtente() {
            try {
                fetch(this.$url + "api/r/getrv/" + this.$store.state.datiUtente.username, {
                    method: 'GET',
                    headers: { 
                        "Content-Type": "application/json", 
                    }
                }).then((resp) => resp.json())
                    .then(data => {
                        this.recensioniUscita = data;
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
                        this.recensioniEntrata = data;
                    })
            } catch (error) {
                console.error(error);
            }
        },
        formattedDate(date) {
            return format(new Date(date), 'dd/M/YYY');
        },
        // getTitolo(item) {
        //     console.log(item)
        //     try {
        //         fetch(this.$url + "api/r/getrt/" + item.transazioneRecensita, {
        //             method: 'GET',
        //             headers: { 
        //                 "Content-Type": "application/json", 
        //             }
        //         }).then((resp) => resp.json())
        //             .then(data => {
        //                 item.titolo = data.prodotto;
        //                 console.log("titolo: ", item.titolo)
        //             })
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
    },

    async created() {
        await this.getRecensioniUtente();  
    //     console.log(" ciao sono crreated")
    //     this.recensioniEntrata.forEach((item) =>{
    //         console.log(item)
    //         try {
    //             fetch(this.$url + "api/r/getrt/" + item.transazioneRecensita, {
    //                 method: 'GET',
    //                 headers: { 
    //                     "Content-Type": "application/json", 
    //                 }
    //             }).then((resp) => resp.json())
    //                 .then(data => {
    //                     item.titolo = data.prodotto;
    //                     console.log("titolo: ", item.titolo)
    //                 })
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     })
    //     console.log(" ciao sono crreated1")
    // //   this.recensioniUscita.forEach(this.getTitolo())
    //   console.log(" ciao sono crreated2")
    },

}
</script>