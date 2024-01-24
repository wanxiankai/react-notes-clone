import { auth } from "auth"
import ClientComponent from "components/ClientComponent";
import { SessionProvider } from 'next-auth/react'

export default async function ClientPage() {
    const session = await auth();

    if (session?.user) {
        session.user = {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image
        }
    }
    return (
        <SessionProvider session={session}>
            <ClientComponent />
        </SessionProvider>
    )
}