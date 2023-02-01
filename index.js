const express = require('express');
const axios = require('axios');
const firebase = require('firebase-admin');
const cron = require('node-cron');

const app = express();
const botToken = '5977867332:AAFz8bGw2pTuGZlgwYMaFA2UKAO451dL6pY';
const chatId = '-1001823334104';
var port = process.env.PORT || 5000;

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json');
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://english-re-learning-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const database = firebase.database();

// Schedule task to run 6 times a day
// cron.schedule('0 */2 * * *', () => {
app.get('/automatic', (req, res) => {
  database.ref().once('value', snapshot => {
    const data = snapshot.val();
    var datatosend = JSON.stringify(data);

    // Send data to Google Drive
    axios.post(`https://hook.us1.make.com/lgkuxogvgctducpw0c5f8hslz8e4gzk9`, {"method": "Automatic", "database": "Admin", datatosend})
    .then(() => {
      res.send('Data sent to Google Drive (Automatic)');
      console.log('Data sent to Google Drive (Automatic)');
    })
    .catch(error => {
      console.error(error);
      res.send('Error sending data to Google Drive (Automatic)');
      console.log('Error sending data to Google Drive (Automatic)');
    });
    // Send data to Telegram channel
    axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: "✅ Admin Database Automatic Backup Successfull\n\n"+ datatosend
    })
      .then(() => {
        console.log('Data sent to Telegram channel (Automatic)');
      })
      .catch(error => {
        console.error(error);
        console.log('Error sending data to Telegram channel (Automatic)');
      });
  });
});

app.get('/', (req, res) => {
    database.ref().once('value', snapshot => {
      const data = snapshot.val();
      var datatosend = JSON.stringify(data);
  
      // Send data to Google Drive
      axios.post(`https://hook.us1.make.com/lgkuxogvgctducpw0c5f8hslz8e4gzk9`, {"method": "Manual", "database": "Admin", datatosend})
      .then(() => {
        res.send('Data sent to Google Drive (Manual)');
        console.log('Data sent to Google Drive (Manual)');
      })
      .catch(error => {
        console.error(error);
        res.send('Error sending data to Google Drive (Manual)');
        console.log('Error sending data to Google Drive (Manual)');
      });
      // Send data to Telegram channel
      axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: "✅ Admin Database Manual Backup Successfull\n\n"+ datatosend
      })
        .then(() => {
          console.log('Data sent to Telegram channel (Manual)');
        })
        .catch(error => {
          console.error(error);
          console.log('Error sending data to Telegram channel (Manual)');
        });
    });
  });

  app.listen(port);
  console.log('Server started! At http://localhost:' + port);