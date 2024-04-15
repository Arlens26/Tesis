#from django.shortcuts import render
#from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializer import UserSerializer
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
    def register(self, request):
        user_serializer = UserSerializer(data=request.data)

        if user_serializer.is_valid():
            user_serializer.save()
            user = User.objects.get(username=user_serializer.data['username'])
            user.set_password(user_serializer.data['password'])
            user.save()

            token = Token.objects.create(user=user)

            return Response({'token': token.key, 'user': user_serializer.data},
                            status=status.HTTP_201_CREATED)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    @authentication_classes([TokenAuthentication])
    @permission_classes([IsAuthenticated])
    def profile(self, request):
        print(request.user)
        if request.user.is_authenticated:
            user_serializer = UserSerializer(instance=request.user)
            return Response(user_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)