
# Approach

- Use single file components and the Vue3 Composition API
- Centralise complex state into Vuex
- Make extensive use of typing
- Handle asynchronous interactions (fetching geojson using Axios) within Vuex actions.

## Outcomes

- App works as requirements dictate
- It is fast
- Written using Vue3's modern composition API.

## Improvements

- CSS could be improved.
- Mapbox's built in ability to notice when the window is resized isn't great without a resize observer, could add one.
- Could add a "Clear search" button to sidebar.
- Tests could be added.
- Code prettying via linting.

## Challenges

- Not super familiar with Vue, lead to some silly mistakes (forgetting to tag on `.value` onto refs etc)
- Had to manually export Vuex types as the packages typing was not being picked up by TS.
