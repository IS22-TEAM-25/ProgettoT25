<template>
    <nav>
        <v-app-bar 
        height="100"
        app
        flat
        class="primary">
        <v-app-bar-nav-icon v-if="search==true" @click="drawer=!drawer" >  </v-app-bar-nav-icon>
        
        <v-spacer></v-spacer>
            <v-toolbar-title align="center">
               <router-link to="/">
                   <span>
                        <v-img 
                        :src="require('@/assets/spottyLogo.png')" 
                        contain 
                        max-width="200"></v-img>
                    </span>
               </router-link> 
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <router-link v-if="this.$store.state.dataAuth.success === false" to="/userlogin">
                <v-btn 
                rounded 
                depressed 
                class="grey lighten-5 text-lowercase">
                <span>login or signup</span>
                <v-icon>mdi-login</v-icon>
            </v-btn>
        </router-link>
        <router-link v-else to="/">
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
        <v-navigation-drawer v-model="drawer" app class = indigo>
            <p>

                {{search}}
            </p>
        </v-navigation-drawer>
    </nav>
</template>


<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            drawer: false,
        }
    },    
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
       username: state => state.username
    }),
    created() {
    }
}
</script>