 import mongoose from 'mongoose';
import { config } from '../config/config.js';
import { User } from './models/userModels.js';

const { DB_URL, PORT } = config;

export const dbConnection = async (app) => {  
  console.log("🔄 Intentando conectar a MongoDB en:", DB_URL.replace(/:([^\/])+@/, ':***@')); // Oculta contraseñas

  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log("✔ MongoDB conectado correctamente");
    mongoose.connection.once('open', () => {
  console.log('Conectado a:', mongoose.connection.name)
})

    console.log("📊 Base de datos actual:", mongoose.connection.db.databaseName);

    
console.log("🔍 Estado de conexión:", mongoose.connection.readyState); // 1 = conectado

console.log("📦 Modelos registrados:", mongoose.modelNames()); // ¿Aparece 'User'?

const userCount = await User.countDocuments();
console.log("👥 Usuarios visibles desde el modelo:", userCount);

for (const col of ['users', 'audios', 'playlists']) {
  try {
    const count = await mongoose.connection.db.collection(col).countDocuments();
    console.log(`📊 Documentos en '${col}':`, count);
  } catch (err) {
    console.warn(`⚠️ No se pudo contar documentos en '${col}':`, err.message);
  }
}

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📚 Colecciones disponibles:", collections.length > 0 
      ? collections.map(c => c.name) 
      : "❌ No hay colecciones en esta base de datos");

    // Verificar colecciones críticas
    const requiredCollections = ['audios', 'users', 'playlists'];
    requiredCollections.forEach(col => {
      const exists = collections.some(c => c.name === col);
      console.log(`${exists ? 'Sí' : 'No'} Colección '${col}': ${exists ? 'EXISTE' : 'NO EXISTE'}`);
    });

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });

  } catch (error) {
    console.error(' Error al conectar con MongoDB:', error.message);
    if (error.message.includes("ECONNREFUSED")) {
    
    }
  }

  // Eventos de conexión
  mongoose.connection.on('disconnected', () => console.warn("MongoDB desconectado"));
  mongoose.connection.on('reconnected', () => console.log("MongoDB conectado"));
};

