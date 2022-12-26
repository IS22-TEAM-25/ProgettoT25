<template>
  <v-container class="productspecs">
    <v-row flex>
      <v-col>

        <h1>{{ annuncio.titolo }}</h1>
      </v-col>
      <v-col v-if="utenteLoggato">
        <v-btn block color="orange" rounded v-if="!inWL" @click="aggiungiWL">aggiungi alla wish list</v-btn>
        <v-btn block color="red" rounded v-else @click="aggiungiWL">rimuovi dalla wish list</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-img rounded :src="require('../assets/vuoto.webp')" class="white--text align-end" max-width="400" >
        </v-img>
        
        <v-card >
          <h2 > {{ annuncio.inserzionista }}  </h2>
          <v-rating :value="this.rating" color="amber" dense half-increments readonly size="14"></v-rating>
          <h4>Categoria: {{ annuncio.categoria }} _________________________________________ Pubblicato il: {{ formattedDate(annuncio.dataPubblicazione) }}</h4>
          

          <v-list-item v-for="recensione in this.recensioniUscita" :key="recensione._id">
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

        </v-card>
      </v-col>
      <v-col cols="7">
        <v-card color="grey lighten-5">
          <v-container>

            <h4 >DESCRIZIONE:</h4>
            <p>
              {{ annuncio.descrizione }}
            </p>
          </v-container>
          <v-divider></v-divider>
        <v-container v-if="annuncio.modalitaTransazione==='Affitto'">
          <v-row>
            <v-col>
              <h3>
                COSTO ORARIO 
              </h3>
            </v-col>
            <v-col>
              <h3>
                COSTO GIORNALIERO 
              </h3>
            </v-col>
            <v-col>
              <h3>
                COSTO SETTIMANALE 
              </h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span>
                {{euro.format(annuncio.prezzoAffittoAllOra)}}
              </span>
            </v-col>
            <v-col>
              <span>
                {{euro.format(annuncio.prezzoAffittoAlGiorno)}}
              </span>
            </v-col>
            <v-col>
              <span>
                {{euro.format(annuncio.prezzoAffittoSettimanale)}}
              </span>
            </v-col>
          </v-row>
          
          <v-container v-if="pagamentoOnlineAbilitato">
          <v-row>
            <v-col>
              <h3>
                Seleziona Date:
              </h3>
            </v-col>
          </v-row>
          <v-form class="submit" v-model="valid" >

            <v-row>
              <v-col>

                <v-menu max-width="290">
                  <template v-slot:activator="{ on }">
                    <v-text-field 
                    :value="startDate" 
                    label="Data Iniziale" 
                    type="date"
                    v-on="on">
                  </v-text-field>
                  </template>
                  <v-date-picker 
                  v-model="startDate" 
                  :allowed-dates="disablePastDates"
                  >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu max-width="290">
                <template v-slot:activator="{ on }">
                  <v-text-field 
                  :value="endDate" 
                  label="Data Finale" 
                  type="date"
                  v-on="on" 
                  :rules="required">
                </v-text-field>
                </template>
                <v-date-picker 
                v-model="endDate" 
                :allowed-dates="disablePastDatesFromSelected"
                >
              </v-date-picker>
              </v-menu>
            </v-col>
            </v-row>
            <v-row>

              <v-btn 
              block 
              class="submit white--text" 
              color="indigo"  
              :disabled="!valid"
              @click="acquistaAffitta">Affitta</v-btn>
            </v-row>
          </v-form>
          <v-row>
            <v-col>
              <span>
                Previsto il ritiro in {{ JSON.parse(annuncio.indirizzoRitiro).via }} a
                {{ JSON.parse(annuncio.indirizzoRitiro).citta }} in provincia di 
                {{ JSON.parse(annuncio.indirizzoRitiro).provincia }}
              </span>
            </v-col>
          </v-row>  
        </v-container>

        </v-container>
        <v-container v-else>
          <v-row>
            <v-col>

              <h3>PREZZO DI VENDITA: </h3>
            </v-col>
            <v-col>
              <h3>
                {{euro.format(annuncio.prezzo)}}
              </h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn v-if="pagamentoOnlineAbilitato"
              block 
              color="indigo"
              class="white--text"
              rounded
              @click="acquistaAffitta">
                compralo subito
              </v-btn>
            </v-col>
          </v-row>
          <v-form class="submit" v-model="validMessaggio">

          <v-row v-if="!pagamentoOnlineAbilitato">
            <v-col>
              <v-textarea
                    label="Messaggio"
                    v-model="mesaggioAllInserzionista"
                    :counter="250" 
                    :rules="required"
                    no-resize
                ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn v-if="!pagamentoOnlineAbilitato"
              block 
              color="green"
              class="white--text"
              rounded
              :disabled="!validMessaggio"
              @click="contatta">
                Contatta {{ annuncio.inserzionista }} !!
              </v-btn>
            </v-col>
            
          </v-row>
        </v-form>
        <v-row>
            <v-col>
              <span>
                Previsto il ritiro in {{ JSON.parse(annuncio.indirizzoRitiro).via }} a
                {{ JSON.parse(annuncio.indirizzoRitiro).citta }} in provincia di 
                {{ JSON.parse(annuncio.indirizzoRitiro).provincia }}
              </span>
            </v-col>
          </v-row>  
        <v-snackbar 
              v-model="messaggioInviato"
              color="green"
              >
              Messaggio inviato correttamente!
              </v-snackbar>
        </v-container>
      </v-card>
      </v-col>
    </v-row>
    </v-container>
</template>
  
<script>

import { mapState } from "vuex";
import format from 'date-fns/format';

export default {
  data () {
    return {
      recensioniUscita: [],
      valid: false,
      inWL: false,
      validMessaggio: false,
      dates: [],
      rating: 0,
      startDate: null,
      endDate: null,
      mioAnnuncio: false,
      mesaggioAllInserzionista: '',
      emailInserzionista: '',
      messaggioInviato: false,
      euro:
        new Intl.NumberFormat('en-DE', {
          style: 'currency',
          currency: 'EUR',
        }),
      required: [
        v => !!v || 'Campo obbligatorio'
      ],
    }
  },
  methods: {
    async getRecensioniInserzionista() {
          try {
              fetch(this.$url + "api/r/getrv/" + this.annuncio.inserzionista, {
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
    async creaTransazione() {
      let costoEffettivo = this.$store.state.annuncioSelezionato.prezzo;
      if (this.$store.state.annuncioSelezionato.modalitaTransazione === "Affitto") {
        var differenceInTime = new Date(this.endDate) - new Date(this.startDate);
        var totalDays = differenceInTime / (1000 * 3600 * 24);
        costoEffettivo = this.$store.state.annuncioSelezionato.prezzoAffittoAlGiorno * (totalDays);
        console.log("il numero tot di giorni è: ", totalDays)
      }
      let inserzionista = this.$store.state.annuncioSelezionato.inserzionista;
      let cliente = this.$store.state.datiUtente.username;
      console.log("Il costo calcolato per la transazione è di: ", costoEffettivo)
      try {
        fetch(this.$url + "api/t/savet", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.$store.getters.token},
          body: JSON.stringify({
            venditore: inserzionista,
            acquirente: cliente,
            prodotto : this.$store.state.annuncioSelezionato.titolo,
            pagamentoEffettuato: true,
            metodoTransazione: "Online",
            tipologiaTransazione: this.$store.state.annuncioSelezionato.modalitaTransazione,
            prezzo: costoEffettivo
          })

        }).then((resp) => resp.json())
        .then(data => {
          console.log(data);
          this.$store.state.transazione = data;
          this.contaAnnunciOnline(inserzionista);
          this.aggiornaStatVendita(inserzionista);
          this.aggiornaStatAcquisti(cliente);
        })
        } catch (err) {
          console.error(err);
        }
    },
    async aggiornaStatVendita(nomeUtente) {
      try {
        fetch(this.$url + "api/p/updatesv", {
          method: 'PATCH',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ 
            id: nomeUtente,
          })
        }).then(console.log("Statistiche vendite aggiornate per ", nomeUtente, "!"))
      } catch (error) {
        console.error(error); // If there is any error you will catch them here
      }
    },
    async aggiornaStatAcquisti(nomeUtente) {
      try {
        fetch(this.$url + "api/p/updatesa", {
          method: 'PATCH',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ 
            id: nomeUtente,
          })
        }).then(console.log("Statistiche acquisti aggiornate per ", nomeUtente, "!"))
      } catch (error) {
        console.error(error); // If there is any error you will catch them here
      }
    },
    async nascondiAnnuncio() {
      try {
          fetch(this.$url + "api/a/updatea", {
            method: 'PATCH',
            headers: { 
              "Content-Type": "application/json", 
              "x-access-token": this.$store.getters.token},
            body: JSON.stringify({ 
              titolo: this.$store.state.annuncioSelezionato.titolo, 
              visibile: false
            })
          }).then(console.log("annuncio nascosto!"))
        } catch (error) {
          console.error(error); // If there is any error you will catch them here
        }
    },
    disablePastDates(val) {
       return val >= new Date().toISOString().substr(0, 10)
    },
    disablePastDatesFromSelected(val) {
       return val >= new Date(this.startDate).toISOString().substr(0, 10)
    },
    acquistaAffitta() {
      if (!this.$store.state.dataAuth.success) {
        this.$store.state.prodottoInBallo = true;
        this.$router.push('/userloginsignup');
        return;
      }
      console.log("Affittato dal ", this.startDate, " al ", this.endDate);
      this.nascondiAnnuncio();
      this.creaTransazione();
      this.$router.push('/userreview')
    },
    formattedDate(date) {
      return format(new Date(date), 'dd/M/YYY');
    },
    async contatta() {
      if(!this.$store.state.dataAuth.success) {
          this.$store.state.prodottoInBallo = true;
          this.$router.push('/userloginsignup');
          return;
        }
      try {
          fetch(this.$url + "api/u/getu/" + this.$store.state.annuncioSelezionato.inserzionista, {
              method: 'GET',
              headers: { "Content-Type": "application/json" }
          }).then((resp) => resp.json())
              .then(data => {
                  if(data.success !== undefined) {
                        this.erroreMail = true;
                        return;
                  }
                  this.emailInserzionista = data.email;
                  this.sendeMail()
              })
      } catch (error) {
          console.error(error);
      }
    },
    async sendeMail() {
        try {
            fetch(this.$url + "api/m/sendEmail", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toAddress: this.emailInserzionista,
                    subj: "Richiesta Informazioni da " + this.$store.state.datiUtente.username,
                    message: this.mesaggioAllInserzionista
                })
            }).then(data => {
                    console.log(data);

                    console.log("Messaggio Inviato Correttamente");
                    this.messaggioInviato = true;
                })
        } catch (error) {
            console.error(error);
        }
    },
    async aggiungiWL() {
      let endPoint;
      console.log("In WL è:", this.inWL)
      if(this.inWL) {
        endPoint = 'rimuoviwl'
      } else {
        endPoint = 'addwl'
      }
      try {
            fetch(this.$url + "api/p/" + endPoint, {
                method: 'PATCH',
                headers: { 
                    "Content-Type": "application/json",
                    "x-access-token": this.$store.state.dataAuth.token
                },
                body: JSON.stringify({
                    id: this.$store.state.datiUtente.username,
                    annuncio : this.$store.state.annuncioSelezionato.titolo
                })
            }).then( data => {

              console.log(data,"Annuncio ", this.$store.state.annuncioSelezionato.titolo, "!");
              this.inWL = !this.inWL;
              this.getProfile();
            })
              
        } catch (error) {
            console.error(error); // If there is any error you will catch them here
        }
    },
    controllaSeInWl () {
      this.inWL = this.$store.state.profiloUtente.whishList.includes(this.$store.state.annuncioSelezionato.titolo);
    },
    async getRating() {
      console.log("dentro get rating")
      try {
        fetch(this.$url + "api/p/getp/" + this.annuncio.inserzionista, {
          method: 'GET',
          headers: { "Content-Type": "application/json" }
        }).then((resp) => resp.json())
          .then(data => {
                      this.rating = data.rating;
                  })
      } catch(error) {
        console.error(error); 
      }
    }, 
  },  
  computed: {
    pagamentoOnlineAbilitato() {
      return this.$store.state.annuncioSelezionato.pagamentoOnline;
    },
    // inWL() {
    //   return this.$store.state.profiloUtente.whishList.includes(this.$store.state.annuncioSelezionato.titolo)
    // },

    utenteLoggato() {
      return this.$store.state.dataAuth.success;
    },
    ...mapState({
      annuncio: 'annuncioSelezionato',
    }),
  },
  async updated() {
    
  },
  async created() {
    await this.getRating();
    this.getRecensioniInserzionista();
    this.controllaSeInWl()
    this.$store.state.noNavBar = false
    this.$store.state.search = false
  }

}
</script>