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