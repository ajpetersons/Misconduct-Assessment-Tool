import shutil

from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from django.core.files.uploadhandler import MemoryFileUploadHandler, TemporaryFileUploadHandler
from django.shortcuts import render, redirect
from django.http import HttpResponse

import os
import json
from django.core.serializers.json import DjangoJSONEncoder

from .env_settings import *


# Create your views here.
# ------------------------------------Custom File Handler------------------------------------


class MDPCustomInMemoryUploadedFile(InMemoryUploadedFile):
    """The custom InMemoryUploadedFile data type
    
    In our MDP project, we need to know the original file path to show the details when
    user asks. Therefore, we added the support of original file path to the file type.
    """

    def __init__(self, file, field_name, name, content_type, size, charset, content_type_extra=None):
        super().__init__(file, field_name, name, content_type, size, charset, content_type_extra)
        self.original_path = name[:name.rfind('/')] + "/"


class MDPCustomMemoryFileUploadHandler(MemoryFileUploadHandler):
    """The custom file upload handler 
    
    This file handler uses MDP_CustomInMemoryUploadedFile we defined above to support 
    save the original file path on the server.
    """

    def file_complete(self, file_size):
        """Return a file object if this handler is activated."""
        if not self.activated:
            return

        self.file.seek(0)
        return MDPCustomInMemoryUploadedFile(
            file=self.file,
            field_name=self.field_name,
            name=self.file_name,
            content_type=self.content_type,
            size=file_size,
            charset=self.charset,
            content_type_extra=self.content_type_extra
        )


class MDPCustomTemporaryUploadedFile(TemporaryUploadedFile):
    def __init__(self, name, content_type, size, charset, content_type_extra=None):
        super().__init__(name, content_type, size, charset, content_type_extra)
        self.original_path = name[:name.rfind('/')] + "/"


class MDPCustomTemporaryFileUploadHandler(TemporaryFileUploadHandler):
    def new_file(self, *args, **kwargs):
        super().new_file(*args, **kwargs)
        self.file = MDPCustomTemporaryUploadedFile(self.file_name, self.content_type, 0, self.charset,
                                                   self.content_type_extra)


# ------------------------------------Index------------------------------------


def index(request):
    """The index page
    
    :param request: request
    :type request: HttpRequest
    :return: render
    :rtype: render
    """

    return render(request, 'misconduct_detection_app/welcome.html')


def upload_index(request):
    return render(request, 'misconduct_detection_app/upload.html')


def examine_index(request):
    path_file = "misconduct_detection_app/uploads/singlefiles/"
    path_folder = "misconduct_detection_app/uploads/folders/"
    local_files = os.listdir(path_file)
    local_folders = os.listdir(path_folder)
    context = {
        'local_files': local_files,
        'local_folders': local_folders,
    }
    return render(request, 'misconduct_detection_app/examine.html', context)


def select_index(request):
    path_file = "misconduct_detection_app/uploads/singlefiles/"
    local_files = os.listdir(path_file)

    f = open(path_file + local_files[0], 'r')
    file_content = f.read()
    f.close()
    context = {
        "file_content": file_content,
    }

    return render(request, 'misconduct_detection_app/select.html', context)


def results_index(request):
    segment_dir = os.listdir(SEGMENTS_PATH)
    segment_files = {}

    for segment in segment_dir:
        with open(SEGMENTS_PATH + "/" + segment, 'r+') as f:
            segment_files[segment[:segment.find(".")]] = f.read()

    jplag_results, jplag_submission_number = jplag_detector.results_interpretation()

    segment_files_json_string = json.dumps(segment_files, cls=DjangoJSONEncoder)
    jplag_results_json_string = json.dumps(jplag_results, cls=DjangoJSONEncoder)

    context = {
        "jPlagResultsJsonString": jplag_results_json_string,
        "jPlagSubmissionNumber": jplag_submission_number,
        "segmentFilesJsonString": segment_files_json_string,
    }

    return render(request, 'misconduct_detection_app/results.html', context)


# ------------------------------------Uploading single file------------------------------------

def upload_file(request):
    """Single file upload function

    Accept a single file from uploading and store it.
    
    :param request: request
    :type request: HttpRequest
    :return: HttpResponse
    :rtype: HttpResponse
    """

    if request.method == 'POST':
        handle_upload_file(request.FILES['file'], str(request.FILES['file']))
        return HttpResponse('Uploading Success')
    else:
        return HttpResponse('Uploading Failed')


def handle_upload_file(file, filename):
    """Store the file from memory to disk
    
    :param file: the file to store
    :type file: HttpRequest.FILES
    :param filename: the file name of the file
    :type filename: str
    """

    path = 'misconduct_detection_app/uploads/singlefiles/'
    if not os.path.exists(path):
        os.makedirs(path)
    with open(path + filename, 'wb+')as destination:
        for chunk in file.chunks():
            destination.write(chunk)


# ------------------------------------Uploading folder------------------------------------


def upload_folder(request):
    """Folder upload function

    Accept a whole folder uploading and store the files into disk
    
    :param request: request
    :type request: HttpRequest
    :return: HttpResponse
    :rtype: HttpResponse
    """

    if request.method == 'POST':
        files = request.FILES.getlist('file')
        for f in files:
            file_name, file_extension = os.path.splitext(str(f))
            original_path = f.original_path
            # if file_extension == '.c':
            handle_upload_folder(f, file_name, file_extension, original_path)
        return HttpResponse('Upload Success')
    else:
        return HttpResponse('Uploading Failed')


"""
TODO: merge these two file handler function.
"""


def handle_upload_folder(file, file_name, file_extension, original_path):
    """handle the folder uploading and store the files to disk
    
    :param file: one file 
    :type file: HttpRequest.FILES
    :param file_name: the name of the file
    :type file_name: str
    :param file_extension: the extension of the file
    :type file_extension: str
    """

    path = 'misconduct_detection_app/uploads/folders/' + original_path
    if not os.path.exists(path):
        os.makedirs(path)
    with open(path + file_name + file_extension, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)


# ------------------------------------Examination Page------------------------------------


def examine_file(request, name):
    path_file = "misconduct_detection_app/uploads/singlefiles/"
    f = open(path_file + name, 'r')
    file_content = f.read()
    f.close()
    return HttpResponse(file_content, content_type="text/plain")


def examine_folder(request, name):
    path_folder = "misconduct_detection_app/uploads/folders/" + name
    local_folders = os.listdir(path_folder)
    return render(request, 'misconduct_detection_app/examine.html', {"local_folders": local_folders})


def examine_folder_files(request, name):
    path_file = "misconduct_detection_app/uploads/folders/"
    f = open(path_file + name, 'r')
    file_content = f.read()
    f.close()
    return HttpResponse(file_content, content_type="text/plain")


def examine_file_in_result_page(request, name):
    path_file = "misconduct_detection_app/uploads/folders/"
    f = open(path_file + name, 'r')
    file_content = f.read()
    f.close()
    return HttpResponse(file_content, content_type="text/plain")


# ------------------------------------Select Code------------------------------------


def select_code(request):
    if request.method == 'POST':
        if not os.path.exists(SEGMENTS_PATH):
            os.makedirs(SEGMENTS_PATH)
        for code_segment in request.POST.keys():
            if code_segment != "csrfmiddlewaretoken":
                with open(SEGMENTS_PATH + "/" + code_segment + '.c', 'w+') as f:
                    f.write(request.POST[code_segment])
        return HttpResponse('Selection Succeeded')
    else:
        return HttpResponse('Selection Failed')


# ------------------------------------Run the Jplag jar------------------------------------


def run_detection(request):
    return render(request, 'misconduct_detection_app/running.html')


def run_detection_core(request):
    jplag_detector.run_without_getting_results(TEMP_WORKING_PATH)

    # return render(request, 'misconduct_detection_app/results.html', context)
    return redirect('/results/')
