import { getTransporter, ADMIN_EMAIL, EMAIL_FROM } from '../config/email.js';
import { getRegistrationEmail } from '../templates/registrationEmail.js';
import { getLoginEmail } from '../templates/loginEmail.js';
import { parseClientInfo } from '../utils/deviceParser.js';

// Audit event logger (never logs passwords or tokens)
const logAuditEvent = ({ eventType, userId, username, emailStatus, error = null }) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    eventType,
    userId: userId?.toString() || 'unknown',
    username: username || 'unknown',
    recipient: ADMIN_EMAIL,
    emailStatus,
    ...(error ? { error: error.message } : {}),
  };

  console.log(`[AUDIT EMAIL EVENT] ${JSON.stringify(logEntry)}`);
};

// Send notification when a new user registers
export const sendAdminRegistrationNotification = async (user) => {
  try {
    const transporter = getTransporter();

    const { subject, text, html } = getRegistrationEmail({
      name: user.name,
      username: user.username,
      email: user.email,
      userId: user._id,
      time: new Date().toUTCString(),
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    logAuditEvent({
      eventType: 'USER_REGISTRATION',
      userId: user._id,
      username: user.username,
      emailStatus: 'SENT',
    });

    // In dev / JSON transport mode, log delivery confirmation
    if (info && info.message) {
      console.log(`[Admin Email Dispatched] Subject: "${subject}" to <${ADMIN_EMAIL}>`);
    }

    return { success: true };
  } catch (error) {
    console.error(`[Admin Email Error] Failed to send registration notification: ${error.message}`);
    logAuditEvent({
      eventType: 'USER_REGISTRATION',
      userId: user?._id,
      username: user?.username,
      emailStatus: 'FAILED',
      error,
    });
    // Return gracefully so user registration is never aborted
    return { success: false, error: error.message };
  }
};

// Send notification when a user successfully logs in
export const sendAdminLoginNotification = async (user, req) => {
  try {
    const transporter = getTransporter();
    const clientInfo = parseClientInfo(req);

    const { subject, text, html } = getLoginEmail({
      name: user.name,
      username: user.username,
      email: user.email,
      time: new Date().toUTCString(),
      ip: clientInfo.ip,
      device: clientInfo.device,
      browser: clientInfo.browser,
      os: clientInfo.os,
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    logAuditEvent({
      eventType: 'USER_LOGIN_SUCCESS',
      userId: user._id,
      username: user.username,
      emailStatus: 'SENT',
    });

    if (info && info.message) {
      console.log(`[Admin Email Dispatched] Subject: "${subject}" to <${ADMIN_EMAIL}>`);
    }

    return { success: true };
  } catch (error) {
    console.error(`[Admin Email Error] Failed to send login notification: ${error.message}`);
    logAuditEvent({
      eventType: 'USER_LOGIN_SUCCESS',
      userId: user?._id,
      username: user?.username,
      emailStatus: 'FAILED',
      error,
    });
    // Return gracefully so user login is never aborted
    return { success: false, error: error.message };
  }
};
