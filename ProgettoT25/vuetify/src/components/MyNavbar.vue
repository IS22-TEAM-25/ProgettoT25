<template>
    <nav>
        <v-toolbar 
        height="100"
        app
        flat
        class="primary">
            <v-toolbar-title>
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

        </v-toolbar>
    </nav>
</template>
<script>
export default {

}
</script>