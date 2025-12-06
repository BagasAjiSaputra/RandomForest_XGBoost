"use client";

import { React, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 flex justify-end">
      <div className="flex gap-8">
        <Link href={"/"} className="backdrop-blur-md group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)]">Random Forest</Link>
        <Link href={"/xgboost"} className="backdrop-blur-md group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)]">XGBoost</Link>
      </div>
    </header>
  );
}