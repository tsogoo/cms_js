# Create your views here.
from django.http import HttpResponse
from django.utils import simplejson

def news(request, *args, **kwargs):
    news = [{"title":"news title1", "body":"body", "ordering":1,"id":1,"state":1},
            {"title":"news title1", "body":"body", "ordering":2,"id":2,"state":0}]
    return HttpResponse( simplejson.dumps(news),"application/json")