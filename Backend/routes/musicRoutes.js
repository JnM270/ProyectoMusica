import express from 'express';
import { musicController } from '../controllers/musicController.js';
import { verifyToken } from '../middlewareVerif.js';

const router = express.Router();

router.get('/audios', musicController.getAllAudios);

router.post('/playlists', verifyToken, musicController.createPlaylist);
router.get('/audios/:id/play', verifyToken, musicController.playAudio);

export default router;