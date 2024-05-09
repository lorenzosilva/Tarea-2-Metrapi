<template>
  <div>
    <div id="map">Mapa</div>
    <div class="position-events">
      <h2></h2>
      <ul>
        <li v-for="event in positionEvents" :key="event.timestamp">
          {{ event }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import axios from 'axios';

const positionEvents = ref([]);

onMounted(async () => {
  const map = L.map('map').setView([-33.437025035183005, -70.63350360318339], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const response = await axios.get('https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro/stations');
  const stations = response.data;

  // Define colors for each line
  const lineColors = {
    '1': 'red',
    '2': 'orange',
    '3': 'brown',
    '4': 'blue',
    '4A': 'darkgray',
    '5': 'green',
    '6': 'purple'
  };

  // Group stations by line
  const stationsByLine = {};
  stations.forEach(station => {
    if (!stationsByLine[station.line_id]) {
      stationsByLine[station.line_id] = [];
    }
    stationsByLine[station.line_id].push(station);
  });

  // Draw lines for each line of stations
  Object.values(stationsByLine).forEach(stations => {
    const lineColor = lineColors[stations[0].line_id];
    const positions = stations.map(station => [station.position.lat, station.position.long]);
    L.polyline(positions, { color: lineColor }).addTo(map);
  });

  // Add markers for each station
  stations.forEach(station => {
    const lineColor = lineColors[station.line_id];
    const marker = L.circleMarker([station.position.lat, station.position.long], {
      fillOpacity: 1,
      radius: 8,
      color: lineColor,
      fillColor: lineColor
    }).addTo(map);

    // Add station name, ID, and line as a popup on the marker
    const popupContent = `
      <b>${station.name}</b><br>
      <b>ID:</b> ${station.station_id}<br>
      <b>Línea:</b> ${station.line_id}<br>
    `;
    marker.bindPopup(popupContent);
  });

  // Connect to WebSocket for position events
  const ws = new WebSocket('wss://tarea-2.2024-1.tallerdeintegracion.cl/connect');

  ws.onopen = () => {
    console.log("WebSocket connected");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'position') {
      positionEvents.value.push(data);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };
});
</script>

<style>
#map { height: 400px; }
</style>






