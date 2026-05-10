

function InputComponent(
    { id, value, setValue, symbol, isNumber, isOnlyRead }
    :
    {
        readonly id: string, readonly value: string | number, readonly setValue: (newValue: string | number) => void, readonly symbol?: string,
        readonly isNumber: boolean, readonly isOnlyRead: boolean
    }
) {
    return (
        <input
            id={id}
            type={isNumber ? "number" : "text"}
            readOnly={isOnlyRead}
            className={`
                no-spinner w-full py-sm rounded border font-inter focus:outline-none border-outline-variant
                ${symbol ? "pl-4 pr-13" : "px-md"}
                ${isOnlyRead ? "cursor-not-allowed bg-surface-container-low" : "focus:ring-2 transition-all bg-white focus:ring-secondary hover:border-outline"}
            `}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    )
}


export default function ProductDetailsInput(
    { id, label, value, setValue, symbol=undefined, isNumber=false, isOnlyRead=false, wasChanged=false, isRequired=false }
    :
    {
        readonly id: string, readonly label: string, readonly value: string | number, readonly setValue: (newValue: string | number) => void, readonly symbol?: string,
        readonly isNumber?: boolean, readonly isOnlyRead?: boolean, readonly wasChanged?: boolean, readonly isRequired?: boolean
    }
) {
    return (
        <section
            className={`
                relative flex flex-col gap-xs
                ${wasChanged ? 'changed-indicator' : ''}
                ${isRequired ? 'required-indicator' : ''}
            `}
        >
            <label
                htmlFor={id}
                className="font-inter text-label-caps uppercase text-on-surface-variant"
            >
                {label}
            </label>

            {symbol
                ?   // Input with Symbol
                    <div className="relative">
                        <span className="absolute right-3 top-2 text-on-surface-variant">
                            {symbol}
                        </span>

                        <InputComponent
                            id={id}
                            value={value}
                            setValue={setValue}
                            symbol={symbol}
                            isNumber={isNumber}
                            isOnlyRead={isOnlyRead}
                        />
                    </div>
                
                :   // Normal Input
                    <InputComponent
                        id={id}
                        value={value}
                        setValue={setValue}
                        symbol={symbol}
                        isNumber={isNumber}
                        isOnlyRead={isOnlyRead}
                    />
            }
        </section>
    )
}