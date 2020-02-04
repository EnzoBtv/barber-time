import { createTransport } from "nodemailer";
import { resolve } from "path";
//@ts-ignore
import hbs from "nodemailer-express-handlebars";
import Logger from "./Logger";

interface IContext {
    [key: string]: string;
}

interface ISend {
    from: string;
    to: string;
    subject: string;
    template: string;
    context: IContext;
}
class Email {
    static TRANSPORTER = createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        // tls: {
        //     ciphers: "SSLv3"
        // },
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    to: string;
    from: string = process.env.EMAIL_USER;
    subject: string;
    template: string;
    context: IContext;

    constructor(
        to: string,
        subject: string,
        template: string,
        context: IContext
    ) {
        this.to = to;
        this.subject = subject;
        this.template = template;
        this.context = context;
    }
    async send() {
        try {
            let mail = await Email.TRANSPORTER.sendMail({
                from: this.from,
                to: this.to,
                subject: this.subject,
                template: "forgotPassword",
                context: this.context
            } as ISend);
            if (mail) {
                Logger.info("Email enviado com sucesso" + JSON.stringify(mail));
                return mail;
            }
        } catch (ex) {
            throw new Error(ex.message);
        }
    }
}

Email.TRANSPORTER.use(
    "compile",
    hbs({
        viewEngine: {
            extName: ".handlebars",
            partialsDir: resolve(__dirname, "..", "mail"),
            layoutsDir: resolve(__dirname, "..", "mail"),
            defaultLayout: "email.body.hbs"
        },
        viewPath: resolve(__dirname, "..", "mail"),
        extName: ".handlebars"
    })
);

export default Email;
