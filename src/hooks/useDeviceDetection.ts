import { useEffect, useState } from 'react';

export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
  DESKTOP = 'desktop',
  TABLET = 'tablet',
}

interface DeviceInfo {
  type: DeviceType;
  isAndroid: boolean;
  isIOS: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isWebKit: boolean;
  isMobile: boolean;
  userAgent: string;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: DeviceType.DESKTOP,
    isAndroid: false,
    isIOS: false,
    isDesktop: true,
    isTablet: false,
    isWebKit: false,
    isMobile: false,
    userAgent: '',
  });

  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
    const isWebKit = /webkit/i.test(userAgent);

    let type = DeviceType.DESKTOP;
    if (isAndroid) {
      type = isTablet ? DeviceType.TABLET : DeviceType.ANDROID;
    } else if (isIOS) {
      type = isTablet ? DeviceType.TABLET : DeviceType.IOS;
    }

    const isMobile =
      type === DeviceType.ANDROID ||
      type === DeviceType.IOS ||
      (typeof window !== 'undefined' && window.innerWidth < 768);

    setDeviceInfo({
      type,
      isAndroid: type === DeviceType.ANDROID,
      isIOS: type === DeviceType.IOS,
      isDesktop: type === DeviceType.DESKTOP,
      isTablet: type === DeviceType.TABLET,
      isWebKit,
      isMobile,
      userAgent,
    });
  }, []);

  return deviceInfo;
}
