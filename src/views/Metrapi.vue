
<template>
<!-- Las llaves {{  }} te dejan usar variables del javascript directamente. -->

<div class="grid-container">
    <Map class="map"></Map>
    <Chat class="chat"></Chat>
    <Stations class="stations"></Stations>
    <Trains class="trains"></Trains>
</div>

</template>

<script setup>
//El setup es una opcion para que se pueda escribir el codigo de cierta manera. Es más nativo la escribir más en javascript más que en vue
import Chat from '@/components/Chat.vue';
import Map from '@/components/Map.vue';
import Stations from '@/components/Stations.vue';
import Trains from '@/components/Trains.vue';

</script>

<style scoped>

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Divide el contenedor en dos columnas */
  grid-template-rows: 1fr 1fr; /* Divide el contenedor en dos filas */
  gap: 10px; /* Espacio entre las celdas del grid */
  height: 100vh; /* Ajusta la altura del contenedor grid al 100% de la altura de la vista */
  padding: 10px;
}

.map {
  background-color: rgba(251, 250, 250, 0.8);
  width: 100%; /* Asegura que cada componente llene su celda en el grid */
  height: 100%;
  box-sizing: border-box; /* Incluye el padding en el cálculo del width/height */
  padding: 20px;
  text-align: center;
  font-size: 20px;

}

.chat {
  background-color: rgba(251, 250, 250, 0.8);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
  font-size: 20px;
}

.stations {
  background-color: rgba(251, 250, 250, 0.8);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
  font-size: 20px;
}

.trains {
  background-color: rgba(251, 250, 250, 0.8);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
  font-size: 20px;
}



</style>