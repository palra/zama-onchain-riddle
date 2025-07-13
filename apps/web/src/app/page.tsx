"use client";

import { ActivityFeed } from "@/components/activity-feed/activity-feed";
import { DesktopButton } from "@/components/activity-feed/desktop-button";
import { MobileActivityDrawer } from "@/components/activity-feed/mobile-activity-drawer";
import { Riddle } from "@/components/riddle";

export default function Home() {
  return (
    <div className="h-full flex relative">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <Riddle />
        {/* Desktop floating button */}
        <div className="hidden lg:block absolute top-16 right-0">
          <DesktopButton />
        </div>
      </div>

      {/* Desktop activity feed - part of flex layout */}
      <div className="hidden lg:block flex-shrink-0">
        <ActivityFeed />
      </div>

      {/* Mobile drawer */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <MobileActivityDrawer />
      </div>
    </div>
  );
}
