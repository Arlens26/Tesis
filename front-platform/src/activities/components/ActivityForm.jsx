import { useActivities } from "../../hooks/useActivities"
import { useScheduledCourse } from "../../scheduled_course/hooks/useSheduledCourse"

export function ActivityForm() {

    const { scheduledCourse } = useScheduledCourse()
    const { createActivity } = useActivities()
  
    const handleSubmit = (event) => {
      event.preventDefault()
      const fields = Object.fromEntries(new window.FormData(event.target))
      console.log(fields)
      createActivity(fields)
        .then(() => {
          console.log('Actividad creada correctamente')
        .catch((error) => {
          console.error('Error al crear la actividad:', error);
        });
      })
      //console.log('Actividad agregada')
    }
  
    return (
      <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
        <label className="text-sm">Grupos:</label>
        <select id="scheduled_course" name='scheduled_course' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option disabled>Grupos</option>
                    {scheduledCourse && scheduledCourse.map(scheduled => (
                          <option key={scheduled.id} value={scheduled.id}>
                             {`${scheduled.group}`}
                          </option>
                    ))}
        </select>
        {
          /*
          <label className="text-sm">Nombre actividad:</label>
          <input type="text" placeholder='Nombre de la actividad' name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <label className="text-sm">Descripción:</label>
          <textarea placeholder='Descripción' name='description' rows="3" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>          
          <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Crear actividad</button>
          */
        }
      </form>
    )
  }