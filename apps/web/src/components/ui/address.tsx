"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface AddressProps {
  address: `0x${string}`;
  className?: string;
  showCopyIcon?: boolean;
  currentUserAddress?: `0x${string}`;
}

export function Address({
  address,
  className,
  showCopyIcon = true,
  currentUserAddress,
}: AddressProps) {
  const [copied, copyToClipboard] = useCopyToClipboard();
  const handleCopy = async () => {
    try {
      const copied = await copyToClipboard(address);
      if (copied) {
        toast.success("Address copied to clipboard");
      } else {
        toast.warning("Clipboard not supported by your browser", {
          description: `Copy paste this directly: ${address}`,
          duration: Infinity,
          closeButton: true,
        });
      }
    } catch (err) {
      toast.error("Failed to copy address");
      throw err;
    }
  };

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  // Check if this address is the current user
  const isCurrentUser =
    currentUserAddress &&
    address.toLowerCase() === currentUserAddress.toLowerCase();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1 hover:bg-muted rounded px-1 py-0.5 transition-colors cursor-pointer",
            className,
          )}
        >
          <span className={cn(isCurrentUser ? "font-medium" : "font-mono")}>
            {isCurrentUser ? "You" : shortenedAddress}
          </span>
          {showCopyIcon &&
            (copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            ))}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center">
          <div className="font-mono text-xs">{address}</div>
          <div className="text-xs text-gray-500 mt-1">Click to copy</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
