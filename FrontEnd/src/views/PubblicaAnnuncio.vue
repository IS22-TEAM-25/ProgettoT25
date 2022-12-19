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
    
    <v-row>
      <v-col>
        <v-text-field 
        v-model="via" 
        id="via" 
        label="Via/Piazza"
        placeholder="via Sommarive 9" 
        name="via" 
        type="text" 
        color="accent accent-3"
        :rules="required"
        filled 
        dense 
        rounded />
      </v-col>
      <v-col>
        <v-text-field 
        v-model="città" 
        id="città" 
        label="Città"
        placeholder="Povo" 
        name="città" 
        type="text" 
        color="accent accent-3"
        :rules="required"
        filled 
        dense 
        rounded />
      </v-col>
      <v-col>
        <v-text-field 
        v-model="provincia" 
        id="provincia" 
        label="Provincia"
        placeholder="Trento" 
        name="provincia" 
        type="text" 
        color="accent accent-3"
        :rules="required"
        filled 
        dense 
        rounded />
      </v-col>
    </v-row>
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
        :rules= "required"
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
        :rules= "required"
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
        :rules= "required"     
        filled
        dense
        rounded      
        />
      </v-col>
    </v-row>
    </v-container>

    <v-container
    v-if="!affitto && vendita" 
    >
      <v-row>        
        <v-col :cols="3" ma="auto">
          <v-text-field
          v-model="costoVen"
          id="costoVen"
          label="Prezzo di Vendita?"
          name="costoVen"
          type="text"
          color="accent accent-3"
          :rules="required"
          filled
          dense
          rounded      
          />
        </v-col>
      </v-row>
    </v-container>
    <v-spacer></v-spacer>
    <v-container>
      <v-btn 
      class="submit" 
      rounded color="accent accent-3" 
      dark 
      @click="salvaAnnuncio" 
      :disabled="!valid"
      >Pubblica Annuncio
    </v-btn>
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
      via: '',
      città: '',
      provincia: '',
      annuncioSalvato: false,
      erroreAnnuncio: false,
      message: '',
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
              modalitaTransazione: this.vendita ? "Vendita" : "Affitto", 
              categoria: this.selectCat,
              via: this.via,
              citta: this.città,
              provincia: this.provincia, 
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
  },


}


</script>