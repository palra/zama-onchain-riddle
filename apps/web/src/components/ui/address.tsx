"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "@/lib/utils";

interface AddressProps {
  address: `0x${string}`;
  className?: string;
  showCopyIcon?: boolean;
  currentUserAddress?: `0x${string}`;
}

export function Address({ address, className, showCopyIcon = true, currentUserAddress }: AddressProps) {
  const [copied, setCopied] = useState(false);
  
  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  // Check if this address is the current user
  const isCurrentUser = currentUserAddress && address.toLowerCase() === currentUserAddress.toLowerCase();
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy address");
      throw err;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={copyToClipboard}
          className={cn(
            "inline-flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 py-0.5 transition-colors cursor-pointer",
            className
          )}
        >
          <span className={cn(isCurrentUser ? "font-medium" : "font-mono")}>
            {isCurrentUser ? "You" : shortenedAddress}
          </span>
          {showCopyIcon && (
            copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            )
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center">
          <div className="font-mono text-xs">{address}</div>
          <div className="text-xs text-gray-500 mt-1">
            Click to copy
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
} 