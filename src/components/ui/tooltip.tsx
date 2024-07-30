// tooltip.tsx
"use client"
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Custom Hook to handle the logic for opening and closing tooltip
function useToggleTooltip(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);
  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const openTooltip = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setIsOpen(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 3000); // Close after 3 seconds
  };

  const closeTooltip = () => {
    setIsOpen(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  };

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return { isOpen, openTooltip, closeTooltip };
}

// Enhanced Tooltip component
const EnhancedTooltip: React.FC<{
  children: React.ReactNode;
  content: React.ReactNode;
}> = ({ children, content }) => {
  const { isOpen, openTooltip, closeTooltip } = useToggleTooltip();

  return (
    <Tooltip open={isOpen}>
      <TooltipTrigger
        onClick={openTooltip}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
        onTouchStart={openTooltip}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

export { Tooltip, EnhancedTooltip, TooltipTrigger, TooltipContent, TooltipProvider }