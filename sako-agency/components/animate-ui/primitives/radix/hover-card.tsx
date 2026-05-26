"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import React from "react";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardPortal = HoverCardPrimitive.Portal;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={`z-50 rounded-xl border border-[var(--gold-border)] bg-[var(--black-2)] p-4 shadow-xl shadow-black/50 outline-none backdrop-blur-md ${className}`}
    style={{ animation: "fade-in 0.2s ease-out", color: "var(--cream)" }}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardPortal, HoverCardContent };
