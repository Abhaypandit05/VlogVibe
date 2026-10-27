import nodemailer from 'nodemailer';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'abhaypandit200455@gmail.com';

export const getTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  // If real SMTP credentials are provided, use real SMTP transporter
  if (user && pass) {
    const isSecure = port === 465;
    return nodemailer.createTransport({
      host: host || 'smtp.gmail.com',
      port,
      secure: isSecure,
      auth: {
        user,
        pass,
      },
    });
  }

  // Fallback dev transporter: logs simulated emails cleanly to console without failing
  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

export const EMAIL_FROM =
  process.env.EMAIL_FROM || '"VibeVlog Security" <notifications@vibevlog.dev>';
