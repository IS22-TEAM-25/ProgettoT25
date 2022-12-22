<template>
    <v-container >
        <v-card class="elevation-3">
        <v-window class="spacing-playground pa-6">
            <v-row>
                <v-col>
                    
                    <v-row>
                        <h2>Dati personali:</h2> 
                    </v-row>
                    <v-row>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Nome:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ utente.nome }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Cognome:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ utente.cognome }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Username:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ utente.username }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Data di Nascita:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ formattedDate(utente.datadinascita) }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Indirizzo:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ utente.indirizzo }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Email:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ utente.email }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Metodo di Pagamento:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ utente.metodiPagamento }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Iscritto dal: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ formattedDate(profilo.dataCreazioneProfilo) }}</span>
                        </v-col>
                    </v-row>
                </v-col>
                <v-divider vertical="true" width="2" color="black"></v-divider>
                <v-col>
                    <v-row>
                        <h2 style="padding:0px 0px 0px 10px">   Descrizione Profilo:</h2>
                    </v-row>
                    <v-row>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row>
                        <span class="font-weight-light" style="padding:0px 0px 0px 10px"> {{ profilo.descrizioneProfilo }} </span>
                    </v-row>
                    <v-row>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Guadagno totale affitti: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ euro.format(profilo.guadagnoDagliAffitti) }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Guadagno totale vendite: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ euro.format(profilo.guadagnoDalleVendite) }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Pezzi venduti: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ profilo.prodottiVenduti }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Annunci online vendita: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ profilo.annunciOnlineVendita }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Annunci online affitto: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ profilo.annunciOnlineAffitto }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Annunci online totale: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ profilo.annunciOnlineAffitto + profilo.annunciOnlineVendita}}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Transazioni completate: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ profilo.transazioniCompletate }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Soldi spesi: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ euro.format(profilo.soldiSpesi) }}</span>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <modificaDatiUtente/>
                </v-col>
                <v-spacer></v-spacer>
                <v-col>
                   <modificaDescrizione/>
                </v-col>
            </v-row>
        </v-window>
    </v-card>
</v-container>

</template>


<script>
import modificaDatiUtente from "@/components/modificaDatiUtente.vue";
import modificaDescrizione from "@/components/modificaDescrizione.vue";
import { mapState } from "vuex";
import format from 'date-fns/format';

export default {
    components: {modificaDatiUtente, modificaDescrizione},
    data() {
        return {
            euro:
                new Intl.NumberFormat('en-DE', {
                    style: 'currency',
                    currency: 'EUR',
        }),
        }
    },
    methods: {
        formattedDate(date) {
            return format(new Date(date), 'dd/M/YYY');
        },
        async getProfile() {
            console.log("dentro get profile")
            try {
                fetch(this.$url + "api/p/getp/" + this.username, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) => resp.json())
                    .then(data => {
                        this.$store.commit('prendiProfiloUtente', data);
                        console.log(data);
                    })
            } catch (error) {
                console.error(error);
            }
        }
    },  
    computed: {
        
        ...mapState({
            utente: 'datiUtente',
            profilo: 'profiloUtente'
        }),
    },
}
</script>