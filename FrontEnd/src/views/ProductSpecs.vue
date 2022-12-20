<template>
  <v-container class="productspecs">
    <v-row flex>
      <v-col>

        <h1>{{ annuncio.titolo }}</h1>
      </v-col>
      <v-col cols="2" >
        <v-btn block color="orange" rounded flat v-if="utenteLoggato" >+ wish list</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-img rounded :src="require('../assets/vuoto.webp')" class="white--text align-end" max-width="400">
        </v-img>
        <h2>
          {{ annuncio.inserzionista }}
        </h2>
        <v-card>
        
          <v-rating :value="annuncio.rating" color="amber" dense half-increments readonly size="14"></v-rating>
          <div>Pubblicato il: {{ formattedDate(annuncio.dataPubblicazione) }}</div>
        </v-card>
      </v-col>
      <v-col cols="7">
        <v-card color="blue lighten-5">
          <v-container>

            <h4 >DESCRIZIONE:</h4>
            <p>
              {{ annuncio.descrizione }}
            </p>
          </v-container>
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

              <v-btn block class="submit white--text" color="indigo"  :disabled="!valid"
              @click="acquistaAffitta">Affitta</v-btn>
            </v-row>
          </v-form>
        </v-container>
        <v-container v-else>
          <p>vendita </p>
          <v-row>
            <v-col>
              <v-btn @click="acquistaAffitta">
                compralo subito
              </v-btn>
            </v-col>
          </v-row>
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
      valid: false,
      dates: [],
      startDate: null,
      endDate: null,
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
      if(!this.$store.state.dataAuth.success) {
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
  },  
  computed: {

  ...mapState({
    annuncio: 'annuncioSelezionato',
    utenteLoggato: 'dataAuth.success'
  }),
  },

  created() {
    this.$store.state.search = false
  }
}
</script>