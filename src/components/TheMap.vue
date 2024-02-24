<script setup lang="ts">
  import mapboxgl from 'mapbox-gl'
  import { onMounted, ref } from 'vue';

  const props = defineProps(['quakeData'])
  const emit = defineEmits(['map-ready'])
  const map = ref()
  const mapContainer = ref(null)

  onMounted(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXRyZWlkcyIsImEiOiJjbHQwM3Q1aG8wdmh4Mmlsb293dWM5dmxkIn0.XpdInlp49eSijyWMIU_UKQ'

    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-95, 40],
      zoom: 3,
    })

    map.value.on('load', () => {
      if(props.quakeData){
          map.value.addSource('earthquakes-source', {
          type: 'geojson',
          data: props.quakeData,
          promoteId: 'id'
        })

        map.value.addLayer({
          id: 'earthquake-layer',
          source: 'earthquakes-source',
          type: 'circle',
          layout: {},
          paint: {
            'circle-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                '#E27D60',
                '#659DBD'
            ],
            'circle-radius': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                20,
                10
            ]
          }
        })
      }
      emit('map-ready', map.value)
    })
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