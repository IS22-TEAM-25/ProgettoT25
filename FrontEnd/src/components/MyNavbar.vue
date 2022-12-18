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
        <v-navigation-drawer v-if="search" v-model="filtri" app class ="primary" >
            <h1 justify="center" align="center">FILTRI</h1>
            <v-container>
            <v-row dense>
            
                <v-spacer></v-spacer>
                <v-text-field v-model="keyword" class="d-inline-flex pa-2" placeholder="ricerca" filled dense
                    rounded append-icon="mdi-magnify" @keyup.enter="ricercakw"></v-text-field>
                <v-spacer></v-spacer>
            </v-row>
        </v-container>
            <h4>Ordina per: </h4>
            <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-switch
                color="indigo"
                v-model="ordinaData"
                @click="ordinaRating=false; ordinaPrezzo=false"
              ></v-switch>
            </v-list-item-action>
            <v-list-item-title>data</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch
                color="indigo"
                v-model="ordinaPrezzo"
                @click="ordinaRating=false; ordinaData=false"
              ></v-switch>
            </v-list-item-action>
            <v-list-item-title>prezzo</v-list-item-title>

          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch
                color="indigo"
                v-model="ordinaRating"
                @click="ordinaPrezzo=false; ordinaData=false"
              ></v-switch>
            </v-list-item-action>
            <v-list-item-title>rating</v-list-item-title>
          </v-list-item>
        </v-list>
          <v-select class="d-inline-flex pa-2" filled dense rounded :items="categories" :value="categoriaSelezionata" @on-change="this.$store.commit('selectCat', this.localCat)"
          label="Categoria" required v-model="categoriaSelezionata"></v-select>

            <v-slider
            label="min"
            v-model="filterMin"
            min = "0"
            :max=priceMax
            color="indigo"
            >
        </v-slider>

        <v-slider
            label="max"
            v-model="filterMax"
            min = "0"
            :max=priceMax
            color="indigo"
            >
        </v-slider>
        <div>
            Prezzo min: {{ euro.format(filterMin) }}
        </div>
        <div>
            Prezzo max: {{ euro.format(filterMax) }}
        </div>
        <v-container>
            <v-checkbox
            v-model="affitto"
            label="affitto"
            color="indigo">
            </v-checkbox>
            <v-checkbox
            v-model="vendita"
            label="vendita"
            color="indigo">
            </v-checkbox>
        </v-container>
    <v-spacer></v-spacer>
    <v-btn block rounded @click="applicaFiltri">Applica filtri</v-btn>          
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
            categories:[],
            selectCat: this.$store.state.category,
            filtri: false,
            ordinaData: false,
            ordinaRating: true,
            ordinaPrezzo: false,
            affitto: false,
            vendita: false,
            categoriaSelezionata: '',
            keyword: '',
            filterMin: 0,
            filterMax: 0,
            priceMax: 999999,
            euro:  
                 new Intl.NumberFormat('en-DE', {
                     style: 'currency',
                     currency: 'EUR',
                 })
        }
    },    
    components: { logoLinkHome, MenuProfilo },  
    methods: {
        findMaxPrice() {
            return Math.max.apply(Math, this.annunci.map(function(o) { return o.prezzo; }))
        },
        applicaFiltri() {
            this.$store.state.annunci = this.$store.state.annunci.filter(function(o) { 
                console.log(this.filterMin)
                var ok = true;
                //if (!this.affitto && o.modalitaTransazione !== 'Affitto') ok = false
                //if (!this.vendita && o.modalitaTransazione !== 'Vendita') ok = false
                if (o.prezzo < this.filterMin) ok = false
                if (o.prezzo > this.filterMax) ok = false
                if (this.categoriaSelezionata !== '' && o.categoria !== this.categoriaSelezionata) ok = false
                return ok;
            })

            
        }
    },
    computed:  mapState({
       search: state => state.search,
       username: state => state.username,
       utenteLoggato: state => state.dataAuth.success,
       cate: state => state.category,
       annunci: state => state.annunci,
       
    }),
    created() {
    this.$categories.forEach(v => this.categories.push(v.title));
    this.categoriaSelezionata = this.$store.state.category
    this.priceMax = this.findMaxPrice()
  },
  updated() {
    this.priceMax = this.findMaxPrice()
    if(this.filterMin > this.filterMax) {
        this.filterMax = this.filterMin;
    }
  }
}
</script>