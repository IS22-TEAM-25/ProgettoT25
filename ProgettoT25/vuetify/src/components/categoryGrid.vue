<template>
    <v-card 
    flat class="mx-auto justify-center" 
    max-width="1000">

        <v-container fluid>
            <v-row dense>
                <v-col v-for="category in categories" 
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
        categories: [
            { title: 'tecnologia', src: 'Elettronica.png', flex: 3, route: '/searchresult' },
            { title: 'animali', src: 'Animali.png', flex: 3, route: '/searchresult' },
            { title: 'fai da te', src: 'Fai da te.png', flex: 3 },
            { title: 'hobby', src: 'Hobby.png', flex: 3 },
            { title: 'sport', src: 'Sport.png', flex: 3 },
            { title: 'party', src: 'Party.png', flex: 3 },
            { title: 'per la casa', src: 'Per la casa.png', flex: 3 },
            { title: 'trasporti', src: 'Trasporti.png', flex: 3 }
        ],
    }),
    methods: {
        selectCat(cat) {
            this.$store.commit('selectCat', cat)
            this.$router.push({path:'/searchresults'})
        }
    }
}
</script>