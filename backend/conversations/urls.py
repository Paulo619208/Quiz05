from django.urls import path
from .views import chat_view, conversation_list_view, conversation_detail_view

urlpatterns = [
    path('conversation/', chat_view, name='chat'),
    path('conversations/', conversation_list_view, name='conversation-list'),
    path('conversations/<int:pk>/', conversation_detail_view, name='conversation-detail'),
]
