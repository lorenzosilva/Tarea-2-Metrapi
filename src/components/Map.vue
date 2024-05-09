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

  // Group stations by position
  const stationsByPosition = {};
  stations.forEach(station => {
    const key = `${station.position.lat},${station.position.long}`;
    if (!stationsByPosition[key]) {
      stationsByPosition[key] = [];
    }
    stationsByPosition[key].push(station);
  });

  // Add markers for each station
  Object.values(stationsByPosition).forEach(stations => {
    const marker = L.circleMarker([stations[0].position.lat, stations[0].position.long], {
      fillOpacity: 1,
      radius: 8
    }).addTo(map);

    let popupContent = '';
    stations.forEach(station => {
      const lineColor = lineColors[station.line_id];
      marker.setStyle({
        color: lineColor,
        fillColor: lineColor
      });
      popupContent += `<b>${station.name}</b><br>Linea: ${station.line_id}<br>ID Estacion: ${station.station_id}<br>`;
    });
    marker.bindPopup(popupContent);

    // Add station name below the marker
    const stationName = L.tooltip({
      direction: 'bottom',
      permanent: true,
      opacity: 1,
      className: 'station-name'
    })
      .setContent(stations[0].name)
      .setLatLng([stations[0].position.lat, stations[0].position.long])
      .addTo(map);
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




Este es mi código en Map.Vue. Lo que tengo que tienes que hacer, es conectarte a tarea-2.2024-1.tallerdeintegracion.cl/api/metro/stations para que marques la ubicación de todas las estaciones existentes del servicio STATIONS. Al hacer click en el marcador, debe mostrar toda la información relevante sobre la estación (id estación, Nombre, Línea). También debe mostrar una línea que une todas las estaciones por línea, usando el color respectivo de la línea, indicado en el servicio LINES. Definiremos la estación 1 con color rojo, la linea 2 con color naranjo, la linea 3 con color con color café, la línea 4 con color azul, la línea 4A con color gris oscuro, la línea 5 con color verde, la línea 6 con color morado
