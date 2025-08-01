import app from './middleware.js'
import { dbConnection } from './db.js'
import userRoutes from './routes/userRoutes.js'       
import musicRoutes from './routes/musicRoutes.js'     

// Conexión a la DB
dbConnection(app)


app.use('/users', userRoutes)   
app.use('/music', musicRoutes)    

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('La petición funciona')
})



