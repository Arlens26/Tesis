import { useEffect, useState } from "react"
import { useEnrolledStudent } from "../hooks/useEnrolledStudent"

export function ActivityRating() {

    const { getStudents, students } = useEnrolledStudent()

    const learningOutComes = [
        { id: "RA1", weight: 20 },
        { id: "RA2", weight: 30 },
      ]

    const max = 2.5
    const [notes, setNotes] = useState([])

    useEffect(() => {
        getStudents()
    }, [])

    useEffect(() => {
        if (students.length > 0) {
          const initialNotes = students.map((student) => ({
            id: student.id,
            RA1: 0,
            RA2: 0,
            accNote: 0,
          }));
          setNotes(initialNotes)
        }
      }, [students])

    const handleNoteChange = (studentId, RAId, value) => {
        const newNotes = notes.map((note) => {
          if (note.id === studentId) {
            const updatedNote = {
              ...note,
              [RAId]: parseFloat(value),
            };
            updatedNote.accNote =
              (updatedNote.RA1 * learningOutComes[0].weight) / 100 +
              (updatedNote.RA2 * learningOutComes[1].weight) / 100
            return updatedNote
          }
          return note
        })
        setNotes(newNotes)
      }

    // Render table headers
    const renderTableHeaders = () => (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">Estudiantes</th>
                {learningOutComes.map((outcome) => (
                <th key={outcome.id} scope="col" className="px-6 py-3">
                    {`R.A. ${outcome.id} - ${outcome.weight}%`}
                </th>
                ))}
                <th scope="col" className="px-6 py-3">Escala</th>
                <th scope="col" className="px-6 py-3">Nota acumulada - Max: {max}</th>
            </tr>
        </thead>
    )

    // Render table rows
  const renderTableRows = () => (
    <tbody>
       {students.map((student) => {
        const studentNote = notes.find((note) => note.id === student.id)
        if (!studentNote) return null

        return (
          <tr
            key={student.id}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
          >
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <span>{`${student.first_name} ${student.last_name}`}</span>
            </td>
            {learningOutComes.map((outcome) => (
              <td key={outcome.id} className="px-6 py-4">
                <input
                  type="number"
                  value={studentNote[outcome.id] || ""}
                  onChange={(e) =>
                    handleNoteChange(student.id, outcome.id, e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </td>
            ))}
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <input
                type="number"
                value={(studentNote.accNote / (max * 5)).toFixed(2)}
                readOnly
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </td>
            <td className="px-6 py-4">
              <input
                type="number"
                value={studentNote.accNote.toFixed(2)}
                readOnly
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </td>
          </tr>
        )
      })}            
    </tbody>
  )

    return(
        <form className='form flex flex-col gap-4 mt-4'>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {renderTableHeaders()}
            {renderTableRows()}
            </table>
        </form>
    )
}