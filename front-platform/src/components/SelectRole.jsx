import { useUsers } from "../hooks/useUsers"

export function SelectRole(){

    const { user, setRole } = useUsers()
    const { profile } = user

    const handleClickDirector = () => {
        setRole('director')
    }

    const handleClickProfessor = () => {
        setRole('professor')
    }

    return(
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="grid justify-end px-4 pt-4">
                <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                    <span className="sr-only">Open dropdown</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                    </svg>
                </button>
                {/*<!-- Dropdown menu -->*/}
                <div id="dropdown" className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2" aria-labelledby="dropdownButton">
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                    </li>
                    </ul>
                </div>
            </div>
            <span className="grid justify-items-center py-2 text-sm text-gray-500 dark:text-gray-400">Hola, {user.username}</span>
            {/* Contenido role */}
            <div className="grid grid-cols-2 items-center pb-10">
                <div className="justify-self-center">
                    <button className="relative w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-600 flex items-center justify-center" onClick={handleClickDirector}>
                        <svg className="absolute w-full h-full rounded-full text-gray-400 z-10" fill="currentColor" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </button>
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{profile.is_director && <span>Director</span>}</h5>
                </div>
                <div className="justify-self-center">
                    <button className="relative w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-600 flex items-center justify-center" onClick={handleClickProfessor}>
                        <svg className="absolute w-full h-full rounded-full text-gray-400 z-10" fill="currentColor" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </button>
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{profile.is_professor && <span>Profesor</span>}</h5>           
                </div>
            </div>
        </div>
    )
}