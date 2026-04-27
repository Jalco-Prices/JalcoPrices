import { SignIn } from '@clerk/nextjs'


export default async function LogInPage() {
    return (
        <main className="auth-container">
            <SignIn routing="hash" fallbackRedirectUrl="/" />
        </main>
    )
}