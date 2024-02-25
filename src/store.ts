import axios from 'axios'
import mapboxgl, { Map } from 'mapbox-gl'
import './assets/main.css'
import type { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson'
import { type InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

interface State {
  quakeData: FeatureCollection | null;
  map: Map | null;
  filter: string | null;
}

export const key: InjectionKey<Store<State>> = Symbol()

export function useStore () {
  return baseUseStore(key);
}

export enum Actions {
  INIT_MAP = 'INIT_MAP',
  APPLY_FILTER = 'APPLY_FILTER'
}

export enum Get {
  QUAKE_LIST = 'QUAKE_LIST'
}

export enum Mutate {
  SET_QUAKE_DATA = 'SET_QUAKE_DATA',
  SET_FILTER = 'SET_FILTER',
  SET_MAP = 'SET_MAP'
}

export const store = createStore<State>({
  state: {
      quakeData: null,
      map: null,
      filter: null
  },
  mutations: {
    [Mutate.SET_QUAKE_DATA] (state: State, payload: { quakeData: FeatureCollection }) {
      state.quakeData = payload.quakeData
    },
    [Mutate.SET_FILTER] (state: State, payload: { filter: string}) {
      state.filter = payload.filter
    },
    [Mutate.SET_MAP] (state: State, payload: { map: Map }) {
      state.map = payload.map
    }
  },
  getters: {
    [Get.QUAKE_LIST] (state: State): Feature<Geometry, GeoJsonProperties>[] | undefined {
      return state.quakeData?.features;
    }
  },
  actions: {
    [Actions.APPLY_FILTER] ({ commit, state, getters}, payload: { filter: string | null }) {
      const quakeList: Feature<Geometry, GeoJsonProperties>[] | undefined  = getters[Get.QUAKE_LIST];

      const idsToFilter: Array<string | undefined> | undefined = quakeList
        ?.filter((quake) => !quake.properties?.title.toLowerCase().includes(payload.filter))
        .map((q) => String(q.id))

      if(state.map){
        if(idsToFilter && idsToFilter.length > 0) {
          const mapfilter = ['!', ['any', [
              'any',
              ...(idsToFilter).map((id) => ['in', `${id}`, ['get', 'id']])
          ]]];
          state.map.setFilter(
            'earthquake-layer',
            mapfilter
          )
        } else {
          state.map.setFilter(
            'earthquake-layer',
            null
          )
        }
      }
      commit(Mutate.SET_FILTER, { filter: payload.filter} )
    },
    async [Actions.INIT_MAP] ({ commit }, payload: { ref: string | HTMLElement}) {
      mapboxgl.accessToken = 'pk.eyJ1IjoiYXRyZWlkcyIsImEiOiJjbHQwM3Q1aG8wdmh4Mmlsb293dWM5dmxkIn0.XpdInlp49eSijyWMIU_UKQ'

      const map = new mapboxgl.Map({
        container: payload.ref,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-95, 40],
        zoom: 3,
      })

      const { data } = await axios.get<FeatureCollection>('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
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

      if(map){
        map.on('load', () => {
          if(dataWithId && map){
              map.addSource('earthquakes-source', {
              type: 'geojson',
              data: dataWithId,
              promoteId: 'id'
            })
            map.addLayer({
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
        })
      }
      commit(Mutate.SET_MAP, { map });
      commit(Mutate.SET_QUAKE_DATA, { quakeData: dataWithId })
    }
  }
})