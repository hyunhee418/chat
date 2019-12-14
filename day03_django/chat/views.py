# chat/views.py
from django.shortcuts import render
from django.http import HttpResponse
from django.utils.safestring import mark_safe
import json

def index(request):
    return render(request, 'chat/index.html', {})

def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name_json': mark_safe(json.dumps(room_name))
    })
# @api_view
# def room(request, room_name):
#     return Response({
#         'room_name_json': mark_safe(json.dumps(room_name))
#     })


# axios.get('/room/room_name')
#     .then(res => {
#         this.roomName = res.data.room_name_json
#     })