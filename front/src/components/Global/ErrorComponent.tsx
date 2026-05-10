


export default function ErrorComponent(
    { message }
    :
    { readonly message: string }
) {
    return (
        <main className="main-container">
            <section className="section-container">
                <p className="error-text">{message}</p>
            </section>
        </main>
    )
}