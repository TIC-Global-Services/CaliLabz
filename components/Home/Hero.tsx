"use client";
import React, { useEffect, useRef } from "react";
import SkyBackdrop from "@/assets/Home/SkyBackdrop.jpg";
import BackdropBuildings from "@/assets/Home/BackdropBuildings.png";
import MobileBackdropBuildings from "@/assets/Home/MobileBackdropBuildings.png";
import Image from "next/image";
import { useDevice } from "@/hooks/useDevice";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoModel from "./LogoModel";
import Smoke from "@/assets/Home/Smoke.png";
import SmokeCanvas from "../Reusable/Smoke";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const device = useDevice();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const skyRef = useRef<HTMLImageElement | null>(null);
  const buildingsRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const ModelRef = useRef<HTMLDivElement | null>(null);
  const smokeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;

      gsap.to(skyRef.current, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.to(buildingsRef.current, {
        x: x * 1.2,
        y: y * 1.2,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.to(textRef.current, {
        x: x * -0.6,
        y: y * -0.6,
        duration: 1.2,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMove);

    if (heroRef.current && buildingsRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom+=200 top",
          pin: true,
          scrub: true,
        },
      });

      // Fade overlay, sky, and bring video in
      tl.to(overlayRef.current, { opacity: 0.1, duration: 1 }, 0);
      tl.to(skyRef.current, { opacity: 0, duration: 1 }, 0);
      tl.to(textRef.current, { color: "#000", duration: 1 }, 0.2);
      tl.fromTo(
        descRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
        0.4
      );
      tl.fromTo(
        ModelRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1 },
        0.4
      );

      // Smoke effect animation
      tl.fromTo(
        smokeRef.current,
        { opacity: 0, y: 100 },
        { opacity: 0.8, y: -50, duration: 1.5 },
        0.3
      );

      tl.to(buildingsRef.current, { zIndex: 10, duration: 0 }, 0.1);

      // ⚡️ Bring Text + Model to Front After Scroll
      tl.to(
        [textRef.current, ModelRef.current],
        { zIndex: 40, duration: 0 },
        0.6
      );
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] overflow-hidden saturate-180"
    >
      {/* Sky Background */}
      <Image
        src={SkyBackdrop}
        alt="Sky Backdrop"
        fill
        priority
        ref={skyRef}
        className="object-cover object-center will-change-transform"
      />

      {/* Buildings Layer */}
      <Image
        src={device === "mobile" ? MobileBackdropBuildings : BackdropBuildings}
        alt="Buildings"
        priority
        ref={buildingsRef}
        className="absolute bottom-0 md:-bottom-20 left-0 w-full h-auto z-30 will-change-transform"
      />

      {/* White Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black opacity-0 z-20 will-change-opacity"
      />

      {/* Smoke Effect */}
      <div
        ref={smokeRef}
        className=" absolute inset-0 z-20 w-full h-full"
      >
        <SmokeCanvas />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-6 h-screen">
        <div className="absolute top-[15%] will-change-transform z-30">
          <h1
            ref={textRef}
            className="font-kento text-5xl md:text-9xl text-white tracking-wide"
          >
            Cali Labz
          </h1>

          <p
            ref={descRef}
            className="text-xs md:text-base max-w-4xl mx-auto text-black opacity-0 will-change-transform px-5"
          >
            Cali Labz brings the Californian cannabis experience to Europe. We
            offer consumers premium cannabis products and entrepreneurs the
            chance to run modern dispensaries in Spain. With quality and trust
            at our core, we serve both private customers and business partners.
          </p>

          <div ref={ModelRef} className=" z-40">
            <LogoModel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
