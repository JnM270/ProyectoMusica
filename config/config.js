  export const config = {
  
  DB_URL: 'mongodb+srv://jmlbs72302:jmlverde@cluster0.dzbmzlh.mongodb.net/dbmusic?authSource=admin',
  PORT: process.env.PORT || 3000,
  SERVER_IP: '192.168.1.109',
  PROTOCOL: 'http',
  JWT_SECRET: 'clave', 

  SMTP: {
    USER: 'jmlbs72302',
    PASS: 'jmlverde',
    PORT: 3000,
    SENDER_EMAIL: 'jmlbs72302@gmail.com',
    REPLY_TO: 'jmlbs72302@gmail.com',
  }
}

export const SERVER_URL = `${config.PROTOCOL}://${config.SERVER_IP}:${config.PORT}`;
