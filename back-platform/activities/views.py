from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Activity, ActivityEvaluationDetail, GradeDetailLearningOutCome
from .serializer import ActivitySerializer, ActivityEvaluationDetailSerializer, GradeDetailLearningOutComeSerializer
from rest_framework.decorators import action

# Create your views here.
class ActivityView(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()

class ActivityEvaluationDetailView(viewsets.ModelViewSet):
    serializer_class = ActivityEvaluationDetailSerializer
    queryset = ActivityEvaluationDetail.objects.all()

class GradeDetailLearningOutComeView(viewsets.ModelViewSet):
    serializer_class = GradeDetailLearningOutComeSerializer
    queryset = GradeDetailLearningOutCome.objects.all()

class VersionDetailActivityEvaluationView(viewsets.ViewSet):
    serializer_class = ActivityEvaluationDetail

    @action(detail=False, methods=['get'])
    def get_details_by_evaluation_version_detail(self, request):
        version_evaluation_detail_ids = request.query_params.get('evaluation_version_detail_ids', None)

        if not version_evaluation_detail_ids:
            return Response({'error': 'evaluation_version_detail_ids parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            version_evaluation_detail_ids = [int(id.strip()) for id in version_evaluation_detail_ids.split(',')]
            activity_evaluation_details = ActivityEvaluationDetail.objects.filter(version_evaluation_detail__id__in=version_evaluation_detail_ids)
            #activity_evaluation_detail = ActivityEvaluationDetail.objects.filter(version_evaluation_detail__id=version_evaluation_detail_id)
            #evaluation_version_details = EvaluationVersionDetail.objects.filter(evaluation_version__id=evaluation_version_detail_id)
            serialized_activity_evaluation_details = ActivityEvaluationDetailSerializer(activity_evaluation_details, many=True).data
            #serialized_activity_evaluation_detail = ActivityEvaluationDetailSerializer(activity_evaluation_detail, many=True).data
            #serialized_evaluation_version_details = EvaluationVersionDetailSerializer(evaluation_version_details, many=True).data

            response_data = {
                'activity_evaluation_detail': serialized_activity_evaluation_details,
                #'evaluation_version_details': serialized_evaluation_version_details
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except ValueError as ve:
            return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)    
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ActivitySettingView(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'])
    def save_activities(self, request):
        data = request.data
        
        for item in data:
            activity_data = item.get('activities')
            evaluation_data = item.get('activity_evaluation_detail')

            activity_id = evaluation_data.get('activity_id', None)
            
            if activity_id is not None:
                # Actualizar actividad existente
                try:
                    activity = Activity.objects.get(id=activity_id)
                    activity.name = activity_data['name']
                    activity.description = activity_data['description']
                    activity.scheduled_course_id = activity_data['scheduled_course']
                    activity.save()
                except Activity.DoesNotExist:
                    return Response({'error': f'Activity with id {activity_id} does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                # Crear nueva actividad
                activity_serializer = ActivitySerializer(data=activity_data)
                if activity_serializer.is_valid():
                    activity = activity_serializer.save()
                else:
                    return Response(activity_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            evaluation_detail = ActivityEvaluationDetail(
                version_evaluation_detail_id=evaluation_data['version_evaluation_detail_id'],
                activity=activity,
                percentage=evaluation_data['percentage']
            )
            evaluation_detail.save()

        return Response({'status': 'success'}, status=status.HTTP_201_CREATED)