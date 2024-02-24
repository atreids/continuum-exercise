import './assets/main.css'
import type { FeatureCollection } from 'geojson'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

export interface State {
  quakeData: FeatureCollection | null;
  map: any;
  filter: string | null;
}

const store = createStore<State>({
  state: {
      quakeData: null,
      filter: null
  },
  mutations: {
    setQuakeData (state: State, payload: { quakeData: FeatureCollection }) {
      state.quakeData = payload.quakeData
    },
    setFilter (state: State, payload: { filter: string}) {
      state.filter = payload.filter
    }
  }
})

createApp(App).use(store).mount('#app')

//TODO: make search filter list
//TODO: fix types
//TODO: add tests
//TODO: use more state management?
