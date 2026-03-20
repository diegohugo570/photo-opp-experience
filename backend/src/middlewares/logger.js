const Log = require('../models/Log');

const maskIp = (ip) => {
  if (!ip) return 'unknown';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.*.*`;
  }
  return ip; // Handle IPv6 or other formats
};

const requestLogger = (req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    res.send = originalSend;
    
    // Save log after sending response
    const logData = {
      masked_ip: maskIp(req.ip || req.connection.remoteAddress),
      route: req.originalUrl,
      request_body: req.originalUrl.includes('/auth') ? { ...req.body, password: '[REDACTED]' } : req.body,
      response_status: res.statusCode
    };
    
    Log.create(logData).catch(err => console.error('Logging failed:', err));
    
    return res.send(body);
  };
  next();
};

const logEvent = async (ip, route, body, status) => {
  try {
    await Log.create({
      masked_ip: maskIp(ip),
      route,
      request_body: body,
      response_status: status
    });
  } catch (error) {
    console.error('Failed to log event', error);
  }
};

module.exports = { requestLogger, logEvent, maskIp };
