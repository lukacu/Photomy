import uuid

from django.http import HttpResponse
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view
import numpy as np
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage as storage


import PIL.Image
import requests

from rest_framework import filters


from identifier.tasks import reidify_identity_match
from identifier.models import ImageIdentityMatch, IdentityGroup
from identifier.serializers import ImageIdentityMatchSerializer, IdentitySerializer

from .models import Image
from .serializers import ImageSerializer


# IDENTITY_MATCH
class IdentityMatchDetail(generics.UpdateAPIView):
    serializer_class = ImageIdentityMatchSerializer

    def get_queryset(self, **kwargs):
        identity_match_id = self.kwargs.get('pk')
        return ImageIdentityMatch.objects.filter(Q(id=identity_match_id) & Q(user=self.request.user))


@api_view(['GET'])
def reject_identity_match(request, pk):
    identity_match = ImageIdentityMatch.objects.select_related('image_id').get(
        Q(image_id__user=request.user) & Q(id=pk))

    reidify_identity_match.delay(identity_match.id)
    return Response(data={}, status=status.HTTP_200_OK)


def _reject_identity_match(identity_match):
    rejected_identities = identity_match.rejected_identities

    if not rejected_identities:
        rejected_identities = []

    rejected_identities.append(identity_match.identity_group_id.id)
    identity_match.rejected_identities = rejected_identities
    identity_match.save()
    return identity_match


# IDENTITY

class IdentityDetail(generics.RetrieveUpdateAPIView):
    serializer_class = IdentitySerializer

    def get_queryset(self, **kwargs):
        identity_id = self.kwargs.get('pk')
        return IdentityGroup.objects.filter(Q(id=identity_id) & Q(user=self.request.user))

# PERSON


class PersonList(generics.ListAPIView):
    filter_backends = filter_backends = (filters.OrderingFilter,)
    serializer_class = ImageIdentityMatchSerializer

    def get_queryset(self, **kwargs):
        identity_id = self.kwargs.get('identity_id')
        return ImageIdentityMatch.objects.select_related('image_id').filter(
            Q(identity_group_id__id=identity_id) & Q(user=self.request.user))


# PEOPLE

class PeopleList(generics.ListAPIView):
    filter_backends = (filters.OrderingFilter,)
    serializer_class = ImageIdentityMatchSerializer

    def get_queryset(self):
        matches = ImageIdentityMatch.objects.filter(
            Q(image_id__face_encodings__len=1) & Q(image_id__user=self.request.user) & Q(confirmed=True)).distinct()

        people = {match.identity_group_id.id: match for match in matches}.values()
        return list(people)


class NeighbourPeople(generics.ListAPIView):
    filter_backends = (filters.OrderingFilter,)
    serializer_class = ImageIdentityMatchSerializer

    def get_queryset(self, **kwargs):
        identity_id = self.kwargs.get('identity_id')

        identity_images = ImageIdentityMatch.objects.filter(
            Q(identity_group_id=identity_id)).values('image_id')

        neighbours = ImageIdentityMatch.objects.filter(
            Q(image_id__in=identity_images) & Q(confirmed=True)).exclude(identity_group_id=identity_id).values('identity_group_id').distinct()

        matches = ImageIdentityMatch.objects.filter(
            Q(image_id__face_encodings__len=1) & Q(image_id__user=self.request.user) & Q(confirmed=True) & Q(identity_group_id__in=neighbours)).distinct()

        people = {match.identity_group_id.id: match for match in matches}.values()

        return list(people)


# FAVORITES

class FavoritesList(generics.ListAPIView):
    serializer_class = ImageSerializer
    filter_backends = (filters.OrderingFilter,)

    def get_queryset(self):
        return Image.objects.filter(Q(favorite=True) & Q(user=self.request.user))


# IMAGES

class ImagesList(generics.ListAPIView):
    serializer_class = ImageSerializer
    filter_backends = (filters.OrderingFilter,)

    def get_queryset(self):
        return Image.objects.filter(user=self.request.user)


class ImageDetails(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ImageSerializer

    def get_queryset(self):
        return Image.objects.filter(user=self.request.user)


# UPLOAD

@api_view(['POST'])
def upload_image_file(request):
    uploaded_file = request.FILES.get('file')
    image = PIL.Image.open(uploaded_file).convert('RGB')
    image.format = image.format if image.format else 'JPEG'
    return handle_image_upload(image, request.user)


@api_view(['POST'])
def upload_url(request):
    image_url = request.data.get('image_url', '')
    try:
        image = PIL.Image.open(requests.get(image_url, stream=True).raw)
    except OSError:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return handle_image_upload(image, request.user)


def handle_image_upload(image, user):
    new_image = save_image(image, user)
    serializer = ImageSerializer(new_image)
    return Response(data=serializer.data, status=status.HTTP_200_OK)


def get_lqip(image, image_id, user):
    file_name = str(image_id) + '_' + str(user.id) + \
        '.preview.' + image.format
    lqip_f_thumb = storage.open(file_name, "w")

    optimized_image = image.copy()
    optimized_image.thumbnail((300, 300), PIL.Image.ANTIALIAS)

    optimized_image.save(lqip_f_thumb, "JPEG", optimize=True, quality=90)
    return lqip_f_thumb


def save_image(image, user):
    image_id = uuid.uuid4()
    file_name = str(image_id) + '_' + str(user.id) + '.' + image.format
    f_thumb = storage.open(file_name, "w")
    image.save(f_thumb, "JPEG")
    width, height = image.size

    lqip_f_thumb = get_lqip(image, image_id, user)

    new_image = Image.objects.create(
        id=image_id,
        user=user,
        width=width,
        height=height,
        image_upload=f_thumb,
        lqip_upload=lqip_f_thumb)
    f_thumb.close()
    lqip_f_thumb.close()

    return new_image
