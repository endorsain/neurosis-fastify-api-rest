import { FastifyReply, FastifyRequest } from "fastify";
import { DeviceInfoDTO } from "../../auth/application/dto/deviceInfo";

declare module "fastify" {
  interface FastifyRequest {
    deviceInfo: DeviceInfoDTO;
  }
}

export async function addDeviceInfoMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.log(`addDeviceInfoMidd: ${request.method} ${request.url}`);

  try {
    const ipAddress = extractIPAddress(request);
    const userAgent = request.headers["user-agent"] || "unknown";

    const deviceData = parseUserAgent(userAgent);

    const deviceInfo: DeviceInfoDTO = {
      user_agent: userAgent,
      ip_address: ipAddress,
      device_type: deviceData.deviceType,
      browser: deviceData.browser,
      os: deviceData.os,
    };

    request.deviceInfo = deviceInfo;
  } catch (error) {
    console.error("deviceContextMidd: ", error);

    request.deviceInfo = {
      user_agent: "unknown",
      ip_address: "unknown",
      device_type: "unknown",
      browser: {
        name: "unknown",
        version: "unknown",
      },
      os: {
        name: "unknown",
        version: "unknown",
      },
    };
  }
}

function extractIPAddress(request: FastifyRequest): string {
  // Obtener IP real considerando proxies y load balancers
  const forwarded = request.headers["x-forwarded-for"] as string;
  const realIp = request.headers["x-real-ip"] as string;
  const remoteAddress = request.ip;

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return remoteAddress || "unknown";
}

function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();

  // ✅ Detectar tipo de dispositivo
  let deviceType: "mobile" | "tablet" | "desktop" | "unknown" = "unknown";
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    deviceType = "mobile";
  } else if (/tablet|ipad|kindle|silk/i.test(ua)) {
    deviceType = "tablet";
  } else if (/windows|mac|linux|x11/i.test(ua)) {
    deviceType = "desktop";
  }

  // ✅ Detectar navegador
  let browser = {
    name: "unknown",
    version: "unknown",
  };

  if (ua.includes("chrome") && !ua.includes("edg")) {
    const match = ua.match(/chrome\/([0-9.]+)/);
    browser = {
      name: "Chrome",
      version: match ? match[1] : "unknown",
    };
  } else if (ua.includes("firefox")) {
    const match = ua.match(/firefox\/([0-9.]+)/);
    browser = {
      name: "Firefox",
      version: match ? match[1] : "unknown",
    };
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    const match = ua.match(/version\/([0-9.]+)/);
    browser = {
      name: "Safari",
      version: match ? match[1] : "unknown",
    };
  } else if (ua.includes("edg")) {
    const match = ua.match(/edg\/([0-9.]+)/);
    browser = {
      name: "Edge",
      version: match ? match[1] : "unknown",
    };
  }

  // ✅ Detectar sistema operativo
  let os = {
    name: "unknown",
    version: "unknown",
  };

  if (ua.includes("windows")) {
    os.name = "Windows";
    if (ua.includes("windows nt 10.0")) os.version = "10/11";
    else if (ua.includes("windows nt 6.3")) os.version = "8.1";
    else if (ua.includes("windows nt 6.2")) os.version = "8";
    else if (ua.includes("windows nt 6.1")) os.version = "7";
  } else if (ua.includes("mac os")) {
    os.name = "macOS";
    const match = ua.match(/mac os x ([0-9_]+)/);
    os.version = match ? match[1].replace(/_/g, ".") : "unknown";
  } else if (ua.includes("android")) {
    os.name = "Android";
    const match = ua.match(/android ([0-9.]+)/);
    os.version = match ? match[1] : "unknown";
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    os.name = "iOS";
    const match = ua.match(/os ([0-9_]+)/);
    os.version = match ? match[1].replace(/_/g, ".") : "unknown";
  } else if (ua.includes("linux")) {
    os.name = "Linux";
  }

  return {
    deviceType,
    browser,
    os,
  };
}
