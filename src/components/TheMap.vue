<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useStore, Actions } from '../store'

  const store = useStore();

  const mapContainer = ref(null)

  onMounted(() => {
    if(mapContainer.value){
      store.dispatch(Actions.INIT_MAP, { ref: mapContainer.value})
    }
  })
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>


<style>
.map-container {
  flex: 1;
  border: 2px solid black;
  border-radius: 5px;
}
</style>