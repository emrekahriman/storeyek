import React from "react";
import iPhoneImg from "@/public/assets/images/iPhone.png";
import Button from "./Button";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";

function Landing() {
  return (
    // Videoda section icin h-sreen kullanmis: https://youtu.be/DCTuw2P6DCU?t=4728
    <section className="sticky top-0 mx-auto flex h-full-nav max-w-[1350px] items-center justify-between px-8">
      <div className="space-y-8">
        <h1 className="space-y-3 text-5xl font-semibold tracking-wide lg:text-6xl xl:text-7xl">
          <span className="block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Powered
          </span>
          <span className="block">By Intellect</span>
          <span className="block">Driven By Values</span>
        </h1>
        <div className="space-x-8">
          <Button
            title="Buy Now"
            onClick={() => {
              Router.push("/products");
            }}
          />
          <Link href={"/about"} className="link">
            Learn More
          </Link>
        </div>
      </div>

      <div className="relative hidden h-[450px] w-[450px] transition-all duration-500 md:inline lg:h-[650px] lg:w-[600px]">
        <Image
          priority
          src={iPhoneImg}
          alt="iPhone"
          className="w-full h-full object-contain"
        />
      </div>
    </section>
  );
}

export default Landing;
