import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { SignIn, SignUp } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'sign-in' | 'sign-up';
    onSwitchMode: (mode: 'sign-in' | 'sign-up') => void;
}

const AuthModal = ({ isOpen, onOpenChange, mode }: AuthModalProps) => {
    console.log("🚀 ~ AuthModal ~ isOpen:", isOpen)
    const isSignUp = mode === 'sign-up';
    const { isSignedIn } = useUser();
    const searchParams = useSearchParams();

    console.log("🚀 ~ AuthModal ~ searchParams:", searchParams)
    console.log("🚀 ~ AuthModal ~ searchParams.get('requireAuth')", searchParams.get('requireAuth'))

    // Open modal when requireAuth parameter is present and user is not signed in
    useEffect(() => {
        const requireAuth = searchParams.get('requireAuth');
        if (requireAuth && !isSignedIn && !isOpen) {

            onOpenChange(true);
        }
    }, [searchParams, isSignedIn, isOpen, onOpenChange]);

    // Close modal when user successfully signs in
    useEffect(() => {
        if (isSignedIn && isOpen) {
            // Close the modal when user is signed in
            onOpenChange(false);
        }
    }, [isSignedIn, isOpen, onOpenChange]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTitle className="hidden">Sign In</DialogTitle>
            <DialogContent showCloseButton={false} className="w-fit p-0">
                {isSignUp ? (
                    <SignUp />
                ) : (
                    <SignIn />
                )}
            </DialogContent>
        </Dialog >
    )
}

export default AuthModal
