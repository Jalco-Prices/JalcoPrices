import { SignUp } from '@clerk/nextjs'


export default async function SignUpPage() {
    return (
        <main className="auth-container">
            <SignUp routing="hash" fallbackRedirectUrl="/" />
        </main>
    )
}