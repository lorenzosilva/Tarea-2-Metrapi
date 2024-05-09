<template>
  <div class="trains-container">
    <h2>Trenes</h2>
    <div>
      <button @click="connectWebSocket" :disabled="connected">Conectar al WebSocket</button>
    </div>
    <div class="table-container">
      <table v-if="trains.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Línea</th>
            <th>Chofer</th>
            <th>Estación Origen</th>
            <th>Estación Destino</th>
            <th>Estación Actual</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="train in trains" :key="train.train_id">
            <td>{{ train.train_id }}</td>
            <td>{{ train.line_id }}</td>
            <td>{{ train.driver_name }}</td>
            <td>{{ train.origin_station_id }}</td>
            <td>{{ train.destination_station_id }}</td>
            <td>{{ getActualStation(train.train_id) }}</td> <!-- Mostramos la estación actual del tren -->
          </tr>
        </tbody>
      </table>
      <p v-else>No hay datos de trenes disponibles.</p>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

let ws = null;
const connected = ref(false);
const events = ref([]);
const trains = ref([]);

const connectWebSocket = () => {
  if (!ws) {
    ws = new WebSocket('wss://tarea-2.2024-1.tallerdeintegracion.cl/connect');

    ws.onopen = () => {
      connected.value = true;
      console.log("WebSocket connected");
      ws.send(JSON.stringify({
        type: "JOIN",
        payload: {
          id: "17625319", 
          username: "Lorenzo Silva"
        }
      }));
    };

    ws.onmessage = (event) => {
      console.log("Received event:", event.data);
      const eventData = JSON.parse(event.data);
      if (eventData.type === 'arrival') {
        const trainId = eventData.data.train_id;
        const trainIndex = trains.value.findIndex(train => train.train_id === trainId);
        if (trainIndex !== -1) {
          // Actualizamos la estación actual del tren en la tabla
          trains.value[trainIndex].actual_station_id = eventData.data.station_id;
        }
        events.value.push(eventData);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      connected.value = false;
      console.log("WebSocket connection closed");
    };
  }
};

const fetchTrains = async () => {
  try {
    const response = await axios.get('https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro/trains');
    trains.value = response.data;
  } catch (error) {
    console.error('Error fetching trains:', error);
  }
};

const getActualStation = (trainId) => {
  const train = trains.value.find(train => train.train_id === trainId);
  return train ? train.actual_station_id : '-';
};

fetchTrains();
</script>

<style scoped>
.trains-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
}
</style>






