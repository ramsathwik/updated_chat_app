from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from textblob import TextBlob

@api_view(['POST'])
def analyze_sentiment(request):
    text = request.data.get('message', '')
    if not text:
        return Response({'error': 'No message provided'}, status=400)
    
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0.1:
        sentiment = "Positive"
    elif polarity < -0.1:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return Response({
        'message': text,
        'sentiment': sentiment,
        'polarity': polarity
    })
