# Create your views here.
from django.template import Context, loader
from django.http import HttpResponse
def index(request):
    t = loader.get_template('index.html')
    c = Context({'media_url':'http://localhost:8000/cms'})
    return HttpResponse(t.render(c))
    