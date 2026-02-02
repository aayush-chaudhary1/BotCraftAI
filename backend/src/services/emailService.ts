// Email service: SendGrid (recommended) and nodemailer SMTP fallback

import { config } from '../config/env';
import { logger } from '../utils/logger';

export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

async function sendWithSendGrid(options: EmailOptions): Promise<boolean> {
  if (!config.email.apiKey) {
    logger.warn('SendGrid EMAIL_API_KEY not set; skipping send');
    return false;
  }
  try {
    const sgMail = await import('@sendgrid/mail');
    sgMail.default.setApiKey(config.email.apiKey);
    await sgMail.default.send({
      to: options.to,
      from: config.email.from,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    logger.info('Email sent via SendGrid to', options.to);
    return true;
  } catch (err) {
    logger.error('SendGrid error', err);
    return false;
  }
}

async function sendWithNodemailer(options: EmailOptions): Promise<boolean> {
  try {
    const nodemailer = await import('nodemailer');
    const transport = nodemailer.default.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.port === 465,
      auth:
        config.email.smtp.user && config.email.smtp.pass
          ? { user: config.email.smtp.user, pass: config.email.smtp.pass }
          : undefined,
    });
    await transport.sendMail({
      from: config.email.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    logger.info('Email sent via SMTP to', options.to);
    return true;
  } catch (err) {
    logger.error('Nodemailer error', err);
    return false;
  }
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (config.email.provider === 'sendgrid') {
    return sendWithSendGrid(options);
  }
  return sendWithNodemailer(options);
}

// Transactional templates
export function getVerificationEmailHtml(link: string, name?: string): string {
  const greeting = name ? `Hi ${name},` : 'Hi,';
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify your email</h2>
      <p>${greeting}</p>
      <p>Please verify your email by clicking the link below. This link expires in 24 hours.</p>
      <p><a href="${link}" style="color: #3B82F6;">Verify email</a></p>
      <p>If you didn't create an account, you can ignore this email.</p>
      <p>— BotCraft AI</p>
    </body>
    </html>
  `;
}

export function getPasswordResetEmailHtml(link: string, name?: string): string {
  const greeting = name ? `Hi ${name},` : 'Hi,';
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset your password</h2>
      <p>${greeting}</p>
      <p>We received a request to reset your password. Click the link below to set a new password. This link expires in 1 hour.</p>
      <p><a href="${link}" style="color: #3B82F6;">Reset password</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
      <p>— BotCraft AI</p>
    </body>
    </html>
  `;
}

export function getWelcomeEmailHtml(name?: string): string {
  const greeting = name ? `Hi ${name},` : 'Hi,';
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to BotCraft AI</h2>
      <p>${greeting}</p>
      <p>Your email is verified. You can now log in and start building chatbots.</p>
      <p>— BotCraft AI</p>
    </body>
    </html>
  `;
}
