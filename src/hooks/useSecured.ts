import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useSecured = () => {
    const router = useRouter();
    return useSession({
        required: true,
        onUnauthenticated() {
            router.push('/')
        }
    });    
};