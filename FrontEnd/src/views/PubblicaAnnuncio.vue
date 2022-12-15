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
    v-model="titolo" 
    id="indirizzo" 
    label="Indirizzo di ritiro" 
    name="indirizzo" 
    type="text" 
    color="accent accent-3"
    :rules="required.concat(titoloRule)"
    filled 
    dense 
    rounded />

    <v-container
      


    v-if="!vendita"
    >
    <v-row ma = "auto">
      <v-col :cols="3">
        <v-checkbox 
        v-model= "affitto" 
        :disable="vendita"
        label="affitto"
        color="indigo"
        hide-details
        large
        ></v-checkbox>
      </v-col >

      <v-col :cols="3">
        <v-text-field
        v-model="costoH"
        id="costoH"
        label="Costo all'ora?"
        name="costoH"
        type="text"
        color="accent accent-3"
        :rules="required"
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
        :rules="required"
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
        :rules="required"
        filled
        dense
        rounded      
        />
      </v-col>

    </v-row>
    <v-row>
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
        :rules="required"
        filled
        dense
        rounded      
        />
      </v-col>
      <v-col :col="2">
        <v-text-field
        v-model="range.start"
        id="startdate"
        label="startDate"
        name="startDate"
        type="date"
        color="accent accent-3"
        :rules="required"
        filled
        dense
        rounded      
        />
      </v-col>
      </v-row>
    </v-container>


    <v-container
    v-if="!affitto" 
    >
      <v-row>
        <v-col :cols="3" ma="auto">
          <v-checkbox 
          v-model= "vendita" 
          :disable="affitto"
          label="vendita"
          color="indigo"
          value="indigo"
          hide-details
          large
          ></v-checkbox>
        </v-col>
        
        <v-col :cols="3" ma="auto">
          <v-text-field
          v-model="costoS"
          id="costoS"
          label="Prezzo di Vendita?"
          name="costoS"
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


  </v-form>
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
    //   async salvaAnnuncio() {
    //   try {
    //     fetch(this.$url + "api/a/savea", {
    //       method: 'POST',
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ username: this.username, password: this.password, nome: this.nome, cognome: this.cognome, datadinascita: this.dob, indirizzo: this.indirizzo, email: this.email })
    //     }).then((resp) => resp.json())
    //       .then(data => {
    //         console.log(data);
    //         if (data.success === false) {
    //           this.message = data.message;
    //           this.erroreRegistrazione = true;
    //           return;
    //         }
    //         this.accountCreato = true;
    //         this.step = 1;
    //         //this.$refs.form.reset();
    //       })
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    
  },
  created() {
    this.$categories.forEach(v => this.categories.push(v.title));
    console.log(this.categories)
  },


}


</script>