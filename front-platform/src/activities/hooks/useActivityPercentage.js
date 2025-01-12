import { useState, useEffect } from "react"
import { toast } from "sonner"
//import { useActivities } from "./useActivities"

export function useActivityPercentage(selectedScheduledId, selectedVersionId, filteredDetails, filteredActivityEvaluationDetail) {
    console.log('filt', filteredActivityEvaluationDetail)
    const [filteredPercentages, setFilteredPercentages] = useState([])
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
        if(filteredPercentages){
          const initialTotals = filteredPercentages.reduce((acc, item) => {
            acc[item.activity_id] = (acc[item.activity_id] || 0) + item.percentage
            return acc
          }, {})
          setTotalPercentageByActivity(initialTotals)
        }
    }, [filteredPercentages])

    const generateFilteredPercentages = () => {
        const percentages = filteredActivityEvaluationDetail.filter(detail => 
          filteredDetails.some(filteredDetail => filteredDetail.id === detail.version_evaluation_detail_id)
        ).map(detail => ({
          activity_id: detail.activity.id || null,
          version_evaluation_detail_id: detail.version_evaluation_detail_id, 
          percentage: parseFloat(detail.percentage) || 0
        }))
      
        setFilteredPercentages(percentages)
      }
      
    useEffect(() => {
        generateFilteredPercentages()
    }, [selectedScheduledId])

    const handlePercentageChange = (activityId, versionDetailId, value, newPercentage) => {
        const updatedPercentage = parseFloat(value) || 0
        const maxAllowedPercentage = filteredDetails.find(detail => detail.id === versionDetailId)?.percentage || 0
        console.log('Max allowed percentage: ', maxAllowedPercentage)
      
        setFilteredPercentages(prevPercentages => {
          const updatedPercentages = prevPercentages.map(percentage => {
            if (percentage.activity_id === activityId && percentage.version_evaluation_detail_id === versionDetailId) {
              return {
                ...percentage,
                percentage: updatedPercentage,
              }
            }
            return percentage
          })
      
          const totalForLearningOutcome = updatedPercentages
            .filter(item => item.version_evaluation_detail_id === versionDetailId)
            .reduce((sum, item) => sum + item.percentage, 0)
          console.log('Total for learingOutcome: ', totalForLearningOutcome)
          if (totalForLearningOutcome > maxAllowedPercentage.percentage) {
            toast.error(`La suma de los porcentajes para este RA no puede exceder ${maxAllowedPercentage.percentage}%`)
            return prevPercentages // Evita la actualización si la suma excede el límite
          }
      
          setTotalPercentageByLearningOutCome(prevState => ({
            ...prevState,
            [versionDetailId]: totalForLearningOutcome,
          }))
      
          setTotalPercentageByActivity(prevState => ({
            ...prevState,
            [activityId]: (prevState[activityId] || 0) - newPercentage + updatedPercentage,
          }))
      
          return updatedPercentages
        })
      }

      /*const handlePercentageUpdate = () => {
        const updatedTotalByActivity = {};
        const updatedTotalByLearningOutcome = {};
      
        newActivities.forEach((activity) => {
          const totalForActivity = activity.activity_evaluation_detail.reduce(
            (sum, detail) => sum + detail.percentage,
            0
          );
      
          updatedTotalByActivity[activity.id] = totalForActivity;
      
          activity.activity_evaluation_detail.forEach((detail) => {
            if (!updatedTotalByLearningOutcome[detail.version_evaluation_detail_id]) {
              updatedTotalByLearningOutcome[detail.version_evaluation_detail_id] = 0;
            }
            updatedTotalByLearningOutcome[detail.version_evaluation_detail_id] += detail.percentage;
          });
        });
      
        setTotalPercentageByActivity((prev) => ({
          ...prev,
          ...updatedTotalByActivity,
        }));
      
        setTotalPercentageByLearningOutCome((prev) => ({
          ...prev,
          ...updatedTotalByLearningOutcome,
        }));
      
        const globalTotal = Object.values(updatedTotalByActivity).reduce((sum, value) => sum + value, 0);
        setTotalPercentage(globalTotal);
      };*/

      return {
        uniqueActivities,
        handlePercentageChange,
        filteredPercentages,
        totalPercentageByActivity,
        totalPercentageByLearningOutCome
      }
}