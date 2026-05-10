


export default function SecondaryActionButtonComponent(
    { idName, label, isDisabled, handleClick }
    :
    { readonly idName: string, readonly label: string, readonly isDisabled: boolean, readonly handleClick: () => void }
) {
    return (
        <button
            id={idName}
            disabled={isDisabled}
            className="px-lg py-sm shadow-sm border rounded-lg font-inter cursor-pointer transition-all active:scale-95 text-secondary border-secondary bg-white hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 disabled:text-white disabled:border-primary disabled:bg-primary"
            onClick={handleClick}
        >
            {label}
        </button>
    )
}