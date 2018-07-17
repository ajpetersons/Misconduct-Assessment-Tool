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
import os


def generate_uploaded_file_list(request):
    file_to_compare_path = get_file_to_compare_path(request)
    results_path = get_results_path(request)
    folder_path = get_folder_path(request)
    segments_path = get_segments_path(request)

    file_list = os.listdir(file_to_compare_path)
    return file_list


def return_uploaded_files(request):
    file_list = generate_uploaded_file_list(request)
    context = {
        "fileList": file_list,
    }
    return context
