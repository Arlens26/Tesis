import { useEffect } from "react"
import useBreadCrumbStore from "./useBreadCrumbStore"

const useBreadCrumb = ( label, path ) => {
    console.log(label, path)
    const addBreadcrumb = useBreadCrumbStore((state) => state.addBreadcrumb)

    useEffect(() => {
        addBreadcrumb({ label, path })
    }, [label, path, addBreadcrumb])

}

export default useBreadCrumb