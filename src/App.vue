<script setup lang="ts">
  import TheMap from './components/TheMap.vue'
  import EarthquakeList from './components/EarthquakeList.vue'
  import "mapbox-gl/dist/mapbox-gl.css"
</script>

<template>
  <header>
    <h1>Continuum Industries</h1>
    <h2>Earthquake Finder</h2>
  </header>

  <main>
    <EarthquakeList />
    <TheMap />
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
