import { useNavigate } from "react-router-dom"
import { CreateIcon } from "../../components/Icons"

export function ButtonCreateCourse() {
    const navigate = useNavigate()
    const handleCreateCourse = () => {
        navigate('/course/')
    }

    return (
    <div className='flex justify-end items-center'> 
      <button 
        className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
        onClick={handleCreateCourse}>
          <CreateIcon/>
          <span className="ml-1">Crear curso</span>
      </button>
    </div>
    )
}