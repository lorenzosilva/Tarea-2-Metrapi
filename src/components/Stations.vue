<template>
  <div class="stations-container">
    <h1>Estaciones de Metro</h1>
    <div class="table-container"> 
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>ID</th>
            <th>Línea</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="station in stations" :key="station.station_id">
            <td>{{ station.name }}</td>
            <td>{{ station.station_id }}</td>
            <td>{{ station.line_id }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      stations: []
    };
  },
  mounted() {
    this.fetchStations();
  },
  methods: {
    async fetchStations() {
      try {
        const response = await axios.get('https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro/stations');
        this.stations = response.data;
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    }
  }
}
</script>

<style>
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


<style>
.stations-container {
  display: flex;
  flex-direction: column;
  max-height: 600px; 
  overflow: hidden;
}

.table-container {
  max-height: 500px; 
  overflow-y: auto; 
  background-color: #f0f0f0; 
  padding: 10px; 
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
