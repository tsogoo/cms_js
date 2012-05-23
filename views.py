# Create your views here.
from django.http import HttpResponse
from django.template import Context, loader
def home(request, *args, **kwargs):
    t = loader.get_template("templates/index.html")
    return HttpResponse(t.render(Context({'MEDIA_URL':'/static/'})))