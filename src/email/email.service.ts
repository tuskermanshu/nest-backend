import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {

    transporter: Transporter

    constructor(private configService: ConfigService) {
        this.transporter = createTransport({
            host: this.configService.get('email.host'),
            port: this.configService.get('email.port'),
            secure: false,
            auth: {
                user: this.configService.get('email.name'),
                pass: this.configService.get('email.code')
            },
        });
    }

    async sendMail({ to, subject, html }) {
        await this.transporter.sendMail({
            from: {
                name: '会议室预定系统',
                address: this.configService.get("email.name")
            },
            to,
            subject,
            html
        });
    }

}