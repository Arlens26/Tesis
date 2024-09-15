import { useState } from 'react'
import * as XLSX from 'xlsx'

export function EnrolledStudent() {
    const [students, setStudents] = useState([])

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result)
                const workbook = XLSX.read(data, { type: 'array' })
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(firstSheet)

                const result = jsonData.map(item => {
                    const firstInitial = item.Nombres.charAt(0).toUpperCase()
                    const lastInitial = item.Apellidos.charAt(0).toUpperCase()
                    
                    const identification = item.Cédula

                    const password = `${firstInitial}${identification}${lastInitial}`

                    return {
                        first_name: item.Nombres,
                        last_name: item.Apellidos,
                        identification: identification,
                        email: item.Correo,
                        code: item.Código,
                        password: password 
                    };
                });
                console.log('Resultado estudiantes: ', result)
                setStudents(result)
            }
            reader.readAsArrayBuffer(file)
        }
    }

    return(
        <>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Cargar el archivo
            </label>
            <input onChange={handleFileChange} 
            accept='.xlsx .xls'
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
            id="file_input" type="file"/>
            <div className="mt-4">
                <h2 className="text-lg font-bold">Lista de Estudiantes</h2>
                {students.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {students.map((student, index) => (
                            <li key={index}>
                                {student.first_name} {student.last_name} - ID: {student.identification} - Email: {student.email} - Código: {student.code} - Contraseña: {student.password}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay estudiantes para mostrar.</p>
                )}
            </div>
        </>
    )
}