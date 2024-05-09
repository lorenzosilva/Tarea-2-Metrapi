<template>
    <div class="chat-container">
      <h2>Chat en línea</h2>
      <button v-if="!connected" @click="joinSocket">Unirse al Chat</button>
      <div class="message-list" v-else>
        <div v-for="message in listMessages" :key="message.id" :class="{'message': true, 'mine': message.isMine}">
          <div v-if="!message.isMine" class="sender-info">{{ message.sender }}</div>
          <div class="message-bubble">
            <div class="message-content">{{ message.content }}</div>
            <div class="message-meta">{{ message.timestamp }}</div>
          </div>
        </div>
      </div>
      <div class="message-form" v-if="connected">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Escribe un mensaje...">
        <button @click="sendMessage">Enviar</button>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref } from 'vue';
  
  let ws = null;
  const listMessages = ref([]);
  const newMessage = ref("");
  const connected = ref(false);
  const userId = "17625319";
  
  function joinSocket() {
    if (!ws) {
      ws = new WebSocket('wss://tarea-2.2024-1.tallerdeintegracion.cl/connect');
  
      ws.onopen = () => {
        connected.value = true;
        ws.send(JSON.stringify({
          type: "JOIN",
          payload: {
            id: userId,
            username: "Lorenzo Silva"
          }
        }));
      };
  
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          const message = {
            id: Date.now(),
            content: data.data.content,
            sender: data.data.name || "Usuario",  // Poner "Usuario" si no hay nombre específico
            timestamp: data.timestamp,
            isMine: data.data.id === userId  // Asumiendo que el mensaje tiene un identificador de usuario
          };
          listMessages.value.push(message);
        }
      };
    }
  }
  
  function sendMessage() {
    if (newMessage.value.trim()) {
      const message = {
        type: 'MESSAGE',
        content: newMessage.value,
        sender: "Tú",
        timestamp: new Date().toLocaleTimeString(),
        isMine: true
      };
      listMessages.value.push(message);
      ws.send(JSON.stringify({ type: 'MESSAGE', payload: {content: newMessage.value }}));
      newMessage.value = '';
    }
  }
  </script>
  
  <style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  max-height: 500px;
  overflow: hidden;
}

.message-list {
  overflow-y: auto;
  flex-grow: 1;
  background-color: #f0f0f0; /* Color de fondo del área de mensajes */
  padding: 10px;
}

.message {
  margin: 5px 0;
}

.sender-info {
  font-size: 0.85em;
  color: #666;
  margin-bottom: 3px;
}

.message-bubble {
  background-color: #f4f4f4;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  max-width: 80%;
}

.mine .message-bubble {
  background-color: #dcf8c6;
  align-self: flex-end; /* Alinea los mensajes del usuario a la derecha */
}

.message-content {
  font-size: 1em;
}

.message-meta {
  font-size: 0.75rem;
  color: #888;
  text-align: right;
  margin-top: 5px;
}

.message-form {
  display: flex;
  padding: 10px;
}

input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 15px;
}

button {
  padding: 8px 15px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
}
</style>

  
  
  
  //1. Que imprima todos los mensajes en el template. Y ojalá bonito (hoy día) 
  //2. Que sea escroleable (hoy día) 
  //3. Hacer lo mismo que esta clase en station y trens y que imprima la información en pantalla (fds)
  //4. Revisar el endpoint que me dieron para hacer el mapa. Usa el lifleif que es para hacer el mapa (fds)

//debbugear
//tipos de datos
//funciones
//cosas basicas de javascript