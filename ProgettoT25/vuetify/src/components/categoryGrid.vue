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
                    <v-card flat>
                        <router-link to="/searchresults">

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
                </router-link>
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
            { title: 'Tecnologia', src: 'Elettronica.png', flex: 3, route: '/searchresult' },
            { title: 'Animali', src: 'Animali.png', flex: 3, route: '/searchresult' },
            { title: 'Fai da te', src: 'Fai da te.png', flex: 3 },
            { title: 'Hobby', src: 'Hobby.png', flex: 3 },
            { title: 'Sport', src: 'Sport.png', flex: 3 },
            { title: 'Party', src: 'Party.png', flex: 3 },
            { title: 'Per la casa', src: 'Per la casa.png', flex: 3 },
            { title: 'Trasporti', src: 'Trasporti.png', flex: 3 }
        ],
    }),
}
</script>