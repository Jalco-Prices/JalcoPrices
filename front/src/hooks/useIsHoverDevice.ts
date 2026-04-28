// Utils
import { useEffect, useState } from "react"

export function useIsHoverDevice() {
    const [isHoverDevice, setIsHoverDevice] = useState<boolean | null>(null)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHoverDevice(
            typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(hover: hover)').matches
        )
    }, [])

    return isHoverDevice
}