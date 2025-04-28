import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
//import { useActivities } from "./useActivities"

export function useActivityPercentage(
  selectedScheduledId, 
  selectedVersionId, 
  filteredDetails, 
  filteredActivityEvaluationDetail) {
    console.log('filt', filteredActivityEvaluationDetail)
    //const [filteredPercentages, setFilteredPercentages] = useState([])
    const filteredPercentages = useMemo(() => 
      filteredActivityEvaluationDetail
        .filter(detail => 
          filteredDetails.some(filteredDetail => 
            filteredDetail.id === detail.version_evaluation_detail_id
          )
        )
        .map(detail => ({
          activity_id: detail.activity.id || null,
          version_evaluation_detail_id: detail.version_evaluation_detail_id, 
          percentage: parseFloat(detail.percentage) || 0
        })),
      [filteredActivityEvaluationDetail, filteredDetails] // Dependencias
    )
    console.log('Filtered percentages: ', filteredPercentages)
    const [totalPercentageByActivity, setTotalPercentageByActivity] = useState(0)
    const [totalPercentageByLearningOutCome, setTotalPercentageByLearningOutCome] = useState({})
    console.log('Total percentage by learning outcome: ', totalPercentageByLearningOutCome)
   
    
    const uniqueActivities = Array.from(
        new Set(filteredActivityEvaluationDetail.map((detail) => detail.activity.id))
    ).map((id) => {
        return filteredActivityEvaluationDetail.find((detail) => detail.activity.id === id)
    })
    console.log('Unique Activities: ', uniqueActivities)

    useEffect(() => {
      const initialTotals = filteredPercentages.reduce((acc, item) => {
        acc[item.activity_id] = (acc[item.activity_id] || 0) + item.percentage
        return acc
      }, {})
      setTotalPercentageByActivity(initialTotals)
    }, [filteredPercentages])

    useEffect(() => {
        if(filteredPercentages){
          const initialTotals = filteredPercentages.reduce((acc, item) => {
            acc[item.activity_id] = (acc[item.activity_id] || 0) + item.percentage
            return acc
          }, {})
          setTotalPercentageByActivity(initialTotals)
        }
    }, [filteredPercentages])

    /*const generateFilteredPercentages =  useCallback(() => {
        const percentages = filteredActivityEvaluationDetail.filter(detail => 
          filteredDetails.some(filteredDetail => filteredDetail.id === detail.version_evaluation_detail_id)
        ).map(detail => ({
          activity_id: detail.activity.id || null,
          version_evaluation_detail_id: detail.version_evaluation_detail_id, 
          percentage: parseFloat(detail.percentage) || 0
        }))
      
        setFilteredPercentages(percentages)
      }, [filteredActivityEvaluationDetail, filteredDetails])*/
      
    /*useEffect(() => {
        generateFilteredPercentages()
    }, [selectedScheduledId])*/

    const handlePercentageChange = (activityId, versionDetailId, value, previousPercentage) => {
      const updatedPercentage = parseFloat(value) || 0
      const maxAllowed = filteredDetails.find(d => d.id === versionDetailId)?.percentage.percentage || 0
      const currentPercentages = filteredPercentages
    
      const existingIndex = currentPercentages.findIndex(p => 
        p.activity_id === activityId && 
        p.version_evaluation_detail_id === versionDetailId
      )
    
      let newPercentages = [...currentPercentages]
      if (existingIndex !== -1) {
        newPercentages[existingIndex] = { 
          ...newPercentages[existingIndex], 
          percentage: updatedPercentage 
        }
      } else {
        newPercentages.push({
          activity_id: activityId,
          version_evaluation_detail_id: versionDetailId,
          percentage: updatedPercentage
        })
      }
    
      // Validar totales
      const totalForLO = newPercentages
        .filter(p => p.version_evaluation_detail_id === versionDetailId)
        .reduce((sum, p) => sum + p.percentage, 0)
    
      if (totalForLO > maxAllowed) {
        toast.error(`Superaste el máximo permitido (${maxAllowed}%) para este RA`)
        return false
      }
    
      const diff = updatedPercentage - previousPercentage
      setTotalPercentageByLearningOutCome(prevState => ({
        ...prevState,
        [versionDetailId]: (prevState[versionDetailId] || 0) + diff
      }))
      setTotalPercentageByActivity(prevState => ({
        ...prevState,
        [activityId]: (prevState[activityId] || 0) + diff
      }))
      /*setFilteredPercentages(prev => {
        // Buscar si ya existe el porcentaje para esta actividad y detalle
        const existingIndex = prev.findIndex(p => 
          p.activity_id === activityId && 
          p.version_evaluation_detail_id === versionDetailId
        )
    
        let newPercentages = [...prev]
        if (existingIndex !== -1) {
          // Actualizar existente
          newPercentages[existingIndex] = { 
            ...newPercentages[existingIndex], 
            percentage: updatedPercentage 
          }
        } else {
          // Agregar nuevo porcentaje (incluyendo temporales)
          newPercentages.push({
            activity_id: activityId,
            version_evaluation_detail_id: versionDetailId,
            percentage: updatedPercentage
          })
        }
    
        // Validar totales
        const totalForLO = newPercentages
          .filter(p => p.version_evaluation_detail_id === versionDetailId)
          .reduce((sum, p) => sum + p.percentage, 0)
    
        if (totalForLO > maxAllowed) {
          toast.error(`Superaste el máximo permitido (${maxAllowed}%) para este RA`);
          return prev // Revertir si excede
        }
    
        const diff = updatedPercentage - previousPercentage

        // Actualizar totales
        setTotalPercentageByLearningOutCome(prevState => ({
          ...prevState,
          [versionDetailId]: (prevState[versionDetailId] || 0) + diff
        }))

        setTotalPercentageByActivity(prevState => ({
          ...prevState,
          [activityId]: (prevState[activityId] || 0) + diff
        }))

        return newPercentages
      })*/
      return true
    }

      return {
        uniqueActivities,
        handlePercentageChange,
        filteredPercentages,
        totalPercentageByActivity,
        totalPercentageByLearningOutCome
      }
}