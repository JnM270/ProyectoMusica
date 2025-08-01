import fs from 'fs'
import { Audio } from '../models/musicModels.js'
import { Playlist } from '../models/playlistModels.js'
import { User } from '../models/userModels.js'

export const musicController = {
  
  getAllAudios: async (req, res) => {
    try {
      const audios = await Audio.find()
      console.log("Audios encontrados en DB:", audios)
      res.json(audios)
    } catch (error) {
      console.error("Error en getAllAudios:", error)
      res.status(500).json({ error: 'Error al obtener audios' })
    }
  },

  // Crear playlist
  createPlaylist: async (req, res) => {
    const { name, audioIds } = req.body
    const userId = req.userId

    try {
      console.log(" Creando playlist para usuario:", userId)
      const playlist = new Playlist({
        name,
        audios: audioIds,
        createdBy: userId
      })
      await playlist.save()
      console.log("Playlist creada:", playlist)

      await User.findByIdAndUpdate(userId, {
        $push: { playlists: playlist._id }
      })

      res.status(201).json(playlist)
    } catch (error) {
      console.error("Error en createPlaylist:", error)
      res.status(500).json({ error: 'Error al crear playlist' })
    }
  },

  // Reproducir audio
  playAudio: async (req, res) => {
    const audioId = req.params.id
    const userId = req.userId

    try {
      console.log("Solicitando audio:", audioId)
      const audio = await Audio.findOne({ _id: audioId })

      if (!audio) {
        console.log("Audio no encontrado en DB")
        return res.status(404).json({ error: 'Audio no encontrado' })
      }

      console.log("Ruta en DB:", audio.filePath)

      if (!audio.filePath || typeof audio.filePath !== 'string') {
        console.log("Ruta inválida o mal formateada:", audio.filePath)
        return res.status(400).json({ error: 'Ruta de archivo inválida' })
      }

      const rutaNormalizada = audio.filePath.trim()
      const archivoExiste = fs.existsSync(rutaNormalizada)

      console.log(`Verificación de existencia del archivo:\n→ Ruta: ${rutaNormalizada}\n→ ¿Existe en disco?: ${archivoExiste}`)

      if (!archivoExiste) {
        console.log("El archivo no está disponible para el backend")
        return res.status(404).json({ error: 'Archivo no encontrado en el servidor' })
      }

      console.log("Archivo encontrado. Enviando para reproducción:", rutaNormalizada)
      res.sendFile(rutaNormalizada)
    } catch (error) {
      console.error("Error en playAudio:", error)
      res.status(500).json({ error: 'Error al reproducir audio' })
    }
  }
}

