import fs from 'fs'
import path from 'path'
import { Audio } from '../models/musicModels.js'


const AUDIOS_DIR = ''

export const musicService = {
  // Obtener lista de archivos de audio
  getAudioFiles: () => {
    return fs
      .readdirSync(AUDIOS_DIR)
      .filter(file =>
        ['.mp3', '.wav'].includes(path.extname(file).toLowerCase())
      )
  },

  // Buscar un audio por nombre
  findAudio: filename => {
    const files = musicService.getAudioFiles()
    return files.find(file => file === filename)
  },

  // Crear metadata en la DB
  createAudioDB: async (title, filename, userId) => {
    const filePath = path.join(AUDIOS_DIR, filename)
    const audio = new Audio({
      title,
      filePath,
      uploadedBy: userId
    })
    return await audio.save()
  }
}
