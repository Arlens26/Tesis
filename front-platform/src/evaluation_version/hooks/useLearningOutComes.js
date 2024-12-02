import { useState } from "react"
import { toast } from "sonner"

export function useLearningOutComes() {
    const [raList, setRaList] = useState([])
    //console.log('Ra List:', raList)
    const [percentage, setPercentage] = useState(0)
    const [totalPercentage, setTotalPercentage] = useState(0)
    const [numbers, setNumbers] = useState([])
  
    const buildLearningOutcomesList = () => {
      return raList.map(ra => ({
        code: ra.code, 
        description: ra.description,
        percentage: ra.percentage
      }))
    }

    const handleAddRa = () => {
        if(percentage > 0 && totalPercentage + percentage <= 100){
          // Encontrar el número menor no presente en la lista
          let nextNumber = 1
    
          while (numbers.includes(nextNumber)) {
            nextNumber++
          }
          // Agregar el siguiente número a la lista
          const nuevosNumeros = [...numbers, nextNumber].sort((a, b) => a - b);
          setNumbers(nuevosNumeros);
    
          const raCode = `R.A.${nextNumber}`;
          setRaList([...raList, { id:nextNumber, code:raCode, description:'', percentage:`${percentage}%`}])    
          raList.sort((a, b) => a - b);
          setTotalPercentage(totalPercentage + percentage)
          setPercentage(0)
          console.log(raList)
        }else if(percentage === 0){
          toast.info('El porcentaje no debe ser igual a 0')
        }else {
          toast.info('El porcentaje total no debe ser mayor a 100')
        }    
      }
    
      const handleEditDescription = (index, newDescription) => {
        const updateRaList = [...raList]
        console.log(index)
        console.log(newDescription)
        if(newDescription !== undefined && newDescription.trim() !== ''){
          updateRaList[index].description = newDescription
          setRaList(updateRaList)
          console.log(updateRaList)
        }
      }

      const handleEditPercentage = (index, newPercentage) => {
        const updateRaList = [...raList]
        const diff = newPercentage - parseInt(updateRaList[index].percentage)
        if(!isNaN(newPercentage) && totalPercentage + diff <= 100 && newPercentage >= 1 && newPercentage <= 100){
          updateRaList[index].percentage = `${newPercentage}%`
          setRaList(updateRaList)
          setTotalPercentage(totalPercentage + diff)
        }
      }
    
      const handleDeleteRa = (index) => {
        const deletePercentage = parseInt(raList[index].percentage)
        const deleteNumber = raList[index].id
        const updateRaList = raList.filter((_, i) => i !== index)
        setRaList(updateRaList)
        setTotalPercentage(totalPercentage - deletePercentage)
        // Eliminar el número asociado al elemento eliminado
        const newNumbers = numbers.filter(number => number !== deleteNumber)
        setNumbers(newNumbers)
      }

      return {
        raList,
        percentage,
        totalPercentage,
        numbers,
        setPercentage,
        buildLearningOutcomesList,
        handleAddRa,
        handleEditDescription,
        handleEditPercentage,
        handleDeleteRa
    }
}