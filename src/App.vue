<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useStore } from 'vuex'
  import axios from 'axios'
  import TheMap from './components/TheMap.vue'
  import EarthquakeList from './components/EarthquakeList.vue'
  import "mapbox-gl/dist/mapbox-gl.css"

  const store = useStore()
  const quakeData = computed(() => store.state.quakeData)
  const map = ref()

  onMounted(async () => {
    const { data } = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
    const dataWithId = {
      ...data,
      features: data.features.map((feature) => {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            id: feature.id,
          }
        }
      })
    }
    store.commit('setQuakeData', { quakeData: dataWithId })
  })
</script>

<template>
  <header>
    <h1>Continuum Industries</h1>
    <h2>Earthquake Finder</h2>
  </header>

  <main>
    <EarthquakeList :quake-data="quakeData" :map="map" v-if="map"/>
    <TheMap :quake-data="quakeData" @map-ready="(mapInstance) => map = mapInstance"/>
  </main>
</template>

<style scoped>
header {
  color: #2c3e50;
  background: #8D8741;
  line-height: 1.5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 1rem;
  margin: 0.5rem;
  border: 2px solid #37392e;
  border-radius: 5px;
}

main {
  flex: 1;
  margin: 0.5rem;
  margin-top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    max-height: 10vh;
  }
}
</style>
