


export default function ErrorComponent(
    { message }
    :
    { readonly message: string }
) {
    return (
        <section className="section-container">
            <p className="error-text">{message}</p>
        </section>
    )
}