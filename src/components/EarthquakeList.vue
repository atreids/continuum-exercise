

<script setup lang="ts">
  import { useStore } from 'vuex'
  const { map, quakeData } = defineProps(['quakeData', 'map'])
  console.log({ quakeData})

  type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T
    currentTarget: T
  }

  const enlargeQuake = (event: MouseEvent) => {
    if(map){
      const el = event.currentTarget as HTMLLIElement;
      map.setFeatureState(
        { source: 'earthquakes-source', id: el.id},
        { hover: true}
      )
    }
  }

  const resetQuake = (event: MouseEvent) => {
    if(map){
      const el = event.currentTarget as HTMLLIElement;
      map.setFeatureState(
        { source: 'earthquakes-source', id: el.id},
        { hover: false}
      )
    }
  }

  const zoomTo = (event: MouseEvent) => {
    if(map){
      const el = event.currentTarget as HTMLLIElement;
      const coords = quakeData.features.find((quake) => quake.id === el.id).geometry.coordinates
      map.panTo(coords)
    }
  }

  const searchSubmit = (event: HTMLElementEvent<HTMLTextAreaElement>) => {
    const search = event.currentTarget.value.toLowerCase()
    const idsToFilter: string[] = quakeData.features.filter((quake) => !quake.properties.title.toLowerCase().includes(search)).map((q) => q.id)
    if(idsToFilter.length > 0) {
      const mapfilter = ['!', ['any', [
          'any',
          ...(idsToFilter).map((id) => ['in', `${id}`, ['get', 'id']])
      ]]];
      map.setFilter(
      'earthquake-layer',
      mapfilter
    )
    } else {
      map.setFilter(
        'earthquake-layer',
        null
      )
    }
  }

</script>

<template>
  <div class="sidebar">
    <input type="text" placeholder="Filter earthquakes" id="filter-input" @keyup="(e: any) => searchSubmit(e)">
    <div class="list">
      <ul v-if="quakeData">
        <li
          v-for="quake in quakeData.features"
          :key="quake.id"
          @mouseover="enlargeQuake"
          @mouseleave="resetQuake"
          @mouseup="zoomTo"
          :id="quake.id"
        >
          {{ quake.properties.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style>

input {
  font:
      12px/20px 'Helvetica Neue',
      Arial,
      Helvetica,
      sans-serif;
  width: 100%;
  border: 0;
  background-color: #fff;
  margin: 0;
  color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 20px;
  background: #659DBD;
  padding: 0.5rem;
  border: 2px solid black;
  border-radius: 5px;
}

.list {
  height: 60vh;
  border: 2px solid #37392e;
  border-radius: 5px;
  scroll-snap-type: y mandatory;
  overscroll-behavior-y: contain;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-timeline: --listTimeline block;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  background: #8D8741;
  padding: 20px;
  border: 2px solid #2c3e50;
  border-radius: 5px;
  scroll-snap-align: start;
  transition: 0.3s;
  margin: 1px;
}

li:hover {
  background: #E27D60
}

</style>