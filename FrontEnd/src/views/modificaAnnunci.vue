<template>
    <v-card>
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-row>
                        <v-col>
                            NOME ANNUNCIO
                        </v-col>                  
                        <v-col>
                            VISIBILE
                        </v-col>
                        <v-col>
                            <v-spacer></v-spacer>
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="annuncio in annunciUtente" :key="annuncio.titolo">
                <v-list-item-content>
                    <v-row>
                        <v-col>
                            {{ annuncio.titolo }}
                        </v-col>                    
                        <v-col>
                            <v-row dense>
                                <v-col v-if="annuncio.visibile">
                                    Si
                                </v-col>
                                <v-col v-else>
                                    No
                                </v-col> 
                                <v-col v-if="annuncio.visibile === true">
                                    <v-btn block color="orange" rounded @click="aggiornaVisbilita(annuncio, false)">Nascondi</v-btn>
                                </v-col>
                                <v-col v-else>
                                    <v-btn block color="green" rounded @click="aggiornaVisbilita(annuncio, true)">Rendi Visibile</v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn block color="red" rounded @click="elimina(annuncio)">Elimina</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>

export default {
    data() {
        return {
            annunciUtente: []
        }
    },
    computed: {

    },
    methods: {
        async getAnnunciUtente() {
            try {
                fetch(this.$url + "api/a/getau/" + this.$store.state.datiUtente.username, {
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
        async aggiornaVisbilita (annuncio, visibilePassato) {
            try {
                fetch(this.$url + "api/a/updatea", {
                    method: 'PATCH',
                    headers: { 
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.state.dataAuth.token
                    },
                    body: JSON.stringify({
                        titolo: annuncio.titolo,
                        visibile: visibilePassato
                    })
                }).then( () => {
                    console.log("Visibilià aggiornata per ", annuncio.titolo, "!")
                    this.contaAnnunciOnline(this.$store.state.datiUtente.username);
                    this.getProfile();
                })
            } catch (error) {
                console.error(error); // If there is any error you will catch them here
            }
        },
        async elimina(annuncio) {
            try {
                fetch(this.$url + "api/a/deletea/" + annuncio.titolo, {
                    method: 'DELETE',
                    headers: { "Content-Type": "application/json" },
                    // body: JSON.stringify({ id: id }),
                }).then( () => {
                    console.log("Annuncio con titolo", annuncio.titolo, " è stato eliminato!")
                    this.contaAnnunciOnline(this.$store.state.datiUtente.username);
                    this.getProfile();
                })
                } catch(error) {
                    console.error(error); // If there is any error you will catch them here
                }
        }
    },
    updated() {
        this.getAnnunciUtente();
    },
    created() {
      this.getAnnunciUtente();  
    },
}
</script>