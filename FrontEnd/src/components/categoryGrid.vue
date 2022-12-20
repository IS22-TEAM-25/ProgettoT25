<template>
    <v-card 
    flat class="mx-auto justify-center" 
    max-width="1000">

        <v-container fluid>
            <v-row dense>
                <v-col v-for="category in this.$categories" 
                :key="category.title" 
                router :to="category.route"
                :cols="category.flex">
                    <v-card flat @click="selectCat(category.title)">
                            <v-img 
                            rounded 
                            :src="require('../assets/' + category.src)" 
                            class="white--text align-end"
                            contain>
                            <v-card-title 
                            class="grey lighten-3 black--text justify-center" 
                            v-text="category.title">
                        </v-card-title>
                    </v-img>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>

export default {

    data: () => ({
        
    }),
    methods: {
        selectCat(cat) {
            this.$store.state.filtri.categoria = cat
            this.$router.push({path:'/searchresults'})
        }
    }
}
</script>