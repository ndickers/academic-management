/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
@Injectable()
export class MailServiceService {
    private transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: "465",
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.MAIL_PASS,
        },
    } as SMTPTransport.MailOptions);

    send(url: string, subject: string, to: string) {
        return new Promise((resolve, reject) => {
            if (!url) return reject(new Error("fail to send link"));
            const options = {
                from: `<${process.env.SENDER_EMAIL}>`,
                to,
                subject,
                html: ` <a href=${url}>${subject}</a> `,
            };
            return this.transporter.sendMail(options, (error: any, info: unknown) => {
                if (error) return reject(new Error(error));
                return resolve(info);
            });
        });

    }
}