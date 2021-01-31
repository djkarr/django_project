from django.shortcuts import render
from .models import Goal

def dashboard(request):
    goals = Goal.objects.all()
    return render(request, 'dashboard/home.html', {'goals': goals})

