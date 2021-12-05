const nodemailer = require('nodemailer');
const nodemailMailGun = require('nodemailer-mailgun-transport');

// step 1
const auth = {
    auth: {
        api_key: 'key-e3809c6bd7fb97a3ec336f255e5ea52b',
        domain: 'email.pensms.com'
    }
};

// step 2
let transporter = nodemailer.createTransport(nodemailMailGun(auth));

//step 3
const mailOption = {
    from: 'Excited User <ade@gmail.com>',
    to: 'adurotimijoshua@gmail.com',
    subject: 'Welcome to my app',
    text: 'It is working'
};

// Step 4
transporter.sendMail(mailOption, function (err, data) {
    if (err){
        console.log('Error', err)
    } else {
        console.log('Message Sent!!!')
    }
})


