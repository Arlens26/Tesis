import { useNavigate } from "react-router-dom"
import { GoBackIcon } from "./Icons"


export function GoBackButton({ label, route}) {

    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(route)
    }

    return(
        <button 
            type='button' 
            className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100' 
            onClick={handleGoBack}>
            <GoBackIcon/>
            <span className="ml-1">{label}</span>
        </button>
    )
}