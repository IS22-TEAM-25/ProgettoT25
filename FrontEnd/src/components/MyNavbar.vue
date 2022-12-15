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

        <MenuProfilo v-if="this.$store.state.dataAuth.success === true"/>

    </v-app-bar>
        <v-navigation-drawer v-model="filtri" app class = indigo>
            <p>
                {{ search }}
            </p>
        </v-navigation-drawer>
    </nav>
</template>


<script>
import logoLinkHome from '@/components/logoLinkHome'
import MenuProfilo from '@/components/menuProfilo';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            filtri: false,
        }
    },    
    components: { logoLinkHome, MenuProfilo },  
    methods: {
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