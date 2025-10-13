"use client";

import { cn } from "@/lib/utils";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/8bit/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/8bit/avatar";
import { Typewriter } from "@/components/ui/typewriter-text";

export interface DialogueProps extends React.ComponentProps<"div"> {
  avatarSrc?: string;
  avatarFallback?: string;
  title?: string;
  description?: string;
  player?: boolean;
  typewriterSpeed?: number;
  typewriterCursor?: string;
}

export default function Dialogue({
  className,
  avatarSrc,
  avatarFallback,
  title,
  description,
  player = true,
  typewriterSpeed = 50,
  typewriterCursor = "",
  ...props
}: DialogueProps) {
  return (
    <div className={cn("flex gap-3", className)} {...props}>
      {player && (
        <Avatar variant="retro" className="size-16">
          <AvatarImage src={avatarSrc} alt={avatarFallback} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      )}
      <Alert className={cn(!player && "text-right")}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <Typewriter
            text={description || ""}
            speed={typewriterSpeed}
            cursor={typewriterCursor}
            loop={false}
          />
        </AlertDescription>
      </Alert>

      {!player && (
        <Avatar variant="retro" className="size-16">
          <AvatarImage src={avatarSrc} alt={avatarFallback} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
