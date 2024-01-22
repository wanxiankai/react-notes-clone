import { auth, signIn, signOut } from "auth"

function SignIn({ provider, ...props }) {
    return (
        <form
            action={
                async () => {
                    'use server'
                    await signIn(provider)
                }
            }
        >
            <button {...props}>Sign In</button>
        </form>
    )
}

function SignOut(props) {
    return (
        <form
            action={
                async () => {
                    'use server'
                    await signOut()
                }
            }
        >
            <button {...props}> Sign Out</button>
        </form>
    )
}

export default async function Header() {
    const session = await auth()
    return (
        <header style={{ display: 'flex', justifyContent: 'space-around' }}>
            {
                session?.user ?
                    <span>{session.user.name}<SignOut /></span>
                    :
                    <SignIn />
            }
        </header>
    )
}