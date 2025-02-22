//cors politikasını belirlemek için
const corsOptions = {
    origin: function (origin, callback) {
      const whiteList = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        
        //bağlı olduğu domainler yazılmalı 
      ];
  
      if(whiteList.indexOf(origin) !== -1 || !origin){
        callback(null, true);
      }else{
        callback(new Error('Cors politikası tarafından engellendi.'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  }

  module.exports = corsOptions;