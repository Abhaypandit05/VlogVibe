// Registration Admin Notification Template
export const getRegistrationEmail = ({ name, username, email, userId, time }) => {
  const formattedTime = time || new Date().toUTCString();

  const text = `New user registered on VibeVlog.

User Details
----------------------------
Name: ${name}
Username: ${username}
Email: ${email}
Registration Time: ${formattedTime}
Account ID: ${userId}
----------------------------
VibeVlog Admin Notification (No passwords or credentials are ever transmitted)`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New VibeVlog User Registration</title>
</head>
<body style="margin: 0; padding: 0; background-color: #08090D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F5F7FA;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #08090D; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" max-width="580" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #141720; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 30px 40px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: linear-gradient(135deg, #0F1117 0%, #141720 100%);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; background: linear-gradient(135deg, #7C8CFF, #A78BFA); border-radius: 8px; color: #ffffff; font-weight: bold; font-size: 14px; vertical-align: middle; margin-right: 8px;">✦</span>
                    <span style="font-size: 20px; font-weight: 700; color: #F5F7FA; vertical-align: middle; letter-spacing: -0.5px;">VibeVlog</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background-color: rgba(124, 140, 255, 0.15); border: 1px solid rgba(124, 140, 255, 0.3); border-radius: 20px; color: #7C8CFF; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Admin Alert</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title Banner -->
          <tr>
            <td style="padding: 30px 40px 10px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #F5F7FA; letter-spacing: -0.5px;">New User Registration</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">A new author account has just been created on the VibeVlog platform.</p>
            </td>
          </tr>

          <!-- Details Card -->
          <tr>
            <td style="padding: 20px 40px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0F1117; border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.05); padding: 18px 24px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    <span style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Full Name</span>
                    <span style="font-size: 15px; font-weight: 600; color: #F5F7FA; display: block; margin-top: 2px;">${name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    <span style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Username</span>
                    <span style="font-size: 15px; font-weight: 600; color: #7C8CFF; font-family: monospace; display: block; margin-top: 2px;">@${username}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    <span style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Email Address</span>
                    <span style="font-size: 15px; color: #F5F7FA; display: block; margin-top: 2px;">${email}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    <span style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Registration Time</span>
                    <span style="font-size: 14px; color: #9CA3AF; display: block; margin-top: 2px;">${formattedTime}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Account ID</span>
                    <span style="font-size: 13px; color: #A78BFA; font-family: monospace; display: block; margin-top: 2px;">${userId}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Footnote -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(124, 140, 255, 0.05); border: 1px solid rgba(124, 140, 255, 0.15); border-radius: 12px; padding: 12px 18px;">
                <tr>
                  <td>
                    <span style="font-size: 12px; color: #9CA3AF; line-height: 1.4; display: block;">
                      🔒 <strong>Security Policy:</strong> Passwords and credentials are never transmitted via email and remain securely hashed using bcrypt in your database persistence layer.
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #0F1117; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6B7280;">
                VibeVlog Admin Notification System • Confidential
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return {
    subject: 'New VibeVlog User Registration',
    text,
    html,
  };
};
