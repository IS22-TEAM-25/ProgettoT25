<template>
    <div class="text-center">
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="300" offset-x>
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="indigo" dark v-bind="attrs" v-on="on">
                    {{ datiUtente.username }}
                </v-btn>
            </template>

            <v-card>
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon large>
                                mdi-account
                            </v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>{{ datiUtente.nome + " " + datiUtente.cognome }}</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-btn rounded depressed class="grey lighten-5 text-lowercase" @click="logout">
                                <span>logout {{ datiUtente.username }}</span>
                                <v-icon>mdi-logout</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>
                <v-card class="mx-auto">

                    <v-list>
                        <v-list-item-group>
                            <v-list-item to="/userprofile">
                                <v-list-item-icon>
                                    <v-icon>mdi-border-color</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                <v-list-item-title>Modifica Dati Personali</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item to="/pubblicaannuncio">
                                <v-list-item-icon>
                                    <v-icon>mdi-border-color</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Pubblica Annuncio</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-border-color</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                <v-list-item-title>Modifica Annunci</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item> 
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-border-color</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                <v-list-item-title>Visualizza Recensioni</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-border-color</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                <v-list-item-title>Whishlist</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {

    data: () => ({
        fav: true,
        menu: false,
        message: false,
        hints: true,
    }),
    methods: {
        async logout() {
            console.log(this.$store.state.datiUtente.token);
            try {
                fetch("http://localhost:8080/api/l/logout", {
                    method: 'GET',
                    headers: { 
                      "Content-Type": "application/json",
                      "x-access-token": this.$store.getters.token
                    }
                }).then((resp) =>resp.json())
                .then(data => {
                  console.log(data);

                  this.$store.commit('resetState', this.$store.state);
                  // DEBUG
                  //console.log(this.$store.state)
                })
                } catch(error) {
                    console.error(error); // If there is any error you will catch them here
                }
        }
    },
    computed: mapState({
        datiUtente: state => state.datiUtente,
    })
}
</script>