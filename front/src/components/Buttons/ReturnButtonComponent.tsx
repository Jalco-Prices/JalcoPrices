// Icons
import { ArrowLeftIconSimple } from "@/icons/Icons";
// Utils
import { useRouter } from "next/navigation";


export default function ReturnButtonComponent() {
    const router = useRouter();

    const handleReturn = () => {
        if (globalThis.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    }

    return (
        <button
            className="w-fit h-fit flex items-center gap-2 transition-colors hover:cursor-pointer text-on-surface-variant"
            onClick={handleReturn}
        >
            <ArrowLeftIconSimple size={20} color="#45464d" />
            
            <p className="font-inter">
                Regresar
            </p>
        </button>
    )
}