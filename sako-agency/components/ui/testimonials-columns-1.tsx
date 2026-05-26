"use client";
import React from "react";
import { motion } from "motion/react";

export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-10 rounded-3xl border border-[#f1f1f1] shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] max-w-xs w-full bg-white transition-all duration-300 hover:shadow-[0_10px_40px_0_rgba(100,100,111,0.3)]" 
                  key={`${index}-${i}`}
                >
                  <div className="text-black leading-relaxed font-normal">{text}</div>
                  <div className="flex items-center gap-3 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover border border-gray-100"
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold tracking-tight leading-5 text-black">{name}</div>
                      <div className="leading-5 text-black/60 tracking-tight text-sm font-medium">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
