let sendEmail = (sender, receiver, subject, message) => {
    //research nodemailer for sending email from node.
    // https://nodemailer.com/about/
    // https://www.w3schools.com/nodejs/nodejs_email.asp
    //create a burner gmail account 
    //make sure you add the password to the environmental variables
    //similar to the DATABASE_URL and PHISH_DOT_NET_KEY (later section of the lab)

    //fake sending an email for now. Post a message to logs. 
    // console.log("*********************************************************")
    // console.log('To: ' + receiver)
    // console.log('From: ' + sender)
    // console.log('Subject: ' + subject)
    // console.log("_________________________________________________________")
    // console.log(message)
    // console.log("*********************************************************")
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
    service: 'gmail',
        auth: {
            user: 'TacomaHuskyTester@gmail.com',
            pass: 'Testtest1!'
        }
    });

    var mailOptions = {
        from: 'TacomaHuskyTester@gmail.com',
        to: 'perezm68@uw.edu',  // TODO change to users email
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { 
    sendEmail
}