"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cart, Menu, Close } from "@/utils/icons";
import { useDevice } from "@/hooks/useDevice";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const pathname = usePathname();
  const device = useDevice();
  const [open, setOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/Cali_Logo_White.png");

  // refs
  const menuRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  const links = [
    { name: "House", href: "/" },
    { name: "Products", href: "#" },
    { name: "Franchise", href: "#" },
    { name: "Wholesale", href: "#" },
    { name: "Gallery", href: "/gallery" },
  ];

  // GSAP mobile menu animation
  useEffect(() => {
    if (open && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        linksRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          delay: 0.2,
          duration: 0.5,
          ease: "power3.out",
        }
      );
    } else if (!open && menuRef.current) {
      gsap.to(menuRef.current, { x: "100%", duration: 0.5, ease: "power3.in" });
    }
  }, [open]);

  // ✅ Scroll-trigger for home page only
  useEffect(() => {
    if (pathname === "/") {
      // home page — scroll color animation
      if (navbarRef.current) {
        ScrollTrigger.create({
          trigger: "body",
          start: "top top",
          end: 200,
          onUpdate: (self) => {
            const color = self.progress > 0.05 ? "#000" : "#fff";
            gsap.to(linksRef.current, { color, duration: 0.2 });
            setLogoSrc(
              self.progress > 0.05 ? "/Cali_Logo.png" : "/Cali_Logo_White.png"
            );
            if (cartRef.current)
              gsap.to(cartRef.current, { color, duration: 0.2 });
            if (menuBtnRef.current)
              gsap.to(menuBtnRef.current, { color, duration: 0.2 });
          },
        });
      }
    } else {
      // all other pages — solid black navbar
      setLogoSrc("/Cali_Logo.png");

      // immediately set all nav elements to black
      gsap.set([linksRef.current, cartRef.current, menuBtnRef.current], {
        color: "#000",
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  return (
    <div
      ref={navbarRef}
      className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between py-4 lg:py-6 px-6 lg:px-14 overflow-hidden `}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src={logoSrc}
          alt="CaliLabz Logo"
          width={100}
          height={100}
          priority
        />
      </Link>

      {/* Desktop Menu */}
      {device !== "mobile" && device !== "tablet" && (
        <div className="flex items-center space-x-6">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              ref={(el) => {
                linksRef.current[idx] = el;
              }}
              className={`uppercase rounded-full transition-all duration-300 text-sm font-medium ${
                pathname === "/" ? "text-white" : "text-black"
              } ${
                pathname === link.href
                  ? "bg-white/50 px-6 py-2 !text-black"
                  : "px-6 py-2"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

      {/* Cart & Mobile Toggle */}
      <div className="flex items-center space-x-4">
        <div ref={cartRef} className="hover:scale-110 transition text-white">
          <Link href="/cart">
            <Cart size={28} />
          </Link>
        </div>

        {device === "mobile" ||
          (device == "tablet" && (
            <button
              ref={menuBtnRef}
              onClick={() => setOpen(!open)}
              className={`z-50 ${
                pathname === "/" ? "text-white" : " text-black"
              } `}
            >
              {open ? <Close size={30} /> : <Menu size={30} />}
            </button>
          ))}
      </div>

      {/* Mobile Menu */}
      {device === "mobile" ||
        (device == "tablet" && (
          <div
            ref={menuRef}
            className="fixed top-0 right-0 h-screen w-3/4 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center space-y-6 translate-x-full z-40"
          >
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                ref={(el) => {
                  linksRef.current[idx] = el;
                }}
                className={`uppercase text-lg ${
                  pathname === link.href
                    ? "text-sky-400 font-semibold"
                    : "text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Navbar;
