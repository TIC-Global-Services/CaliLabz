"use client";
import { Mail, Phone } from "@/utils/icons";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="!bg-black text-white">
      {/* Top Section */}
      <div className=" mx-auto px-6 md:px-14 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10">
        {/* Center Logo (First on mobile) */}
        <div className="flex flex-col md:items-center md:justify-center text-start md:text-center order-1 md:order-2">
          <h1 className="font-kento text-5xl text-[#1A4436] tracking-wide">
            Cali Labz
          </h1>
          {/* <p className="text-sm mt-2 text-white/60 max-w-xs">
            Science meets nature – crafted for calm, clarity, and creativity.
          </p> */}
        </div>

        {/* Contact (Second on mobile, first on desktop) */}
        <div className="space-y-4 order-2 md:order-1">
          <h1 className="text-lg font-semibold uppercase  text-white/70">
            Contact Us
          </h1>
          <Link href={'mailto:info@calilabz.com'} className="flex items-center space-x-3 text-white/80 hover:text-white transition uppercase">
            <Mail size={20} />
            <span>info@calilabz.com</span>
          </Link>
          <Link href={'tel:+31 613100968'} className="flex items-center space-x-3 text-white/80 hover:text-white transition">
            <Phone size={20} />
            <span>+31 6 13 10 09 68</span>
          </Link>
        </div>

        {/* Legals (Third on mobile, last on desktop) */}
        <div className="space-y-4 md:text-right order-3 md:order-3">
          <h1 className="text-lg font-semibold uppercase text-white/70">
            Legals
          </h1>
          <div className="flex flex-col space-y-2 uppercase">
            <Link
              href="#"
              className="text-white/80 hover:text-white transition-all duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-white/80 hover:text-white transition-all duration-300"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="py-6 text-center text-sm text-white/60 uppercase">
        © {new Date().getFullYear()} Cali Labz. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
