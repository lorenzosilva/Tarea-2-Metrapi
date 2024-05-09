<template>
  <div>
    <div id="map"></div>
    Hola Mapa
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import axios from 'axios';

onMounted(async () => {
  const map = L.map('map').setView([-33.437025035183005, -70.63350360318339], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const response = await axios.get('https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro/stations');
  const stations = response.data;


  const lineColors = {
    '1': 'red',
    '2': 'orange',
    '3': 'brown',
    '4': 'blue',
    '4A': 'darkgray',
    '5': 'green',
    '6': 'purple'
  };

 
  const stationsByPosition = {};
  stations.forEach(station => {
    const key = `${station.position.lat},${station.position.long}`;
    if (!stationsByPosition[key]) {
      stationsByPosition[key] = [];
    }
    stationsByPosition[key].push(station);
  });

  
  Object.values(stationsByPosition).forEach(stations => {
    const lineColor = lineColors[stations[0].line_id];
    const positions = stations.map(station => [station.position.lat, station.position.long]);
    L.polyline(positions, { color: lineColor }).addTo(map);
  });


  Object.values(stationsByPosition).forEach(stations => {
    stations.forEach(station => {
      const lineColor = lineColors[station.line_id];
      const marker = L.circleMarker([station.position.lat, station.position.long], {
        fillOpacity: 1,
        radius: 8,
        color: lineColor,
        fillColor: lineColor
      }).addTo(map);

      let popupContent = `<b>${station.name}</b><br>Linea: ${station.line_id}<br>ID Estacion: ${station.station_id}<br>`;
      marker.bindPopup(popupContent);

      L.tooltip({
        direction: 'bottom',
        permanent: true,
        opacity: 1,
        className: 'station-name'
      })
        .setContent(station.name)
        .setLatLng([station.position.lat, station.position.long])
        .addTo(map);
    });
  });

});
</script>

<style>
#map { height: 400px; }
.station-name {
  font-weight: bold;
  text-align: center;
}
</style>



