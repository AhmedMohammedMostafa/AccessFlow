import nodemailer from 'nodemailer';
import { formatText } from '../utils/email/formatText';

/**
 * Class representing an email transporter.
 */
export default class Email {
    /**
     * Create an email transporter.
     * @param {Object} accessflowOptions - The AccessFlow options.
     * @param {Object} options - The nodemailer transport options.
     */
    constructor(accessflowOptions , options) {
      this.transporter = nodemailer.createTransport(options);
        this.accessflowOptions = accessflowOptions;
    }

    /**
     * Send a verification email.
     * @async
     * @param {string} email - The email address to send the verification email to.
     * @param {string} code - The verification code.
     * @param {Object} options - The email options.
     * @param {Object} options.formattedVariables - The formatted variables to use in the email.
     * @returns {Promise<string>} A promise that resolves with a success message.
     * @throws {Error} Throws an error if verifyEmail is not enabled in accessflowOptions.
     */
    async sendVerifyEmail(email, code, options) {
        if (!this.accessflowOptions.verifyEmail || !this.accessflowOptions.verifyEmail.email) {
            throw new Error('verifyEmail is not enabled, please set verifyEmail in your accessflowOptions');
        }

        const formattedObject = options.formattedVariables || {};
        const text = formatText(this.accessflowOptions.verifyEmail.text, {
            ...formattedObject,
            code: code,
            email: email || 'support@accessflow.ahmeddvlpr.me',
            appName: this.accessflowOptions.appName || 'AccessFlow'
        });

        const mailOptions = {
            from: this.accessflowOptions.verifyEmail.from,
            to: email,
            subject: this.accessflowOptions.verifyEmail.subject || 'Verify your email',
            text: text,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully #- ' + email);
            return 'Email sent successfully #- ' + email;
        } catch (error) {
            console.log(error);
            throw new Error('Error sending email');
        }
    }

    async sendNoReplyEmail(email, message, options) {
        if (!this.accessflowOptions.noReplyEmail || !this.accessflowOptions.noReplyEmail.email) {
            throw new Error('noReplyEmail is not enabled, please set noReplyEmail in your accessflowOptions');
        }

        const formattedObject = options.formattedVariables || {};
        const text = formatText(this.accessflowOptions.noReplyEmail.text, {
            ...formattedObject,
            email: email || 'support@accessflow.ahmeddvlpr.me',
            appName: this.accessflowOptions.appName || 'AccessFlow'
        });

        const mailOptions = {
            from: this.accessflowOptions.noReplyEmail.from,
            to: email,
            subject: this.accessflowOptions.noReplyEmail.subject || 'No Reply ' + (this.accessflowOptions.appName || ''),
            text: text,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully to ' + email);
            return 'Email sent successfully to ' + email;
        } catch (error) {
            console.log(error);
            throw new Error('Error sending email');
        }
    }
}
