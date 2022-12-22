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
            Modifica Dati Utente
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Modifica dati personali:</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-text-field
                    label="Nome"
                    v-model="nomeU"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-text-field
                    label="Cognome"
                    v-model="cognomeU"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-text-field
                    label="Data di nascita:"
                    v-model="dobU"
                    type="date"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email"
                    v-model="emailU"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Metodo di Pagamento"
                    v-model="metodiPagamentoU"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Indirizzo"
                    v-model="indirizzoU"
                    required
                  ></v-text-field>
                </v-col>
            </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn
            color="indigo"
            class="white--text"
            rounded
            block
            @click="aggiornaUtente"
            >
            Applica Modifiche
        </v-btn>
          </v-card-actions>
        </v-card>
        <v-form v-model=valid class="submit">
        <v-card>
          <v-card-title>
            <span class="text-h5">Modifica password:</span>
          </v-card-title>
          <v-card-text>
            <v-container>
                <v-row>
                <v-row>
                    <v-col cols="4">
                        <v-text-field
                        label="Password Attuale"
                        v-model="oldPass"
                        type="password"
                        :rules="required.concat(oldPassRule)"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        label="new Password"
                        type="password"
                        v-model="newPass"
                        :rules="required.concat(passwordCrit)"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        label="Conferma new password"
                        v-model="confirmNewPass"
                        type="password"
                        :rules="required.concat(passwordMatching)"
                        ></v-text-field>
                    </v-col>
                    <small>Ricordati che per la password è necessario immettere uno di questi caratteri: ! £ % ? € = ^ </small>
                </v-row>
              </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            color="indigo"
            class="white--text"
            rounded
            :disabled=!valid
            @click="modificaPassword">
            Modifica Password
        </v-btn>
        <v-btn
        color="orange"
        class="white--text"
        rounded
        @click="dialog=false">
        Chiudi
    </v-btn>
    </v-card-actions>
    </v-card>
    </v-form>
      </v-dialog>
    </v-row>
  </template>

<script>
import format from 'date-fns/format';


export default {
    data() {
        return {   
            valid: false,
            dialog: false,
            nomeU: '',
            cognomeU: '',
            emailU: '',
            indirizzoU: '',
            oldPass: '',
            newPass: '',
            confirmNewPass: '',
            dobU: '',
            metodiPagamentoU: '',
            newPassword: '',
            emailRules: [
                v => !v || /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail non valida.',
            ],
            oldPassRule: [
                v => (v.match(this.$store.state.datiUtente.password)) !== null || 'Password errata!'
            ],
            required: [
                v => !!v || 'Campo Obbligatorio per cambiare la password!'
            ],
            passwordCrit: [
                v => (v.match(/^(?=.*[0-9])(?=.*[!£%&?€=^])[a-zA-Z0-9!£%&?€=^*]{8,15}/))!== null  || 'Password non valida!'
            ],
        }
    },
    methods: {
        async aggiornaUtente () {
            if(this.nomeU === '') {
                this.nomeU = this.$store.state.datiUtente.nome;
            } else {
                this.$store.state.datiUtente.nome = this.nomeU;
            }
            if(this.cognomeU === '') {
                this.cognomeU = this.$store.state.datiUtente.cognome;
            } else {
                this.$store.state.datiUtente.cognome = this.cognomeU;
            }
            if(this.dobU === '') {
                this.dobU = this.$store.state.datiUtente.dataDiNascita;
            } else {
                this.$store.state.datiUtente.dataDiNascita = this.dobU;
            }
            if(this.emailU === '') {
                this.emailU = this.$store.state.datiUtente.email;
            } else {
                this.$store.state.datiUtente.emailU = this.emailU;
            }
            if(this.indirizzoU === '') {
                this.indirizzoU = this.$store.state.datiUtente.indirizzo;
            } else {
                this.$store.state.datiUtente.indirizzo = this.indirizzoU;
            }
            this.$store.state.datiUtente.metodiPagamento = this.metodiPagamentoU;
            try {
                fetch(this.$url + "api/u/updateu", {
                    method: 'PATCH',
                    headers: { 
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.state.dataAuth.token
                    },
                    body: JSON.stringify({
                        username: this.$store.state.datiUtente.username,
                        nome: this.nomeU,
                        cognome: this.cognomeU,
                        datadinascita: this.dobU,
                        indirizzo: this.indirizzoU,
                        metodiPagamento: this.metodiPagamentoU,
                    })
                }).then(() => {
                    console.log("Dati utente aggiornati per ", this.$store.state.datiUtente.nome, "!");
                    this.dialog = false
                })
            } catch (error) {
                console.error(error); // If there is any error you will catch them here
            }
            try {
                fetch(this.$url + "api/u/updatee", {
                    method: 'PATCH',
                    headers: { 
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.state.dataAuth.token
                    },
                    body: JSON.stringify({
                        username: this.$store.state.datiUtente.username,
                        email: this.emailU
                    })
                }).then(() => {
                    console.log("Email aggiornata per ", this.$store.state.datiUtente.nome, "!");
                    this.dialog = false
                })
            } catch (error) {
                console.error(error); // If there is any error you will catch them here
            }
        },
        setForm() {
            this.nomeU = this.$store.state.datiUtente.nome;
            this.cognomeU = this.$store.state.datiUtente.cognome;
            this.dobU = format(new Date(this.$store.state.datiUtente.datadinascita), "yyyy-MM-dd");
            console.log(format(new Date(this.dobU), "yyyy-MM-dd"))
            this.emailU = this.$store.state.datiUtente.email;
            this.indirizzoU = this.$store.state.datiUtente.indirizzo;
            this.metodiPagamentoU = this.$store.state.datiUtente.metodiPagamento;
        },
        async modificaPassword() {

            try {
                fetch(this.$url + "api/u/updatep", {
                    method: 'PATCH',
                    headers: { 
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.state.dataAuth.token
                    },
                    body: JSON.stringify({
                        username: this.$store.state.datiUtente.username,
                        password: this.newPass
                    })
                }).then(console.log("Password aggiornata per ", this.$store.state.datiUtente.nome, "!")).then(this.$store.state.datiUtente.password = this.newPass).then(this.chiudi())
            } catch (error) {
                console.error(error); // If there is any error you will catch them here
            }
        },
        async chiudi() {
            this.oldPass = '';
            this.newPass = '';
            this.confirmNewPass = '';
            this.dialog = false;
        },  
        passwordMatching() {
            if (this.newPass === this.confirmNewPass) {
                return true;
            } else {
                return "Le password non combaciano!"
            }
        },
        
    },
    mounted() {
        this.getProfile();
        this.setForm();
    }, 
    beforeUnmount() {
        this.$refs.form.reset();
    }

}
</script>