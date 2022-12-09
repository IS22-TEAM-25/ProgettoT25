<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step" class="spacing-playground pa-6">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1
                          class="text-center display-2 accent--text"
                        >Accedi a Spottythings</h1>

                        <v-form>
                          <v-text-field
                            label="Email"
                            name="Email"
                            prepend-icon="email"
                            type="email"
                            color="accent"
                          />

                          <v-text-field
                            id="password"
                            label="Password"
                            name="password"
                            prepend-icon="lock"
                            type="password"
                            color="accent"
                          />
                        </v-form>
                        <h3 class="text-center mt-4">Forgot your password?</h3>
                      </v-card-text>
                      <div class="text-center mt-3">
                        <v-btn rounded color="accent accent-3" dark>SIGN IN</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="accent accent-3">
                      <v-card-text class="black--text mt-12">

                        <h3
                          class="text-center"
                        >Non hai ancora un profilo?</h3>
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

                        <h3
                          class="text-center"
                        >Hai già un profilo?</h3>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded dark @click="step--">Sign in</v-btn>
                      </div>
                    </v-col>

                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 accent--text text--accent-3">Crea un Account</h1>
                       

                        <v-form>
                          <v-text-field
                            label="Nome"
                            name="Nome"
                            prepend-icon="person"
                            type="text"
                            color="accent accent-3"
                          />
                          <v-text-field
                            label="Cognome"
                            name="Cognome"
                            prepend-icon="person"
                            type="text"
                            color="accent accent-3"
                          />
                          <v-text-field
                            label="Email"
                            name="Email"
                            prepend-icon="email"
                            type="text"
                            color="accent accent-3"
                          />

                          <v-text-field
                            id="password"
                            label="Password"
                            name="password"
                            prepend-icon="lock"
                            type="password"
                            color="accent accent-3"
                          />
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-n5">
                        <v-btn rounded color="accent accent-3" dark>SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    step: 1
  }),
  props: {
    source: String
  }
};
</script>