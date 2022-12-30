<template>
    <router-link @click="home" to="/">
        <span>
             <v-img 
             :src="require('@/assets/spottyLogo.png')" 
             contain 
             max-width="200"></v-img>
         </span>
    </router-link> 
</template>

<script>

export default {
    methods: {
       home () {
        this.$store.commit('resettaFiltri');
       }

    }
}
</script>