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

    @action(detail=False, methods=['post'])
    def delete_by_activity_and_versions(self, request):
        activity_id = request.data.get('activity_id')
        version_evaluation_detail_ids = request.data.get('version_evaluation_detail_ids', [])

        if not activity_id or not version_evaluation_detail_ids:
            return Response(
                {'error': 'Se requieren activity_id y version_evaluation_detail_ids'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            activity = Activity.objects.get(id=activity_id)
            activity.delete()
            # Se eliminan los registros que coincidan con los ids recibidos
            deleted_count, _ = ActivityEvaluationDetail.objects.filter(
                activity_id=activity_id,
                version_evaluation_detail_id__in=version_evaluation_detail_ids
            ).delete()
            
            return Response(
                { 
                    'message': f'Se eliminaron {deleted_count} registros de evaluación y la actividad principal (ID: {activity_id})'
                },
                status=status.HTTP_200_OK
            )
                
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GradeDetailLearningOutComeView(viewsets.ModelViewSet):
    serializer_class = GradeDetailLearningOutComeSerializer
    queryset = GradeDetailLearningOutCome.objects.select_related(
        'enrolled_course__student', 
        'enrolled_course__scheduled_course', 
        'activity_evaluation_detail__activity', 
        'activity_evaluation_detail__version_evaluation_detail'
    ).all()

    def get_queryset(self):
        user = self.request.user
        
        if not user.is_authenticated:
            return GradeDetailLearningOutCome.objects.none()
            
        # Si es profesor, filtrar por sus cursos
        if user.groups.filter(name='professor').exists():
            return self.queryset.filter(
                enrolled_course__scheduled_course__professor=user
            )
            
        # Si no es profesor, no mostrar nada
        return GradeDetailLearningOutCome.objects.none()

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
            evaluation_details = item.get('activity_evaluation_detail', [])

            #activity_id = activity_data.get('id')
            activity_id = activity_data.get('id')
            if not activity_id and evaluation_details:
                activity_id = evaluation_details[0].get('activity_id')
            scheduled_course_id = activity_data.get('scheduled_course')

            # Buscar y actualizar la actividad si existe
            if activity_id and not str(activity_id).startswith('temp-'):
                try:
                    activity = Activity.objects.get(id=activity_id)
                    activity.name = activity_data['name']
                    activity.description = activity_data['description']
                    activity.scheduled_course_id = scheduled_course_id
                    activity.save()
                except Activity.DoesNotExist:
                    return Response({'error': 'Actividad no existe'}, status=404)
            else:
                # Buscar por nombre y curso programado, o crear si no existe
                activity = Activity.objects.create(
                    name=activity_data['name'],
                    description=activity_data['description'],
                    scheduled_course_id=scheduled_course_id
                )

            # Crear o actualizar detalles de evaluación
            for detail in evaluation_details:
                version_id = detail['version_evaluation_detail_id']
                percentage = detail['percentage']

                ActivityEvaluationDetail.objects.update_or_create(
                    activity=activity,
                    version_evaluation_detail_id=version_id,
                    defaults={'percentage': percentage}
                )

        return Response({'status': 'success'}, status=status.HTTP_200_OK)