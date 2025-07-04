#from django.shortcuts import render
#from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializer import UserSerializer, UserRegisterSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404

# Create your views here.
class UserViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def login(self, request):
        user = get_object_or_404(User, username=request.data['username'])

        if not user.check_password(request.data['password']):
            return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(instance=user)

        return Response({'token': token.key, 'user': user_serializer.data}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    @authentication_classes([TokenAuthentication])
    @permission_classes([IsAuthenticated])
    def logout(self, request):
        # Elimina el token del usuario actual
        request.auth.delete()
        return Response({'message': 'Sesión cerrada exitosamente'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def register(self, request):
        user_register_serializer = UserRegisterSerializer(data=request.data)

        if user_register_serializer.is_valid():
            user_register_serializer.save()
            user = User.objects.get(username=user_register_serializer.data['username'])
            user.set_password(user_register_serializer.data['password'])
            user.save()

            token = Token.objects.create(user=user)

            return Response({'token': token.key, 'user': user_register_serializer.data},
                            status=status.HTTP_201_CREATED)

        return Response(user_register_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    @authentication_classes([TokenAuthentication])
    @permission_classes([IsAuthenticated])
    def profile(self, request):
        print(request.user)
        user = request.user
        # Verificar si el usuario es profesor, director y/o estudiante
        is_professor = user.groups.filter(name='professor').exists()
        is_director = user.groups.filter(name='director').exists()
        is_student = user.groups.filter(name='student').exists()
        
        if user.is_authenticated:
            #user_serializer = UserSerializer(instance=user)
            profile_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_professor': is_professor,
                'is_director': is_director,
                'is_student': is_student
            }
            return Response(profile_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfessorListView(viewsets.ViewSet):
    def list(self, request):
        queryset = User.objects.filter(groups__name='professor')
        if queryset.exists():
            professor_serializer = UserSerializer(queryset, many=True)
            return Response(professor_serializer.data, status=status.HTTP_200_OK)
        else: 
            return Response({'error':'There are no professors available'}, status=status.HTTP_404_NOT_FOUND)

class StudentListView(viewsets.ViewSet):
    def list(self, request):
        queryset = User.objects.filter(groups__name='student')
        if queryset.exists():
            student_serializer = UserSerializer(queryset, many=True)
            return Response(student_serializer.data, status=status.HTTP_200_OK)
        else: 
            return Response({'error':'There are no students available'}, status=status.HTTP_404_NOT_FOUND)