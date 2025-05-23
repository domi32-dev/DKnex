"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LampContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(  
        "relative flex flex-col items-center justify-center overflow-hidden w-full rounded-t-3xl z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: "30rem" }}
          whileInView={{ opacity: 1, width: "60rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-[22rem] overflow-visible w-[60rem] bg-gradient-conic from-cyan-400 via-blue-400 to-violet-400 dark:from-cyan-500 dark:via-blue-700 dark:to-indigo-800 text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-transparent dark:bg-[#23263a] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-transparent dark:bg-[#23263a]  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "30rem" }}
          whileInView={{ opacity: 1, width: "60rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-[22rem] w-[60rem] bg-gradient-conic from-transparent via-transparent to-cyan-400 dark:to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-transparent dark:bg-[#23263a]  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-transparent dark:bg-[#23263a] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-72 w-full translate-y-12 scale-x-150 bg-transparent dark:bg-[#23263a] blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-72 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-56 w-[56rem] -translate-y-1/2 rounded-full bg-cyan-400 opacity-40 blur-3xl"></div>
        <motion.div
          initial={{ width: "16rem" }}
          whileInView={{ width: "32rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-56 w-[32rem] -translate-y-[6rem] rounded-full bg-cyan-300 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "30rem" }}
          whileInView={{ width: "60rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-1 w-[60rem] -translate-y-[7rem] bg-cyan-300 "
        ></motion.div>
        <div className="absolute inset-auto z-40 h-64 w-full -translate-y-[12.5rem] bg-transparent dark:bg-[#23263a] "></div>
      </div>
      <div className="relative z-50 flex flex-col items-center px-5 w-full">
        {children}
      </div>
    </div>
  );
} 