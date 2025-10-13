"use client";

import React, { useEffect, useRef, useState } from "react";
import BackgroundCanabis from "@/assets/Gallery/BackgroundCanabis.png";
import MainBanner from "@/assets/Gallery/BannerMain.png";
import Image from "next/image";
import Canabis from "@/assets/Gallery/Canabis.svg";
import { FaCirclePlay as Play } from "react-icons/fa6";
import gsap from "gsap";

const OurStory = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const canabisRefs = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Wait for images to load
  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  useEffect(() => {
    if (!imagesLoaded) return; // Only animate after images are loaded

    const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.5 } });

    // Animate container fade in
    tl.from(containerRef.current, { opacity: 0, duration: 0.3 });

    // Heading animation
    tl.from(headingRef.current, { y: 30, opacity: 0 });

    // Banner image scale animation
    tl.from(bannerRef.current, { scale: 0.9, opacity: 0 }, "-=0.3");

    // Overlay "Coming Soon" animation
    tl.from(overlayRef.current, { opacity: 0, y: -10 }, "-=0.4");

    // Canabis decorative images pop-in
    canabisRefs.current.forEach((img, i) => {
      tl.from(img, { scale: 0, rotation: i % 2 === 0 ? 0 : 180, opacity: 0 }, "-=0.45");
    });

    // Paragraph fade in
    tl.from(textRef.current, { opacity: 0, y: 20 }, "-=0.4");
  }, [imagesLoaded]);

  return (
    <div className="w-full min-h-screen overflow-hidden">
      <div className="relative flex flex-col items-center justify-center py-[20%] lg:py-[10%]">
        <div className="absolute w-full h-full bg-cover bg-center bg-no-repeat">
          <Image
            src={BackgroundCanabis}
            alt="Canabis"
            fill
            className="object-cover w-full h-full"
            onLoad={handleImageLoad} // Trigger animation when background loads
          />
          <div className="absolute inset-0 bg-white/80"></div>
        </div>

        <div className="z-10 relative text-center space-y-8 w-full" ref={containerRef}>
          <h1
            className="font-kento text-3xl lg:text-5xl text-gray-900"
            ref={headingRef}
          >
            Our story in motion
          </h1>

          <div className="relative w-[90%] mx-auto" ref={bannerRef}>
            <div className="relative z-10">
              <Image
                src={MainBanner}
                alt="MainBanner"
                width={600}
                height={400}
                className="aspect-[9/16] lg:aspect-[16/5] mx-auto object-cover w-full"
                onLoad={handleImageLoad} // Trigger animation when banner loads
              />

              <div
                className="absolute inset-0 bg-white/30 flex flex-col items-center justify-center text-white w-full"
                ref={overlayRef}
              >
                <div className="flex items-center space-x-3">
                  <Play size={50} className="text-white animate-pulse" />
                  <p className="font-kento text-3xl lg:text-4xl tracking-wide">
                    Coming Soon
                  </p>
                </div>
              </div>
            </div>

            <Image
              src={Canabis}
              alt="Canabis"
              width={150}
              height={150}
              className="absolute -right-10 -top-10 lg:-right-20 lg:-top-20 z-0 w-20 h-20 lg:w-40 lg:h-40"
              ref={(el) => {
                if (el && !canabisRefs.current.includes(el)) canabisRefs.current.push(el);
              }}
              onLoad={handleImageLoad}
            />
            <Image
              src={Canabis}
              alt="Canabis"
              width={150}
              height={150}
              className="absolute -left-10 -bottom-10 lg:-left-22 lg:-bottom-22 z-0 -rotate-180 w-20 h-20 lg:w-40 lg:h-40"
              ref={(el) => {
                if (el && !canabisRefs.current.includes(el)) canabisRefs.current.push(el);
              }}
              onLoad={handleImageLoad}
            />
          </div>

          <p
            className="text-base md:text-lg max-w-4xl mx-auto text-black will-change-transform px-8"
            ref={textRef}
          >
            Exciting videos showcasing our products, experiences, and community
            are on the way! Stay tuned as we prepare to bring the Cali Labz
            experience to life through engaging visuals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
