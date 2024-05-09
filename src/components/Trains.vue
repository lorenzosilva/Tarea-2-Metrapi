<template>
  <div class="trains-container">
    <h2>Trenes</h2>
    <div>
      <button @click="connectWebSocket" :disabled="connected">Conectar al WebSocket</button>
    </div>
    <p>{{ message }}</p>
    <div class="table-container">
      <table v-if="trains.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Línea</th>
            <th>Chofer</th>
            <th>Estación Origen</th>
            <th>Estación Destino</th>
            <th>Estación Actual</th> <!-- Nueva columna -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="train in trains" :key="train.train_id">
            <td>{{ train.train_id }}</td>
            <td>{{ train.line_id }}</td>
            <td>{{ train.driver_name }}</td>
            <td>{{ train.origin_station_id }}</td>
            <td>{{ train.destination_station_id }}</td>
            <td>{{ getActualStation(train.train_id) }}</td> <!-- Mostrar la estación actual -->
          </tr>
        </tbody>
      </table>
      <p v-else>No hay datos de trenes disponibles.</p>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';

let ws = null;
const connected = ref(false);
const events = ref([]);
const trains = ref([]);
const message = ref("");

const connectWebSocket = () => {
  if (!ws) {
    ws = new WebSocket('wss://tarea-2.2024-1.tallerdeintegracion.cl/connect');

    ws.onopen = () => {
      connected.value = true;
      console.log("WebSocket connected");
      ws.send(JSON.stringify({
        type: "JOIN",
        payload: {
          id: "17625319", // tu ID de usuario
          username: "Lorenzo Silva"
        }
      }));
    };

    ws.onmessage = (event) => {
      console.log("Received event:", event.data);
      const eventData = JSON.parse(event.data);
      if (eventData.type === 'arrival') {
        const trainId = eventData.data.train_id;
        const trainExists = trains.value.some(train => train.train_id === trainId);
        if (trainExists) {
          message.value = "Se actualizó la información de la tabla.";
        } else {
          message.value = `El tren con ID ${trainId} no se encuentra disponible en este momento.`;
        }
        setTimeout(() => {
          message.value = "";
        }, 5000);
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

const filteredEvents = computed(() => {
  return events.value.filter(event => event.type === 'arrival');
});

// Función para obtener la estación actual del tren
const getActualStation = (trainId) => {
  const latestArrivalEvent = events.value.find(event => event.data.train_id === trainId);
  return latestArrivalEvent ? latestArrivalEvent.data.station_id : '-';
};

// Llamamos a fetchTrains al cargar la página para obtener la información de los trenes
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

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
</style>




