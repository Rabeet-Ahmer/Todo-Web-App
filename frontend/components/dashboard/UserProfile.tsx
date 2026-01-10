"use client"

import { User, Mail, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"
import { useState } from "react"

interface User {
  id: number
  email: string
  username: string
}

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter()
  const { state, isMobile } = useSidebar()
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Defensive programming - ensure user data exists
  const displayName = user?.username || user?.email?.split('@')[0] || 'User'
  const displayEmail = user?.email || 'No email'

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/")
          },
        },
      })
    } catch (error) {
      console.error("Failed to sign out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="p-4 border-t border-border-subtle space-y-4">
      <div className="flex items-center gap-3">
        {/* Placeholder Profile Picture */}
        <div className="w-12 h-12 bg-primary flex items-center justify-center text-white font-bold text-lg rounded-full shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm font-display uppercase tracking-wider truncate">
            {displayName}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono uppercase tracking-wider">
            <Mail className="size-3" />
            <span className="truncate">{displayEmail}</span>
          </div>
          {/* <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">
            USER ID: {displayId}
          </div> */}
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-border-subtle w-full" />

      {/* Actions */}
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/profile")}
          className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary text-gray-400 font-mono text-xs uppercase tracking-wider transition-all"
        >
          <User className="size-4" />
          <span>Profile Settings</span>
        </Button> */}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              aria-label={isSigningOut ? "Terminating..." : "Terminate Session"}
              className="w-full justify-start gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 font-mono text-xs uppercase tracking-wider transition-all group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="size-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                {isSigningOut ? "Terminating..." : "Terminate Session"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            hidden={state !== "collapsed" || isMobile}
          >
            {isSigningOut ? "Terminating..." : "Terminate Session"}
          </TooltipContent>
        </Tooltip>
    </div>
  )
}
