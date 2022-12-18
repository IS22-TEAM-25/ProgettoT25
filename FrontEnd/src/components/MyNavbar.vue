<template>
    <nav>
        <v-app-bar v-if="!this.$store.state.noNavBar"
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
            <v-checkbox
            v-model="ascData"
            on-icon="mdi-sort-numeric-descending"
            off-icon="mdi-sort-numeric-ascending"
            label="verso"
            color="indigo">
            </v-checkbox>
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
            <v-checkbox
            v-model="ascPrezzo"
            on-icon="mdi-sort-numeric-descending"
            off-icon="mdi-sort-numeric-ascending"
            label="verso"
            color="indigo">
            </v-checkbox>
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
            ascData: false,
            ordinaPrezzo: false,
            ascPrezzo: false,
            ordinaRating: true,
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
            return Math.max.apply(Math, this.annunci.map(function(o) { 
              if (o.prezzo === undefined) {
                return 0;
              }
              return o.prezzo; 
            }))
        },
        filtraggio(x) {
          var ok = true;
          if (this.affitto && x.modalitaTransazione !== 'Affitto') ok = false
          if (!this.affitto && x.modalitaTransazione === 'Affitto') ok = false
          if (this.vendita && x.modalitaTransazione !== 'Vendita') ok = false
          if (!this.vendita && x.modalitaTransazione === 'Vendita') ok = false
          if (x.prezzo < this.filterMin) ok = false
          if (x.prezzo > this.filterMax) ok = false
          if (this.categoriaSelezionata !== '' && x.categoria !== this.categoriaSelezionata) ok = false
          return ok;
        },
        ordinamento() {
          if(this.ordinaPrezzo && this.ascPrezzo) return 'm1';
          if(this.ordinaPrezzo && !this.ascPrezzo) return 'm2';
          if(this.ordinaData && this.ascData) return 'd1';
          if(this.ordinaData && !this.ascData) return 'd2';
        },
        async applicaFiltri() {
          try {
                console.log(this.endpoint)
                fetch(this.$url + "api/a/ordina/" + this.ordinamento(), {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" }
                }).then((resp) =>resp.json())
                .then(data => {
                  // Here you get the data to modify as you please
                this.$store.state.annunci = data.filter(a => a.visibile === true)
                if (this.$store.state.annunci[0] === undefined) this.isEmpty=true; 
                  return;
                })
                } catch(error) {
                    console.error(error); // If there is any error you will catch them here
                }
            
            this.$store.state.annunci = this.$store.state.annunci.filter(this.filtraggio);
            if(this.ordinaData) {
              console.log(this.$store.state.annunci)
              this.$store.state.annunci.sort((a,b) => a.dataPubblicazione > b.dataPubblicazione)  
            } else if (this.ordinaPrezzo) {
              this.$store.state.annunci.sort((a,b) => a.prezzo > b.prezzo)
            } else {
              this.$store.state.annunci.sort((a,b) => a.rating > b.rating)
            }
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