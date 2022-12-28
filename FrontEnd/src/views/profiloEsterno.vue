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
                            <span class="font-weight-light"> {{ this.utenteEsterno.nome }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Cognome:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.utenteEsterno.cognome }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Username:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.utenteEsterno.username }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Data di Nascita:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ formattedDate(this.utenteEsterno.datadinascita) }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Indirizzo:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.utenteEsterno.indirizzo }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Email:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.utenteEsterno.email }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Metodo di Pagamento:</span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.utenteEsterno.metodiPagamento }} </span> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <span class="font-weight-regular">Iscritto dal: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ formattedDate(this.profiloUtenteEsterno.dataCreazioneProfilo) }}</span>
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
                        <span class="font-weight-light" style="padding:0px 0px 0px 10px"> {{ this.profiloUtenteEsterno.descrizioneProfilo }} </span>
                    </v-row>
                    <v-row>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Pezzi venduti: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.profiloUtenteEsterno.prodottiVenduti }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Annunci online vendita: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.profiloUtenteEsterno.annunciOnlineVendita }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Annunci online affitto: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.profiloUtenteEsterno.annunciOnlineAffitto }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Annunci online totale: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.profiloUtenteEsterno.annunciOnlineAffitto + this.profiloUtenteEsterno.annunciOnlineVendita}}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span class="font-weight-regular">Transazioni completate: </span>
                        </v-col>
                        <v-col>
                            <span class="font-weight-light"> {{ this.profiloUtenteEsterno.transazioniCompletate }}</span>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-window>
    </v-card>
    <v-card>
        <v-list>
            <v-list-item>
                <v-list-item-content v-if="this.profiloUtenteEsterno.annunciOnlineAffitto + this.profiloUtenteEsterno.annunciOnlineVendita != 0">
                    <v-row>
                        <v-col>
                            <h3 align="center"> ANNUNCI ONLINE </h3>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            NOME ANNUNCIO
                        </v-col>
                        <v-divider vertical="true" width="2"></v-divider>                    
                        <v-col>
                            CATEGORIA
                        </v-col>
                        <v-divider vertical="true" width="2"></v-divider> 
                        <v-col>
                            VENDITA o AFFITTO
                        </v-col>
                        <v-divider vertical="true" width="2"></v-divider>  
                        <v-col>
                            PREZZO VENDITA / PREZZO AFFITTO AL GIORNO
                        </v-col>
                    </v-row>
                </v-list-item-content>
                <v-list-item-content v-else>
                    <v-row>
                        <v-col>
                            <h3 align="center"> NESSUN ANNUNCIO ONLINE </h3>
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="annuncio in annunciUtente" :key="annuncio.titolo">
                <v-list-item-content>
                    <v-row v-if="annuncio.visibile" @click="vaiAlleSpec(annuncio)">
                        <v-col>
                            {{ annuncio.titolo }}
                        </v-col>                   
                        <v-divider vertical="true" width="2"></v-divider>    
                        <v-col>
                            {{ annuncio.categoria }}
                        </v-col>
                        <v-divider vertical="true" width="2"></v-divider>
                        <v-col>
                            {{ annuncio.modalitaTransazione }}
                        </v-col>
                        <v-divider vertical="true" width="2"></v-divider>   
                        <v-col v-if="annuncio.modalitaTransazione === 'Vendita'">
                            {{ euro.format(annuncio.prezzo)}}
                        </v-col>
                        <v-col v-else>
                            {{ euro.format(annuncio.prezzoAffittoAlGiorno)}}
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-card>
    <v-card v-if="recensioniUscita.lenght!=0">
        <v-row>
            <v-col>
                <v-row>
                <v-spacer></v-spacer>

                    <v-col>
                        <h3 align="center"> RECENSIONI RICEVUTE</h3>
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
                        <v-divider vertical="true" width="2"></v-divider>               
                        <v-col>
                            STELLE
                        </v-col>
                        <v-divider vertical="true" width="2"></v-divider>
                        <v-col cols="5">
                            DESCRIZIONE
                        </v-col>
                        <v-divider vertical="true" width="2"></v-divider>
                        <v-col>
                            DATA
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="recensione in recensioniUscita" :key="recensione._id">
                <v-list-item-content>
                    <v-row>

                        <v-col @click="vaiAlProfilo(recensione.utenteRecensore)"> {{ recensione.utenteRecensore }}  </v-col> 
                        <v-divider vertical="true" width="2"></v-divider>                   
                        <v-col>
                            <v-rating :value="recensione.stelle" color="amber" dense half-increments readonly size="14">
                        
                            </v-rating>
                        </v-col> 
                        <v-divider vertical="true" width="2"></v-divider>
                        <v-col cols="5">                      
                            {{ recensione.descrizione }}
                        </v-col>
                        <v-divider vertical="true" width="2" ></v-divider>
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
    <v-card v-else>
         <v-col>
                <h3 align="center"> 0 RECENSIONI RICEVUTE</h3>
        </v-col>
    </v-card>
</v-container>

</template>


<script>
import format from 'date-fns/format';

export default {
    data(){
        return {
            annunciUtente: [],
            recensioniUscita: [],
            utenteEsterno: {},
            profiloUtenteEsterno: {},
            euro:
                new Intl.NumberFormat('en-DE', {
                    style: 'currency',
                    currency: 'EUR',
            }),
        }
    },
    methods: {
        vaiAlProfilo(utenteSelezionato) {
            this.$store.state.utenteSelezionato = utenteSelezionato;
            this.created()
        },
        formattedDate(date) {
            return format(new Date(date), 'dd/M/YYY');
        },
        vaiAlleSpec(annuncio) {
            this.$store.state.annuncioSelezionato = annuncio;
            this.$router.push("/productspecs");
        },
        async getProfile() {
            console.log("dentro get profile")
            try {
                fetch(this.$url + "api/p/getp/" + this.$store.state.utenteSelezionato, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) => resp.json())
                    .then(data => {
                        this.profiloUtenteEsterno = data;
                    })
            } catch (error) {
                console.error(error);
            }
        },
        async getUtente() {
            console.log("dentro get profile")
            try {
                fetch(this.$url + "api/u/getu/" + this.$store.state.utenteSelezionato, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) => resp.json())
                    .then(data => {
                        this.utenteEsterno = data;
                    })
            } catch (error) {
                console.error(error);
            }
        },
        async getRecensioniUtente() {
            try {
                fetch(this.$url + "api/r/getrv/" + this.$store.state.utenteSelezionato, {
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
        },
        async getAnnunciUtente() {
            try {
                fetch(this.$url + "api/a/getau/" + this.$store.state.utenteSelezionato, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) => resp.json())
                    .then(data => {
                        this.annunciUtente = data;
                        console.log(data);
                    })
            } catch (error) {
                console.error(error);
            }
        },
        async created() {
        await this.getProfile();
        await this.getUtente();
        await this.getRecensioniUtente();
        await this.getAnnunciUtente()
        
    }
    },
    async created() {
        await this.getProfile();
        await this.getUtente();
        await this.getRecensioniUtente();
        await this.getAnnunciUtente()
        
    }
}
</script>