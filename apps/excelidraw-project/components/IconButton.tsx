import { ReactNode } from "react"

export function IconButton({
    icon,
    onClick,
    Activated
}:{
    icon: ReactNode,
    onClick: () => void,
    Activated:Boolean
}){
    return (
        <button 
            className={`pointer bg-black hover:bg-gray-400 border rounded-full ${Activated ? "text-red-400":"text-white"} p-2`}
            onClick={onClick}
        >
            {icon}
        </button>
    )
}