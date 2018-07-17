"""misconduct_detection_project Context Processors Configuration

Put the data need to be shared across pages here. For example, you can see
https://stackoverflow.com/questions/3221592/how-to-pass-common-dictionary-data-to-every-page-in-django

or you can check Django document
https://docs.djangoproject.com/en/dev/ref/templates/api/
for more information.
"""
from .env_settings import get_segments_path
from .env_settings import get_folder_path
from .env_settings import get_file_to_compare_path
from .env_settings import get_results_path
from .env_settings import detection_libs_support_language
import os
import json
from django.core.serializers.json import DjangoJSONEncoder


def generate_uploaded_file_list(request):
    file_to_compare_path = get_file_to_compare_path(request)
    results_path = get_results_path(request)
    folder_path = get_folder_path(request)
    segments_path = get_segments_path(request)

    if os.path.exists(file_to_compare_path):
        file_to_compare_path_list = os.listdir(file_to_compare_path)
    else:
        file_to_compare_path_list = ["NOFOLDEREXISTS"]
    if os.path.exists(segments_path):
        segments_path_list = ["SEGMENTSEXISTS"]
    else:
        segments_path_list = ["NOFOLDEREXISTS"]
    if os.path.exists(results_path):
        results_path_list = ["RESULTSEXISTS"]
    else:
        results_path_list = ["NOFOLDEREXISTS"]

    folder_path_list = []
    for (dir_path, dir_names, file_names) in os.walk(folder_path):
        for file_name in file_names:
            folder_path_list.append(os.path.join(dir_path, file_name))
    if len(folder_path_list) == 0:
        folder_path_list = ["NOFOLDEREXISTS"]

    return file_to_compare_path_list, results_path_list, folder_path_list, segments_path_list


def return_uploaded_files(request):
    file_to_compare_path_list, results_path_list, folder_path_list, segments_path_list \
        = generate_uploaded_file_list(request)
    context = {
        "fileToComparePathList": json.dumps(file_to_compare_path_list, cls=DjangoJSONEncoder),
        "resultsPathList": json.dumps(results_path_list, cls=DjangoJSONEncoder),
        "folderPathList": json.dumps(folder_path_list, cls=DjangoJSONEncoder),
        "segmentsPathList": json.dumps(segments_path_list, cls=DjangoJSONEncoder),
    }
    return context


def return_supported_detection_lib(request):
    context = {
        "detectionLibList": detection_libs_support_language
    }
    return context
