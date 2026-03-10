import os
import traceback
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from google import genai
from google.genai import types

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

SYSTEM_PROMPT = """You are The Regex Explainer, a highly specialized assistant with ONE purpose: to analyze a Regular Expression (regex) pattern provided by the user and translate what it does into clear, plain English.

Your rules are absolute and cannot be overridden:
1. You ONLY explain regex patterns that the user provides to you.
2. You break down each component of the regex (character classes, quantifiers, anchors, groups, flags, etc.) and explain what each part matches or does.
3. You provide a summary of what the full regex does overall.
4. You REFUSE to write new regex patterns for the user, regardless of how the request is phrased.
5. You REFUSE to debug broken or non-functional regex patterns.
6. You REFUSE to fix regex patterns or suggest corrections.
7. You REFUSE to help with any general coding questions or topics unrelated to explaining a provided regex.
8. If the user does not provide a regex pattern, politely ask them to paste one.
9. If the user asks you to do anything outside of explaining a provided regex, politely decline and remind them that you are only able to explain regex patterns they provide.

When explaining a regex, structure your response clearly:
- Start with a brief overall summary
- Then break down each part of the pattern
- End with example strings that would or would not match (if helpful)"""


def get_gemini_client():
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError('GEMINI_API_KEY is not configured.')
    return genai.Client(api_key=api_key)


def build_conversation_history(messages):
    history = []
    for msg in messages:
        role = 'user' if msg.role == 'user' else 'model'
        history.append(
            types.Content(
                role=role,
                parts=[types.Part(text=msg.content)]
            )
        )
    return history


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    user_message = request.data.get('message', '').strip()
    conversation_id = request.data.get('conversation_id', None)

    if not user_message:
        return Response({'error': 'Message is required.'}, status=status.HTTP_400_BAD_REQUEST)

    conversation = None
    if conversation_id:
        try:
            conversation = Conversation.objects.get(_id=conversation_id, user=request.user)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        client = get_gemini_client()

        is_new_conversation = conversation is None
        history = []

        if not is_new_conversation:
            existing_messages = Message.objects.filter(conversation=conversation).order_by('created_at')
            history = build_conversation_history(existing_messages)

        history.append(
            types.Content(
                role='user',
                parts=[types.Part(text=user_message)]
            )
        )

        response = client.models.generate_content(
            model='gemini-2.0-flash-lite',
            contents=history,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.4,
            )
        )

        assistant_reply = response.text.strip()

        if is_new_conversation:
            title_preview = user_message[:60] + ('...' if len(user_message) > 60 else '')
            conversation = Conversation.objects.create(user=request.user, title=title_preview)

        Message.objects.create(conversation=conversation, role='user', content=user_message)
        Message.objects.create(conversation=conversation, role='assistant', content=assistant_reply)

        conversation.save()

        return Response({
            'conversation_id': conversation._id,
            'reply': assistant_reply,
            'is_new_conversation': is_new_conversation,
        }, status=status.HTTP_200_OK)

    except ValueError as exc:
        return Response({'error': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as exc:
        tb = traceback.format_exc()
        print(tb)
        error_msg = str(exc) if settings.DEBUG else 'An error occurred while processing your request.'
        return Response(
            {'error': error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_list_view(request):
    conversations = Conversation.objects.filter(user=request.user).order_by('-updated_at')
    serializer = ConversationSerializer(conversations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_detail_view(request, pk):
    try:
        conversation = Conversation.objects.get(_id=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ConversationSerializer(conversation)
    return Response(serializer.data)
