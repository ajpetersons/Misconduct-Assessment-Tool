"""misconduct_detection_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', views.upload_index, name='upload_index'),
    path('examine/', views.examine_index, name='examine_index'),
    path('select/', views.select_index, name='select_index'),
    path('results/', views.results_index, name='results'),
    path('upload/uploadFile/', views.upload_file, name='upload_file'),
    path('upload/uploadFolder/', views.upload_folder, name='upload_folder'),
    path('examine/singlefiles/<str:name>', views.examine_file, name='examine_file'),
    path('examine/folders/<str:name>', views.examine_folder, name='examine_folder'),
    path('select/selectCode/', views.select_code, name='select_code'),
    path('select/runningWaitingPage/', views.run_detection, name='run_detection'),
    path('select/running/', views.run_detection_core, name='run_detection'),
    path('results/details/<path:name>', views.examine_file_in_result_page, name='examine_file_in_result'),
]