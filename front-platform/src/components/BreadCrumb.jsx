import { Link } from "react-router-dom"
import useBreadCrumbStore from '../hooks/useBreadCrumbStore'

export function BreadCrumb() {
    const breadcrumbs = useBreadCrumbStore(state => state.breadcrumbs)
    console.log(breadcrumbs)
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                {/*<li className="inline-flex items-center">
                    <Link to="/" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Home</Link>
                </li>*/}
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                        )}
                        <Link to={breadcrumb.path} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                            {breadcrumb.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    )
}