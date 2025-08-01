 // models/Playlist.js
import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  audios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic: { type: Boolean, default: false }
});

export const Playlist = mongoose.model('Playlist', PlaylistSchema);