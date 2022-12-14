<template>
    <nav>
        <v-app-bar v-if="!this.$store.state.loginupForms"
        height="100"
        app
        flat
        class="primary">
        

            <v-app-bar-nav-icon v-if="search==true" @click="filtri=!filtri" >  </v-app-bar-nav-icon>
            <v-spacer v-if="search==true" ></v-spacer>
        
            <v-toolbar-title mx-auto>
                <logoLinkHome/>
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <router-link v-if="this.$store.state.dataAuth.success === false" to="/userloginsignup">
                <v-btn 
                rounded 
                depressed 
                class="grey lighten-5 text-lowercase">
                <span>login or signup</span>
                <v-icon>mdi-login</v-icon>
            </v-btn>
        </router-link>
        <router-link v-else to="/">
            <v-spacer></v-spacer>
                <v-btn 
                rounded 
                depressed 
                class="grey lighten-5 text-lowercase" 
                @click="logout">
                <span>logout {{ username }}</span>
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </router-link>

    </v-app-bar>
        <v-navigation-drawer v-model="filtri" app class = indigo>
            <p>
                {{search}}
            </p>
        </v-navigation-drawer>
    </nav>
</template>


<script>
import logoLinkHome from '@/components/logoLinkHome'
import { mapState } from 'vuex';
export default {
    data() {
        return {
            filtri: false,
        }
    },    
    components: { logoLinkHome },  
    methods: {
        async logout() {
            console.log(this.$store.state.dataAuth.token);
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
    computed:  mapState({
       search: state => state.search,
       username: state => state.username,
       utenteLoggato: state => state.dataAuth.success
    }),
    created() {
    }
}
</script>