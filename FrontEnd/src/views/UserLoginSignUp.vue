<template>
  <v-main id="inspire">


      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-row>
              <div class="mx-auto pa-10">
                <logoLinkHome />
              </div>
            </v-row>
            <v-card class="elevation-12">
              <v-window v-model="step" class="spacing-playground pa-6">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 accent--text">Accedi a Spottythings</h1>
                        <v-form ref="form" class ="submit" v-model="valid">
                          <v-text-field label="Username" name="username" prepend-icon="person" type="username"
                            color="accent" v-model="username" :rules="required"/>

                          <v-text-field id="password" label="Password" name="password" prepend-icon="lock"
                            type="password" color="accent" v-model="password" :rules="required"/>
                            <!-- FORGOT PASSWORD -->
                            <forgotPassword @ripristinaPassword="esitoRipristino"/>
                            <div class="text-center mt-3">
                              <v-btn class="submit" rounded color="accent accent-3"  :disabled=!valid @click="login" >SIGN IN</v-btn>
                            </div>
                          </v-form>
                        </v-card-text>

                      <v-container>
                        <v-alert v-if="accountCreato" type="success" justify="center" dismissible>
                          Registrazione avvenuta con successo!
                        </v-alert>
                        <v-alert v-if="acquistoUtenteNonAutenticato" type="error" justify="center" dismissible>
                          Effettuare il login prima di poter procedere alla transazione!
                        </v-alert>
                        <v-alert v-if="erroreLogin" type="error" justify="center" dismissible>
                          {{ messageErroreLogin }}
                        </v-alert>
                        <v-alert> {{ messaggioRipristino }} </v-alert>
                      </v-container>
                    </v-col>
                    <v-col cols="12" md="4" class="accent accent-3">
                      <v-card-text class="black--text mt-12">
                        <h3 class="text-center">Non hai ancora un profilo?</h3>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded dark @click="step++">SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>

                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" class="accent accent-3">
                      <v-card-text class="black--text mt-12">

                        <h3 class="text-center">Hai già un profilo?</h3>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded dark @click="step--">Sign in</v-btn>
                      </div>
                    </v-col>

                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12 mb-0">
                        <h1 class="text-center display-2 accent--text text--accent-3">Crea un Account</h1>


                        <v-form v-model="valid" class="submit">
                          <v-text-field v-model="username" id="username" label="Nome utente" name="Username"
                            prepend-icon="person" type="text" required color="accent accent-3" :rules="required" />
                          <v-text-field v-model="nome" id="nome" label="Nome" name="Nome" prepend-icon="person" required
                            type="text" color="accent accent-3" :rules="required" />
                          <v-text-field v-model="cognome" id="cognome" label="Cognome" name="Cognome" required
                            prepend-icon="person" type="text" color="accent accent-3" :rules="required" />
                          <v-text-field v-model="dob" id="dob" label="Data di nascita" name="DOB" required
                            prepend-icon="mdi-calendar-blank" type="date" color="accent accent-3" :rules="required" />
                          <v-text-field v-model="indirizzo" id="indirizzo" label="Indirizzo" placeholder="via Sommarive 9, Povo, Trento" name="Indirizzo" required
                            prepend-icon="map" type="text" color="accent accent-3" :rules="required" />
                          <v-text-field v-model="email" id="email" label="Email" name="Email" prepend-icon="email"
                            type="email" color="accent accent-3" required :rules="emailRules" />
                          <v-text-field v-model="password" id="password"
                            label="Password (Almeno 8 caratteri, un numero ed un carattere speciale ! £ % ? € = ^ "
                            name="Password"
                            required
                            prepend-icon="lock" type="password" color="accent accent-3"
                            :rules="required.concat(passwordCrit)" />
                          <v-text-field v-model="password1" id="confirmPassword" label="Confirm Password"
                            name="cPassword" prepend-icon="lock" type="password" color="accent accent-3"
                            :rules="required.concat(passwordMatching)" 
                            required/>
                          <v-checkbox
                            color="indigo"
                            label="Aggiungi Metodo di Pagamento?"
                            v-model="metodiPagamento"
                            hide-details
                            class="shrink mr-2 mt-0"
                          ></v-checkbox>
                          <v-text-field
                            v-if="metodiPagamento"
                            v-model="mailPayPal"
                            id="paypal"
                            name="paypal"
                            prepend-icon="mdi-account-credit-card"
                            label="Metodo di Pagamento"
                            placeholder="PayPal"
                            color="accent accent-3"
                            :rules="metodiPagRules"
                          ></v-text-field>
                          <v-spacer></v-spacer>
                          <v-btn class="submit" rounded color="accent accent-3"  :disabled=!valid
                            @click="handleSubmit">Crea un Account</v-btn>
                          <div class="text-center mt-n5">
                          </div>
                        </v-form>
                      </v-card-text>
                      <v-spacer></v-spacer>
                      <v-container>
                        <v-alert v-if="erroreRegistrazione" type="error" justify="center" dismissible>
                          {{ messaggioErrore }}
                        </v-alert>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

  </v-main>
</template>

<script>
import router from '@/router';
import logoLinkHome from '@/components/logoLinkHome';
import forgotPassword from '@/components/forgotPassword';

export default {
  components: { logoLinkHome, forgotPassword },
  data: () => ({
    step: 1,
    metodiPagamento: false,
    valid: false,
    erroreRegistrazione: false,
    accountCreato: false,
    datiAuth: {},
    erroreLogin: false,
    username: '',
    password: '',
    password1: '',
    email: '',
    nome: '',
    cognome: '',
    dob: '',
    indirizzo: '',
    mailPayPal:'',
    messaggioErroreRegistrazione: '',
    messageErroreLogin:'',
    messaggioRipristino: '',
    required: [
      v => !!v || 'Campo obbligatorio'
    ],
    emailRules: [
      v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail non valida.',
    ],
    metodiPagRules: [
      v => !v || /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail non valida.',
    ],
    passwordCrit: [
      v => (v.match(/^(?=.*[0-9])(?=.*[!£%&?€=^])[a-zA-Z0-9!£%&?€=^*]{8,15}/))!== null || 'Password non valida!'
    ] 
  }),
  props: {
    source: String
  },
  methods: {
    passwordMatching() {
      if (this.password === this.password1) {
        return true;
      } else {
        return "Le password non combaciano!"
      }
    },
    async handleSubmit() {
      try {
        fetch(this.$url + "api/u/signUp", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username: this.username, 
            password: this.password, 
            nome: this.nome, 
            cognome: this.cognome, 
            datadinascita: this.dob, 
            indirizzo: this.indirizzo, 
            email: this.email,
            metodiPagamento: this.mailPayPal
          })
        }).then((resp) => resp.json())
          .then(data => {
            console.log(data);
            if (data.success === false) {
              console.log("erroreeeee")
              this.messaggioErroreRegistrazione = data.message;
              console.log(data.message, " === ", this.messaggioErroreRegistrazione )
              this.erroreRegistrazione = true;
              return;
            }
            this.salvaProfilo();
            this.accountCreato = true;
            this.step = 1;
            this.$refs.form.reset();
            this.erroreRegistrazione = false;
          })
      } catch (error) {
        console.error(error);
      }
    },
    async salvaProfilo() {
      try {
        fetch (this.$url + "api/p/savep", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "x-token-access": this.$store.getters.token,
          },
          body: JSON.stringify({
            "descrizioneProfilo" : "Benvenuti sul mio profilo!",
            "idUtente" : this.username,
          })
        }).then((resp) => resp.json())
        .then(data => {
          console.log(data);
        })
      } catch (error) {
        console.error(error);
      }
    },
    async login() {
      //console.log(this.username, " ", this.password)
      try {
        fetch(this.$url + "api/l/signIn", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: this.username, password: this.password }),
        }).then((resp) => resp.json())
          .then(data => {
            // Here you get the data to modify as you please
          this.$store.commit('autenticazione', data/*{ dataAuth: data, username: this.username }*/);
            if (data.success) {
              console.log(data);
              if (this.acquistoUtenteNonAutenticato) {
                router.push("/productspecs")
              } else {
                router.push("/");
              }
              this.$store.state.noNavBar = false;
              this.getUser();
              this.getProfile();
            } else {
              this.erroreLogin = true
            }
            this.messageErroreLogin = data.message;
            console.log(data.messamessageErroreLoginge);
          })
      } catch (error) {
        console.error(error); // If there is any error you will catch them here
      }
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
      } catch(error) {
        console.error(error); 
      }
    }, 
    async getUser() {
      try {
        fetch(this.$url + "api/u/getu/" + this.username, {
          method: 'GET',
          headers: { "Content-Type": "application/json" }
        }).then((resp) => resp.json())
        .then(data => {
          this.$store.commit('prendiDatiUtente', data);
          console.log(data);
        })
      } catch(error) {
        console.error(error); 
      }
    },
    esitoRipristino(esito) {
      this.messaggioRipristino = esito;
    },

  },
  watch: {
    erroreRegistrazione() {
      setTimeout(() => {this.erroreRegistrazione = false}, 3000);
    },
    erroreLogin() {
      setTimeout(() => {this.erroreLogin = false}, 3000);
    }
  },
  computed: {
    acquistoUtenteNonAutenticato() {
      return this.$store.state.prodottoInBallo;
    },
    messaggioErrore() {
      return this.messageErroreRegistrazione;
    },

  },
  mounted() {
    this.$store.state.noNavBar = true;
    this.$store.state.search = false; 
  }
};
</script>