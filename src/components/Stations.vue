<template>
  <div class="stations-container">
    <h1>Estaciones de Metro</h1>
    <div class="table-container"> <!-- Contenedor para la tabla -->
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
  max-height: 600px; /* Altura máxima del contenedor general */
  overflow: hidden;
}

.table-container {
  max-height: 500px; /* Altura máxima para el contenedor de la tabla */
  overflow-y: auto; /* Habilita el desplazamiento vertical para la tabla */
  background-color: #f0f0f0; /* Color de fondo opcional */
  padding: 10px; /* Espaciado para el contenedor de la tabla */
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
