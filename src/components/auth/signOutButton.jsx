


import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function SignOutButton() {
    const router=useRouter();
    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/"); // redirect to login page
                },
            },
        });
    } 
    return (
        <Button variant="outline" onClick={handleSignOut()}>
            Sign Out
        </Button>
    )
}
