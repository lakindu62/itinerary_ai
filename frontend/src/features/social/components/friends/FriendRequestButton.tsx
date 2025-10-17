"use client";

import * as React from "react";
import { Button } from "@frontend/components/ui/button";
import { UserPlus, Clock, UserCheck, UserMinus } from "lucide-react";
import {
  useGetFriendshipStatusQuery,
  useSendFriendRequestMutation,
  useRemoveFriendshipMutation,
  useAcceptFriendRequestMutation,
} from "../../lib/friendship.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@frontend/components/ui/alert-dialog";

interface FriendRequestButtonProps {
  userId: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
  showIcon?: boolean;
}

const FriendRequestButton: React.FC<FriendRequestButtonProps> = ({
  userId,
  variant,
  size = "default",
  className = "",
  showIcon = true,
}) => {
  const [showRemoveDialog, setShowRemoveDialog] = React.useState(false);

  // Get friendship status with this user
  const { data: status, isLoading: isLoadingStatus } =
    useGetFriendshipStatusQuery(userId);

  // Mutations
  const [sendFriendRequest, { isLoading: isSending }] =
    useSendFriendRequestMutation();
  const [removeFriendship, { isLoading: isRemoving }] =
    useRemoveFriendshipMutation();
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();

  const isProcessing = isSending || isRemoving || isAccepting;

  // Determine button state based on friendship status
  const getButtonState = (): {
    text: string;
    icon: typeof UserPlus;
    variant: "default" | "outline" | "ghost" | "secondary";
    action: (() => void) | (() => Promise<void>) | null;
  } => {
    if (isLoadingStatus) {
      return {
        text: "Loading...",
        icon: Clock,
        variant: "outline",
        action: null,
      };
    }

    if (!status || status.status === null) {
      // No friendship exists
      return {
        text: "Add Friend",
        icon: UserPlus,
        variant: variant || "default",
        action: handleSendRequest,
      };
    }

    if (status.status === "accepted") {
      // Already friends
      return {
        text: "Friends",
        icon: UserCheck,
        variant: variant || "secondary",
        action: () => setShowRemoveDialog(true),
      };
    }

    if (status.status === "pending") {
      if (status.isSender) {
        // Current user sent the request
        return {
          text: "Request Sent",
          icon: Clock,
          variant: variant || "outline",
          action: handleCancelRequest,
        };
      } else {
        // Current user received the request
        return {
          text: "Accept Request",
          icon: UserCheck,
          variant: variant || "default",
          action: handleAcceptRequest,
        };
      }
    }

    // Default fallback
    return {
      text: "Add Friend",
      icon: UserPlus,
      variant: variant || "default",
      action: handleSendRequest,
    };
  };

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest({ receiverId: userId }).unwrap();
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  const handleCancelRequest = async () => {
    if (!status?.friendshipId) return;
    try {
      await removeFriendship(status.friendshipId).unwrap();
    } catch (error) {
      console.error("Failed to cancel friend request:", error);
    }
  };

  const handleAcceptRequest = async () => {
    if (!status?.friendshipId) return;
    try {
      await acceptFriendRequest(status.friendshipId).unwrap();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleRemoveFriend = async () => {
    if (!status?.friendshipId) return;
    try {
      await removeFriendship(status.friendshipId).unwrap();
      setShowRemoveDialog(false);
    } catch (error) {
      console.error("Failed to remove friend:", error);
    }
  };

  const buttonState = getButtonState();
  const Icon = buttonState.icon;

  return (
    <>
      <Button
        variant={buttonState.variant}
        size={size}
        onClick={buttonState.action || undefined}
        disabled={isProcessing || isLoadingStatus || !buttonState.action}
        className={className}
      >
        {showIcon && <Icon className="w-4 h-4 mr-2" />}
        {buttonState.text}
      </Button>

      {/* Remove Friend Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Friend</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this person from your friends
              list? You can send them a friend request again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFriend}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remove Friend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FriendRequestButton;
