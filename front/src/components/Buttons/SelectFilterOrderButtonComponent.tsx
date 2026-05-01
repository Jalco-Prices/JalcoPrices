import "@/styles/Buttons/SelectFilterOrderButtonStyle.css"

// Hooks
import { useIsHoverDevice } from "@/hooks/useIsHoverDevice"
// Utils
import { useRef, useEffect, useState, useId } from "react"
import { FilterIcon, SortDescendingIcon } from "@/icons/Icons"


export default function SelectFilterOrderButtonComponent(
    { label, iconName, options, isShowingOptions, setIsShowingOptions, setSelectedOption }
    :
    {
        readonly label: string, readonly iconName: string, readonly options: { label: string, value: string }[], readonly isShowingOptions: boolean,
        readonly setIsShowingOptions: (isShowing: boolean) => void, readonly setSelectedOption: (option: string | null) => void
    }
) {
    const [optionsWidth, setOptionsWidth] = useState<number | null>(null)

    const optionsRef = useRef<HTMLDivElement>(null)
    const uid = useId().replaceAll("-", "")

    const isHoverDevice = useIsHoverDevice()

    useEffect(() => {
        if (isShowingOptions && optionsRef.current) {
            setOptionsWidth(optionsRef.current.offsetWidth)
        } else {
            setOptionsWidth(null)
        }
    }, [isShowingOptions])

    return (
        <>
            {optionsWidth && (
                <style>{`#${uid}.select-filter-order-button.open { width: ${optionsWidth}px; }`}</style>
            )}

            <section
                className="select-filter-order-section-container"
                onMouseLeave={isHoverDevice ? () => setIsShowingOptions(false) : undefined}
            >
                {/* Select Button */}
                <button
                    id={uid}
                    className={`select-filter-order-button ${isShowingOptions ? 'open' : ''}`}
                    onClick={() => setIsShowingOptions(!isShowingOptions)}
                >
                    {/* Icon */}
                    <div className="select-filter-order-button-icon">
                        {iconName === 'filter' && <FilterIcon size={"fill"} />}
                        {iconName === 'sort' && <SortDescendingIcon size={"fill"} />}
                    </div>
                    
                    {/* Label */}
                    {label}
                </button>

                {/* Options */}
                {isShowingOptions && (
                    <div ref={optionsRef} className="select-filter-order-options-container">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className="select-filter-order-option"
                                onClick={() => {
                                    setSelectedOption(option.value)
                                    setIsShowingOptions(false)
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Overlay Close */}
            {isShowingOptions && !isHoverDevice && (
                <button
                    className="full-overlay"
                    onClick={() => setIsShowingOptions(false)}
                />
            )}
        </>
    )
}