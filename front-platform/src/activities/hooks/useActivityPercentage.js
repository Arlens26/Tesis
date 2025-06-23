import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
//import { useActivities } from "./useActivities"

export function useActivityPercentage(
  filteredDetails, 
  filteredActivityEvaluationDetail, 
  activitiesData) {
    console.log('filt', filteredActivityEvaluationDetail)

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
    console.log('Total percentage by activity: ', totalPercentageByActivity)
    const [totalPercentageByLearningOutCome, setTotalPercentageByLearningOutCome] = useState({})
    console.log('Total percentage by learning outcome: ', totalPercentageByLearningOutCome)
   
    
    const uniqueActivities = Array.from(
        new Set(filteredActivityEvaluationDetail.map((detail) => detail.activity.id))
    ).map((id) => {
        return filteredActivityEvaluationDetail.find((detail) => detail.activity.id === id)
    })
    console.log('Unique Activities: ', uniqueActivities)

    /*useEffect(() => {
      const initialTotals = filteredPercentages.reduce((acc, item) => {
        acc[item.activity_id] = (acc[item.activity_id] || 0) + item.percentage
        return acc
      }, {})
      setTotalPercentageByActivity(initialTotals)
    }, [filteredPercentages])*/

    useEffect(() => {
        if(filteredPercentages){
          const initialTotals = filteredPercentages.reduce((acc, item) => {
            acc[item.activity_id] = (acc[item.activity_id] || 0) + item.percentage
            return acc
          }, {})
          setTotalPercentageByActivity(initialTotals)
        }
    }, [filteredPercentages])

    useEffect(() => {
      const initialTotals = {}
      filteredDetails.forEach(detail => {
        initialTotals[detail.id] = 0
      })
      
      activitiesData.forEach(activity => {
        Object.entries(activity.percentages).forEach(([detailId, percentage]) => {
          if (initialTotals[detailId] !== undefined) {
            initialTotals[detailId] += percentage
          }
        })
      })
    
      setTotalPercentageByLearningOutCome(initialTotals)
    }, [activitiesData, filteredDetails])

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
    
      // 1. Calcular suma de TODAS las actividades (incluyendo el nuevo valor)
      const totalForLO = activitiesData.reduce((sum, activity) => {
        if (activity.id === activityId) {
            return sum + updatedPercentage // Usar el nuevo valor para la actividad actual
        }
        return sum + (activity.percentages[versionDetailId] || 0)
      }, 0)

      if (totalForLO > maxAllowed) {
          toast.error(`Superaste el máximo permitido (${maxAllowed}%) para este RA`)
          return false
      }

      // 2. Actualizar el total del RA con el cálculo completo
      setTotalPercentageByLearningOutCome(prev => ({
          ...prev,
          [versionDetailId]: totalForLO
      }))

      // 3. Actualizar total por actividad
      const activityTotal = Object.values(activitiesData.find(a => a.id === activityId).percentages)
          .reduce((sum, val) => sum + val, 0) - previousPercentage + updatedPercentage

      setTotalPercentageByActivity(prev => ({
          ...prev,
          [activityId]: activityTotal
      }))
      
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