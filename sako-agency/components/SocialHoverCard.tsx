"use client";
import React, { ReactNode } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardContent,
} from "@/components/animate-ui/primitives/radix/hover-card";

interface SocialHoverCardProps {
  children: ReactNode;
  platform: string;
  username: string;
  description: string;
  followers: string;
  following: string;
  posts?: string;
  postsLabel?: string;
  bannerGradient?: string;
  avatarGradient?: string;
  initials?: string;
  followLabel?: string;
}

export const SocialHoverCard = ({
  children,
  platform,
  username,
  description,
  followers,
  following,
  posts,
  postsLabel = "Posts",
  bannerGradient = "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
  avatarGradient = "linear-gradient(135deg, #6366f1, #8b5cf6)",
  initials = "JD",
  followLabel = "Follow",
}: SocialHoverCardProps) => {
  return (
    <HoverCard openDelay={150} closeDelay={80}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent
          side="top"
          sideOffset={14}
          align="center"
          className="w-[300px] z-50 p-0 overflow-hidden rounded-[20px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            /* Animate-UI handles the entry — ensure your HoverCardContent
               forwards these custom data-state classes: */
            // data-[state=open]: animate-in + fade-in + zoom-in-95 + slide-in-from-bottom-2
            // data-[state=closed]: animate-out + fade-out + zoom-out-95
          }}
        >
          {/* Banner */}
          <div
            className="h-[72px] relative overflow-hidden"
            style={{ background: bannerGradient }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* Body */}
          <div className="px-5 pb-5">
            {/* Avatar + Follow row */}
            <div className="flex justify-between items-end -mt-7 mb-3.5">
              <div
                className="w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                style={{
                  borderColor: "#0a0a0a",
                  background: avatarGradient,
                }}
              >
                {initials}
              </div>
              <button
                className="px-[18px] py-[7px] rounded-full text-white text-[12px] font-semibold tracking-wide transition-all duration-200 hover:bg-white hover:text-black"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "transparent",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {followLabel}
              </button>
            </div>

            {/* Name & handle */}
            <p className="text-white font-semibold text-base leading-tight mb-1">
              {platform}
            </p>
            <p className="text-[13px] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
              {username}
            </p>

            {/* Bio */}
            <p
              className="text-[13px] leading-relaxed mb-4"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {description}
            </p>

            {/* Stats */}
            <div
              className="flex gap-5 pt-3.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <span className="block text-white font-semibold text-base leading-none mb-1">
                  {following}
                </span>
                <span
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Following
                </span>
              </div>
              <div>
                <span className="block text-white font-semibold text-base leading-none mb-1">
                  {followers}
                </span>
                <span
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Followers
                </span>
              </div>
              {posts && (
                <div>
                  <span className="block text-white font-semibold text-base leading-none mb-1">
                    {posts}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {postsLabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  );
};