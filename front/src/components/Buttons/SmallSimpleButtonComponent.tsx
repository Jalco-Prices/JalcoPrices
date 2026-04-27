


export default function SmallSimpleButtonComponent(
    { text }
    :
    { readonly text: string }
) {
    return (
        <button className='bg-primary text-on-primary text-sm font-medium font-inter px-5 py-2 rounded-lg active:scale-95 transition-transform cursor-pointer'>
            {text}
        </button>
    )
}