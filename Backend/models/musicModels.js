 // models/Audio.js
import mongoose from 'mongoose';

const AudioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, required: true }, 
  duration: { type: Number }, 
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
});

export const Audio = mongoose.model('Audio', AudioSchema, 'audios');