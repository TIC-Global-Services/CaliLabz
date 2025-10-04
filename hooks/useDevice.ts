"use client";
import { useEffect, useState } from "react";

type DeviceType = "mobile" | "tablet" | "desktop";

export function useDevice(): DeviceType {
  const [device, setDevice] = useState<DeviceType>("desktop");

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setDevice("mobile");
      } else if (width >= 768 && width < 1024) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    checkDevice(); // run on mount
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return device;
}
