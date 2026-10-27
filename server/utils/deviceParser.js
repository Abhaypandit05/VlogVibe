// Parse client IP address, Operating System, Browser, and Device category from HTTP request
export const parseClientInfo = (req) => {
  // Extract IP
  let ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1 (Localhost)';
  }

  const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';

  // Detect Operating System
  let os = 'Unknown OS';
  if (/windows nt 10.0/i.test(userAgent)) os = 'Windows 10/11';
  else if (/windows nt 6.3/i.test(userAgent)) os = 'Windows 8.1';
  else if (/windows nt 6.1/i.test(userAgent)) os = 'Windows 7';
  else if (/windows/i.test(userAgent)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
  else if (/android/i.test(userAgent)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
  else if (/linux/i.test(userAgent)) os = 'Linux';

  // Detect Browser
  let browser = 'Unknown Browser';
  if (/edg\//i.test(userAgent)) browser = 'Microsoft Edge';
  else if (/opr\/|opera/i.test(userAgent)) browser = 'Opera';
  else if (/chrome|crios/i.test(userAgent)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(userAgent)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Apple Safari';

  // Detect Device Category
  let device = 'Desktop';
  if (/mobile/i.test(userAgent) && !/ipad|tablet/i.test(userAgent)) {
    device = 'Mobile Phone';
  } else if (/ipad|tablet/i.test(userAgent)) {
    device = 'Tablet';
  }

  return {
    ip,
    userAgent,
    os,
    browser,
    device,
  };
};
