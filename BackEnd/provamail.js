const nodemailer = require('nodemailer');

//addr: spottythingsweb@gmail.com
// pass: 'gpsltvgbizgswaaj'
require('dotenv').config()


let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASS
    }
});

let mailDetails = {
    from: 'spottythingsweb@gmail.com',
    to: 'xyz@gmail.com',
    subject: 'Buongiorno, una mail da javascript',
    text: 'Ciao a tutti'
};

mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error! ' + err)
    } else {
        console.log('All good');
    }
});