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
                <span>
                    <v-img 
                    :src="require('@/assets/spottyLogo.png')" 
                    contain 
                    max-width="200"></v-img>
                </span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <router-link to="/userlogin">
                <v-btn 
                rounded 
                depressed 
                class="grey lighten-5 text-lowercase">
                <span>login or signup</span>
                <v-icon>mdi-login</v-icon>
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
    computed:  mapState({
       search: state => state.search
    }),
}
</script>