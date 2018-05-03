const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const firebase = require('firebase')
var nodemailer = require('nodemailer')
var dateFormat = require('dateformat')


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
var historys = firebase.database().ref('history')

////////////////////////////////////////////////////////////////////////////////////////////////////////
historys.on('child_changed', function (snapshot) { 
  let data = snapshot.val()
  data.id = snapshot.key
  var key = snapshot.key
  var index = showdata.findIndex(history => history.id === key)
  showdata.splice(index,1)
  showdata.push(data)
})

historys.on('child_removed', function (snapshot) {
    var id = snapshot.key
    var index = showdata.findIndex(history => history.id === id)
    showdata.splice(index,1)
})

historys.on('child_added', function (snapshot) {
  let item = snapshot.val()
  item.id = snapshot.key
  showdata.push(item)
})
////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/posts', (req, res) => {
  res.send(
    [{
      title: "Hello World!",
      description: "Hi there! How are you?"
    }]
  )
  // วันที่ปัจจุบัน
  let now = new Date()
  let date = dateFormat(now, "m/d/yyyy")
  let dateNow = new Date(date).getTime()
  // วันที่คืน
  // let dateCheck = new Date('5/8/2018').getTime()
  // แจ้งเตือนก่อน วัน
  // let dateSendNoti = new Date(dateCheck).getTime() - 432000000

  setTimeout(() => {
    for (let i = 0; i < showdata.length; i++) {
      let dateCheck = new Date(showdata[i].dateCheckReturn).getTime()
      let dateSendNotiFive = new Date(dateCheck).getTime() - 432000000 // set วันที่แจ้งเตือนก่อน 5 วัน
      let dateSendNotiOne = new Date(dateCheck).getTime() - 86400000 // set วันที่แจ้งเตือนก่อน 1 วัน
      if (dateNow === dateSendNotiFive || dateNow === dateSendNotiOne) {
        let email = showdata[i].email
        let idLend = showdata[i].idLend
        let firstname = showdata[i].firstname
        let lastname = showdata[i].lastname
        let department = showdata[i].department
        let nameEqm = showdata[i].nameEqm
        let dateReturn = showdata[i].dateCheckReturn

        let HelperOptions = {
          from: '"ADMIN_HOSPITAL" <admin_hospital@admin.com>',
          to: email,
          subject: 'แจ้งกำหนดการคืนอุปกรณ์ทางการแพทย์',
          html: 'เรียนคุณ ' + firstname + ' ' + lastname + '<br>' + ' แผนก ' + department + '<br><br>' + 'เลขที่การยืม ' + idLend + '<br>' + nameEqm + ' ครบกำหนดการคืนในวันที่ ' + dateReturn + ' กรุณานำอุปกรณ์มาส่งคืนภายในวันที่กำหนด'
        };
        sendEmail(HelperOptions)
      } else { 
        console.log('GG') 
      }
     }
  },5000)
  
  // sendEmail()
})

function sendEmail(HelperOptions) {
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
  
  // let HelperOptions = {
  //   from: '"Beer" <5706021622141@fitm.kmutnb.ac.th>',
  //   to: 'panudach_beer_2012@hotmail.co.th',
  //   subject: '555',
  //   text: 'GGGG'
  // };
  
  transporter.sendMail(HelperOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("The message was sent!");
      console.log(info);
  })
}
app.listen(process.env.PORT || 8081)