<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="360px"
      >
        <template v-slot:activator="{ on, attrs }">
            <h3
            class="grey--text"
            dark
            v-bind="attrs"
            v-on="on"
            >
            Forgot your password???
        </h3>
        </template>
        <v-card >
          <v-card-title>
            <h3 class="text-center accent--text"
            align="center">Inserisci il tuo username!</h3>
            <div class="font-weight-light ">Ti invieremo al più presto una mail </div>
            <div class="font-weight-light">con le istruzioni per procedere.
            </div>
          </v-card-title>
          <v-form class="submit" v-model="valid">
                <v-card-text>
                    <v-container>
                        <v-text-field
                        label="username"
                        required
                        color="accent"
                        :rules="[v=>!!v||'Username necessario!']"
                        ></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn
                    color="red"
                    rounded
                    text
                    @click="dialog = false"
                    >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                color="indigo lighten-1"
                text
                :disabled="!valid"
                @click="dialog = false, ripristinaPassword"
                > Send me an Email!
                <v-icon>mdi-email</v-icon>
                </v-btn>
                </v-card-actions>
            </v-form> 
        </v-card>
      </v-dialog>
    </v-row>
  </template>

<script>
export default {
    data: () => ({
        valid: false,
        dialog: false,
        username: '',
        email: '',
        message: ''
    }),
    methods: {
        async findMail() {
            try {
                fetch(this.url + "api/u/getu/" + this.username, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) => resp.json())
                    .then(data => {
                        if (data[0] === undefined) {
                            this.message = data.message;
                            return;
                        }
                        this.email = data.email;
                        console.log(data);
                    })
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>