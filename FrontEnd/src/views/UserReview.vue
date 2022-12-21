<template>
  <v-card-text class="mt-12">
    <h1 class="text-center display-2 accent--text">Lascia una recensione a {{ this.$store.state.annuncioSelezionato.inserzionista }}</h1>
    <v-form ref="form" class="submit" v-model="valid">
      <v-textarea 
      label="Raccontaci come è andata!" 
      name="descrizione" 
      prepend-icon="mdi-pencil" 
      type="text" 
      color="accent"
      :counter="200" 
      no-resize 
      v-model="descrizione" 
      :rules="required" />

        <v-rating
      v-model="rating"
      background-color="blak lighten-3"
      color="yellow"
      size="64"
      :rules="required"
    ></v-rating>
      <div class="text-center mt-3">
        <v-btn 
        class="submit" 
        rounded color="accent accent-3" 
        dark :disabled="!valid" 
        @click="creaRecensione"
        >
        INVIA RECENSIONE
      </v-btn>
      </div>
    </v-form>
  </v-card-text>

</template>
  
<script>

  export default {
    data()  {
      return {
        descrizione:'',
        rating: 0,
        valid: false,
        required: [
          v => !!v || 'Campo obbligatorio!',
          v => v.length <= 200 || 'La recensione non può superare i 200 caratteri.'
        ],
      }
    },
    methods: {
      async creaRecensione() {
        let inserzionista = this.$store.state.annuncioSelezionato.inserzionista;
        let cliente = this.$store.state.datiUtente.username;
      try {
        fetch(this.$url + "api/r/saver", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.$store.getters.token},
          body: JSON.stringify({
            utenteRecensito: inserzionista,
            utenteRecensore: cliente,
            transazioneRecensita : this.$store.state.transazione._id,
            stelle: this.rating,
            descrizione: this.descrizione,
            dataRecensione: this.$store.state.annuncioSelezionato.modalitaTransazione
          })

        }).then((resp) => resp.json())
        .then(data => {
          console.log(data);
          this.contaRecensioni(inserzionista);
          this.contaRecensioni(cliente);
        })
        } catch (err) {
          console.error(err);
        }
      this.$store.state.noNavBar = false;
      this.$router.push('/')
    },
    async contaRecensioni(nomeUtente) {
    try {
      fetch(this.$url + "api/p/updaterat", {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ 
          id: nomeUtente,
        })
      }).then(console.log("Recensioni aggiornate per ", nomeUtente, "!"))
    } catch (error) {
      console.error(error); // If there is any error you will catch them here
    }
  },
    },
    mounted() {
      this.$store.state.noNavBar = true;
    }
  }
  </script>