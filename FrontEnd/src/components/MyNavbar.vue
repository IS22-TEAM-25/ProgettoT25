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
            <v-container>
              <v-snackbar 
              v-model="annuncioSalvato" absolute
              color="green"
              >
              Annuncio salvato correttamente!
              </v-snackbar>
            </v-container>
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
        <v-list>
              <h1 
              justify="center" 
              align="center"
              >FILTRI
            </h1>
          <v-divider></v-divider>  
        <v-list-item>
          <!-- ORDINAMENTO -->
          <h4>Ordina per: </h4>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-switch
              color="indigo"
              v-model="ordinaData"
              @click="ordinaPrezzo=false"
            ></v-switch>
          </v-list-item-action>
          <v-list-item-title>data</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-switch
              color="indigo"
              v-model="ordinaPrezzo"
              @click="ordinaData=false"
            ></v-switch>
          </v-list-item-action>
          <v-list-item-title>prezzo</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-checkbox
          v-model="discendente"
          on-icon="mdi-sort-numeric-descending"
          off-icon="mdi-sort-numeric-ascending"
          label="Verso Ordinamento"
          color="indigo">
          </v-checkbox>
        </v-list-item>

        <v-list-item>
          <v-btn 
          block 
          rounded 
          @click="applicaOrdinamento" 
          color="indigo" 
          class="white--text"
          >Applica Ordinamento</v-btn>     
        </v-list-item>
        
        <v-divider></v-divider>
        
        <v-list-item>
          <!-- FILTRO PREZZO VENDITA -->
          <h4>Prezzo vendita: </h4>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col>
              <v-text-field
              v-model="filterMinVendita"
              label="min"
              type="number"
              :rules="noNegative"

              >

              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
              v-model="filterMaxVendita"
              label="max"
              type="number"
              :rules="noNegative"

              >
              </v-text-field>
          </v-col>
          </v-row>
      </v-list-item>
        <v-list-item>
           <!-- FILTRO PREZZO AFFITTO   -->
          <h4>Prezzo affitto giornaliero: </h4>
        </v-list-item>
       
        <v-list-item>
          <v-row>
            <v-col>
              <v-text-field
              v-model="filterMinAffitto"
              label="min"
              type="number"
              :rules="noNegative"
              >
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
          v-model="filterMaxAffitto"
          label="max"
          type="number"
          :rules="noNegative"
          >
          </v-text-field>
          </v-col>
        </v-row>
        </v-list-item>
        <v-list-item>
         
        </v-list-item>
        <v-divider></v-divider>
        <!-- CATEGORIA SELEZIONE -->
        <v-list-item>
          <v-spacer></v-spacer>
        </v-list-item>
    <v-list-item>
      <v-select 
      class="d-inline-flex pa-2" 
      filled 
      dense 
      rounded 
      :items="categories" 
      :value="cate" 
      @on-change="this.$store.commit('selectCat', this.localCat)"
      label="Categoria" 
      required 
      v-model="categoriaSelezionata"
      ></v-select>
    </v-list-item>
    <!-- CHECKBOXES AFFITTO E VENDITA -->
    <v-list-item>
      <v-checkbox
        v-model="affitto"
        label="affitto"
        color="indigo">
      </v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        v-model="vendita"
        label="vendita"
        color="indigo">
     </v-checkbox>
  </v-list-item>
  <v-list-item>
      <v-checkbox
        v-model="pagamentoOnline"
        label="Pagamento Online"
        color="indigo">
      </v-checkbox>
    </v-list-item>
<!-- APPLICA FILTRI E RESET -->
<v-list-item>
      <v-btn 
        block 
        color="indigo"
        class="white--text"
        rounded
        @click="applicaFiltri"
        >Applica filtri</v-btn>          
  </v-list-item>
  <v-list-item>
      <v-btn 
        block 
        color="orange"
        class="white--text"
        rounded
        @click="resettaFiltri"
        >Resetta Filtri</v-btn>          
  </v-list-item>
  </v-list>
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
            selectCat: '',
            filtri: false,
            ordinaData: false,
            ordinaPrezzo: false,
            discendente: false,
            affitto: true,
            vendita: true,
            pagamentoOnline: false,
            categoriaSelezionata: '',
            keyword: '',
            filterMaxVendita: '',
            filterMinVendita: '',
            filterMaxAffitto: '',
            filterMinAffitto: '',
            euro:  
                 new Intl.NumberFormat('en-DE', {
                     style: 'currency',
                     currency: 'EUR',
                 }),
            noNegative: [
                 v => v >= 0 || 'Non negativi.'
            ]
        }
    },    
    components: { logoLinkHome, MenuProfilo },  
    methods: {
        applicaOrdinamento() {
          if (this.ordinaData && this.discendente) {
            this.$store.state.annunci.sort((a,b) => {
              return new Date(a.dataPubblicazione) - new Date(b.dataPubblicazione);
            })
          } else if (this.ordinaData && !this.discendente) {
            this.$store.state.annunci.sort((a,b) => {
              return new Date(b.dataPubblicazione) - new Date(a.dataPubblicazione);
            })
          } else if (this.ordinaPrezzo && !this.discendente) {
            this.$store.state.annunci.sort((a, b) => {
              if (a.modalitaTransazione == "Affitto" && b.modalitaTransazione == "Affitto") {
                return a.prezzoAffittoAlGiorno - b.prezzoAffittoAlGiorno;
              } else if (a.modalitaTransazione == "Affitto" && b.modalitaTransazione == "Vendita") {
                return a.prezzoAffittoAlGiorno - b.prezzo;
              } else if (a.modalitaTransazione == "Vendita" && b.modalitaTransazione == "Affitto") {
                return a.prezzo - b.prezzoAffittoAlGiorno;
              } else if (a.modalitaTransazione == "Vendita" && b.modalitaTransazione == "Vendita") {
                return a.prezzo - b.prezzo;
              }
            }) 
          } else if (this.ordinaPrezzo && this.discendente) {
            this.$store.state.annunci.sort((a, b) => {
              if (a.modalitaTransazione == "Affitto" && b.modalitaTransazione == "Affitto") {
                return b.prezzoAffittoAlGiorno - a.prezzoAffittoAlGiorno;
              } else if (a.modalitaTransazione == "Affitto" && b.modalitaTransazione == "Vendita") {
                return b.prezzo - a.prezzoAffittoAlGiorno;
              } else if (a.modalitaTransazione == "Vendita" && b.modalitaTransazione == "Affitto") {
                return b.prezzoAffittoAlGiorno - a.prezzo;
              } else if (a.modalitaTransazione == "Vendita" && b.modalitaTransazione == "Vendita") {
                return b.prezzo - a.prezzo;
              }
            }) 
          }
        },
        applicaFiltri() {
          this.$store.state.filtri.affitto = this.affitto;
          this.$store.state.filtri.vendita = this.vendita;
          this.$store.state.filtri.prezzoVenditaMin = this.filterMinVendita;
          if(this.filterMaxVendita === '') {
            this.$store.state.filtri.prezzoVenditaMax = Number.MAX_SAFE_INTEGER;
          } else {
            this.$store.state.filtri.prezzoVenditaMax = this.filterMaxVendita;
          }
          this.$store.state.filtri.prezzoAffittoMin = this.filterMinAffitto;
          if(this.filterMaxAffitto === '') {
            this.$store.state.filtri.prezzoAffittoMax = Number.MAX_SAFE_INTEGER;
          } else {
            this.$store.state.filtri.prezzoAffittoMax = this.filterMaxVendita;
          }
          this.$store.state.filtri.categoria = this.categoriaSelezionata;
          this.$store.state.filtri.pagamentoOnline = this.pagamentoOnline;
          console.log("pagamento online: ", this.pagamentoOnline)
        },
        resettaFiltri() {
          this.$store.commit('resettaFiltri');
          this.$store.state.category='';
          this.categoriaSelezionata='';
        },
    },
    computed:  {
      annuncioSalvato() {
        return this.$store.state.pubblicazioneAnnuncioSsuccess;
      },
      ...mapState({
        search: state => state.search,
        username: state => state.username,
        utenteLoggato: state => state.dataAuth.success,
        cate: state => state.filtri.categoria,
        annunci: state => state.annunci,
        // filterMinVendita: state => state.controlliFiltri.filterMinVendita,
        // filterMaxVendita: state => state.controlliFiltri.filterMaxVendita,
        // filterMinAffitto: state => state.controlliFiltri.filterMinAffitto,
        // filterMaxAffitto: state => state.controlliFiltri.filterMaxAffitto,
      }),

    },
    created() {
      if(this.$store.state.pubblicazioneAnnuncio === undefined) {
        this.$store.commit('setPubblicazioneAnnuncio');
      }
    this.$categories.forEach(v => this.categories.push(v.title));
  },
  updated() {
  }
}
</script>