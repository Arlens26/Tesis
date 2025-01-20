import { create } from 'zustand'

const useBreadCrumbStore = create((set) => ({
    breadcrumbs: [{ label: 'Lista de cursos', path: '/course-list' }],
    setBreadcrumbs: (newBreadcrumbs) => set({ breadcrumbs: newBreadcrumbs }),
    addBreadcrumb: (breadcrumb) =>
        set((state) => {
            const isCourseList = breadcrumb.path === '/course-list'

            // Si es "Lista de cursos" y se da clic en su breadcrumb, reinicia
            if (isCourseList && state.breadcrumbs.some(b => b.path === '/course-list')) {
                return { breadcrumbs: [breadcrumb] }
            }

            // Mantiene "Lista de cursos" y agrega la nueva miga, garantizando un máximo de 2
            return {
                breadcrumbs: [
                    state.breadcrumbs.find((b) => b.path === '/course-list'),
                    breadcrumb
                ].filter(Boolean)
            }
        }),
    clearBreadcrumbs: () =>
        set({
            breadcrumbs: [{ label: 'Lista de cursos', path: '/course-list' }]
        })
}))

export default useBreadCrumbStore