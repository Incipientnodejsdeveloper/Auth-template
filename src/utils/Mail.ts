import nodemailer from 'nodemailer';
import ejs from 'ejs';

export const SendMail = async (templatePath:string,subject: string, recipient: string, data:any) => {
    try {
        const host = process.env.EMAIL_HOST ;
        const port = +process.env.EMAIL_PORT!;

        let transporter = nodemailer.createTransport({
            host,
            port,
            secure: true,
            auth: {
                user: "incipient.test@gmail.com",
                pass: "zygeogjzyqsobqns"
            },
            // === add this === //
            tls: { rejectUnauthorized: false }
        });
        

        ejs.renderFile(templatePath, data, (err, html) => {
            if (err) {
              console.error(err);
              throw (err as Error).message;
            } else {
                let mailOptions = {
                    from: `Flying Paws <incipient.test@gmail.com>`,
                    to: recipient,
                    subject: subject,
                    html: html
                };        
          
              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    throw (err as Error).message;
                } else {
                  console.log('Email sent: ' + info.response);
                  return true;
                }
              });
            }
          });

    } catch (err) {
        console.log(err)
        throw (err as Error).message;
    }
}
