<template>
  <v-container>
  <h1 justify="center" align="center"> Nuovo Annuncio</h1>
  <v-form v-model="valid" class="submit">
    <v-text-field 
    ma="auto" 
    filled 
    dense 
    rounded 
    v-model="titolo" 
    id="titolo" 
    label="Titolo Annuncio" 
    name="titolo"
    type="text" 
    color="accent accent-3" 
    :counter="40" 
    :rules="required.concat(titoloRule)" />
  
    <v-select 
    filled 
    dense 
    rounded 
    v-model="selectCat" 
    :items="categories" 
    :rules="[v => !!v || 'Item is required']"
    label="Categoria" 
    required></v-select>
  
    <v-textarea 
    v-model="descrizione" 
    id="descrizione" 
    name="descrizione" 
    label="Descrizione"
    color="accent accent-3" 
    :rules="required.concat(descrizioneRule)" 
    :counter="350" 
    no-resize 
    filled 
    dense 
    rounded 
    auto-grow></v-textarea>
    
    <v-text-field 
    v-model="indirizzo" 
    id="indirizzo" 
    label="Indirizzo di ritiro" 
    name="indirizzo" 
    type="text" 
    color="accent accent-3"
    :rules="required.concat(titoloRule)"
    filled 
    dense 
    rounded />

    
    <v-checkbox 
      v-model= "affitto" 
      :disable="vendita"
      label="affitto"
      color="indigo"
      hide-details
      large
      @click="vendita = false"
    ></v-checkbox>
    <v-checkbox 
      v-model= "vendita" 
      :disable="affitto"
      label="vendita"
      color="indigo"
      value="indigo"
      hide-details
      large
      @click="affitto = false"
    ></v-checkbox>
    <v-container
      

    v-if="!vendita && affitto"
    >
    <v-row ma = "auto">

      <v-col :cols="3">
        <v-text-field
        v-model="costoH"
        id="costoH"
        label="Costo all'ora?"
        name="costoH"
        type="text"
        color="accent accent-3"
        :rules= "requiredAff"
        filled
        dense
        rounded      
        />
      </v-col>

      <v-col :cols="3">
      <v-text-field
        v-model="costoG"
        id="costoG"
        label="Costo al giorno?"
        name="costoG"
        type="text"
        color="accent accent-3"
        :rules= "requiredAff"
        filled
        dense
        rounded      
        />
      </v-col>

      <v-col :cols="3">
      <v-text-field
        v-model="costoS"
        id="costoS"
        label="Costo alla settimana?"
        name="costoS"
        type="text"
        color="accent accent-3"
        :rules= "requiredAff"     
        filled
        dense
        rounded      
        />
      </v-col>

    </v-row>
    <!-- <v-row>
      <v-col>
      <v-btn  rounded align="center" justify="center">
        Aggiungi Date Non Diponibili
      </v-btn>
    </v-col>
      <v-col :col="2">
        <v-text-field
        v-model="range.start"
        id="startdate"
        label="startDate"
        name="startDate"
        type="date"
        color="accent accent-3"
        
        filled
        dense
        rounded      
        />
      </v-col>
      <v-col :col="2">
        <v-text-field
        v-model="range.end"
        id="startdate"
        label="startDate"
        name="startDate"
        type="date"
        color="accent accent-3"
       
        filled
        dense
        rounded      
        />
      </v-col>
      </v-row> -->
    </v-container>


    <v-container
    v-if="!affitto && vendita" 
    >
      <v-row>        
        <v-col :cols="3" ma="auto">
          <v-text-field
          v-model="costoVen"
          id="costoS"
          label="Prezzo di Vendita?"
          name="costoS"
          type="text"
          color="accent accent-3"
          filled
          dense
          rounded      
          />
        </v-col>
      </v-row>
    </v-container>
    <v-spacer></v-spacer>
    <v-container>
      
      <v-btn class="submit" rounded color="accent accent-3" dark @click="salvaAnnuncio" :disabled="!valid">Pubblica Annuncio</v-btn>
      
    </v-container>
  </v-form>
  <v-container>
    <v-alert v-if="annuncioSalvato" type="success" justify="center">
      Annuncio salvato correttamente!
    </v-alert>
    <v-alert v-if="erroreAnnuncio" type="error" justify="center">
      {{ message }}
    </v-alert>
  </v-container>
  </v-container>
</template>
  
<script>
export default {
  data:  () => ({
      vendita: false,
      affitto: false,
      valid: false,
      selectCat: null,
      categories:[],
      costoH: '',
      costoG: '',
      costoS:'',
      costoVen:'',
      range: {
        start: '',
        end: '',
      },
      periodoNonDisponibile: [],
      titolo: '',
      descrizione: '',
      indirizzo: '',
      annuncioSalvato: false,
      erroreAnnuncio: false,
      message: '',
      requiredAff: [
        v => !!v && this.affitto || 'Campo obbligatorio'
      ],
      requiredVen: [
        v => !!v && this.vendita || 'Campo obbligatorio'
      ],
      required: [
        v => !!v || 'Campo obbligatorio'
      ],
      titoloRule: [
        v => v.length <= 40 || 'Il titolo non può superare i 40 caratteri!'
      ],
      descrizioneRule: [
        v => v.length <= 350 || 'Il titolo non può superare i 40 caratteri!'
      ]
    }),
    methods: {
      async salvaAnnuncio() {
          console.log(this.$store.getters.token)
        try {
          fetch(this.$url + "api/a/savea", {
            method: 'POST',
            headers: { 
              "Content-Type": "application/json", 
              "x-access-token": this.$store.getters.token},
            body: JSON.stringify({ 
              inserzionista: this.$store.state.datiUtente.username, 
              titolo: this.titolo, 
              descrizione: this.descrizione,
              dataPubblicazione: this.today(),
              modalitaTransazione: this.vendita ? "vendita" : "affitto", 
              categoria: this.selectCat,
              indirizzo: this.indirizzo, 
              pagamentoOnline: this.pagamentoOnline,
              contoPaypall: this.contoPayPal,
              prezzo: this.costoVen,
              prezzoAffittoAlGiorno: this.costoG,
              prezzoAffittoSettimanale: this.costoS,
              prezzoAffittoAllOra: this.costoH,
            })
          }).then((resp) => resp.json())
            .then(data => {
              console.log(data);
              if (data.success === false) {
                this.message = data.message;
                this.erroreAnnuncio = true;
                return;
              }
              this.annuncioSalvato = true;
              //this.$refs.form.reset();
            })
        } catch (error) {
          console.error(error);
        }
      },
      today() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        return yyyy + "/" + mm + "/" + dd; 
      }
        
  },
  mounted() {
    if(this.$store.state.dataAuth.success == false) {
      this.$router.push("/userloginsignup")
    }
  
},  
created() {
    this.$categories.forEach(v => this.categories.push(v.title));
    console.log(this.categories)
  },


}


</script>