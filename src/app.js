const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const firebase = require('firebase')
var nodemailer = require('nodemailer')


const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

var config = {
  apiKey: "AIzaSyCnkwco1-0ZiC82eVmgsfhPYvF2ZrvEpZk",
  authDomain: "projectospital.firebaseapp.com",
  databaseURL: "https://projectospital.firebaseio.com",
  projectId: "projectospital",
  storageBucket: "projectospital.appspot.com",
  messagingSenderId: "969365951070"
};
firebase.initializeApp(config);
var showdata = []
var equipments = firebase.database().ref('equipments')

equipments.on('child_added', function (snapshot) {
  let item = snapshot.val()
  item.id = snapshot.key
  showdata.push(item)
})

setTimeout(() => {
  console.log(showdata[1].amountEqm)
},3000)


/* app.get('/posts', (req, res) => {
  res.send(
    [{
      title: "Hello World!",
      description: "Hi there! How are you?"
    }]
  )
  // sendEmail()
  console.log('hello cron')
})

function sendEmail() {
  // sendEmail
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: '5706021622141@fitm.kmutnb.ac.th',
      pass: '08486787bg'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  let HelperOptions = {
    from: '"Beer" <5706021622141@fitm.kmutnb.ac.th>',
    to: 'panudach_beer_2012@hotmail.co.th',
    subject: '555',
    text: 'GGGG'
  };
  
  transporter.sendMail(HelperOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("The message was sent!");
      console.log(info);
  })
}
app.listen(process.env.PORT || 8081) */