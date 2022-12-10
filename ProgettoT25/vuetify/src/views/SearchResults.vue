<template>
    <div class="searchresults">
        <h1>Risultati ricerca {{cate}}</h1>
        <input type="text" ref="input" > 
        <v-btn @click="onInput"> ok </v-btn>
        <h2>{{ $store.state.category  }}</h2>
    <v-card 
     class="mx-auto justify-center" 
    max-width="1000">
    
    <v-container fluid>
        <v-row dense>
            <v-col v-for="annuncio in annunci" 
            :key="annuncio._id" 
            :cols="4">
            <v-card flat @click="selectCat(category.title)">
                <v-img 
                rounded 
                :src="require('../assets/vuoto.webp')" 
                class="white--text align-end"
                contain>
        </v-img>
        <span class="secondary right">{{ annuncio.titolo }}</span>
        <span clas="secondary"> {{ annuncio.prezzo }}</span>
        <v-spacer></v-spacer>
    </v-card>
</v-col>
</v-row>
</v-container>
</v-card>
</div>
</template>

<script>


import { mapState } from "vuex";


export default {
    //props: ['category'],
    data () {
        return {
            annunci: [],
            localCat: '',
            endpoint: '',
            cat: '',
            API_URL: 'http://localhost:8080/api/a/'
        }
    },
    computed:  mapState({
       cate: state => state.category
    }),

    // @todo capire come mettere il body
    methods: {
        async getData() {
            try {
                console.log(this.ENDPOINT)
                fetch(this.ENDPOINT, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    //body: JSON.stringify({ categoria: this.cat }),
                }).then((resp) =>resp.json())
                .then(data => {
                  // Here you get the data to modify as you please
                //console.log(data);
                this.annunci = data;
                  return;
                })
                } catch(error) {
                    console.error(error); // If there is any error you will catch them here
                }
    },
       
        onInput() {
            this.localCat = this.$refs.input.value
            this.$store.commit('selectCat', this.localCat)
        }
    },
    created() {
        this.cat = this.$store.state.category;
        console.log("Dio cane", this.cat)
        if (this.cat === '') {
            this.ENDPOINT = this.API_URL+'getAll'
        } else {
            this.ENDPOINT = this.API_URL+'getaf';
        }
        this.getData();
        
    }    
}
</script>