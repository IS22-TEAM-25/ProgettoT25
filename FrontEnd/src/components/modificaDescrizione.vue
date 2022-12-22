<template>
    <v-row >
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="indigo"
            class="white--text"
            rounded
            v-bind="attrs"
            v-on="on"
          >
            Modifica Descrizione
          </v-btn>
        </template>
        <v-card>
            <v-form class="submit" v-model="valid">
          <v-card-title>
            <span class="text-h5">Modifica descrizione:</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-textarea
                    class="submit"
                    label="Descrizione"
                    v-model="descrizione"
                    :counter="250" 
                    :rules="descrizioneRules"
                    no-resize
                    filled
                  ></v-textarea>
                </v-col>
            </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn
            
            color="indigo"
            class="white--text"
            rounded
            :disabled:="!valid"
            @click="aggiornaDescrizione"
            >
            Aggiorna Descrizione
        </v-btn>
        <v-btn
        color="orange"
        class="white--text"
        rounded
        @click="dialog=false">
        Chiudi
    </v-btn>

    </v-card-actions>
    </v-form>
    </v-card>
      </v-dialog>
    </v-row>
  </template>

<script>

export default {
    data() {
        return {
            dialog: false,
            valid: false,
            descrizione:'',
            descrizioneRules: [
                v => v.length <= 250 || "Descrizione troppo lunga!" 
            ]
        }
    },
    methods: {
        async aggiornaDescrizione() {
            try {
                fetch(this.$url + "api/p/updatep", {
                    method: 'PATCH',
                    headers: { 
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.state.dataAuth.token
                    },
                    body: JSON.stringify({
                        id: this.$store.state.datiUtente.username,
                        descrizioneProfilo: this.descrizione
                    })
                }).then(console.log("Descrizione aggiornata per ", this.$store.state.datiUtente.nome, "!")).then(this.$store.state.profiloUtente.descrizioneProfilo = this.descrizione).then(this.dialog = false)
            } catch (error) {
                console.error(error); // If there is any error you will catch them here
            }
        }
    },
    mounted() {
        this.descrizione = this.$store.state.profiloUtente.descrizioneProfilo;
    }


}
</script>