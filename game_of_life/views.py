from django.shortcuts import render

def game_of_life(request):
    return render(request, 'game_of_life/gol.html')
