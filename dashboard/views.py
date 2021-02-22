from django.shortcuts import render
from .models import Goal, Blog

def dashboard(request):
    goals = Goal.objects.all()
    blogs = Blog.objects.all()
    return render(request, 'dashboard/home.html', {'blogs': blogs})

