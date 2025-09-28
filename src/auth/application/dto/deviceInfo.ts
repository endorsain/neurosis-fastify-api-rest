export interface DeviceInfoDTO {
  ip_address: string;
  user_agent: string;
  device_type: "mobile" | "tablet" | "desktop" | "unknown";
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
}
