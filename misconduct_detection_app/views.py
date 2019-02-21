import shutil
import os
import pickle
import json

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse

from django.core.serializers.json import DjangoJSONEncoder

from .env_settings import *
from . import context_processors

import logging
logger = logging.getLogger(__name__)

# Create your views here.
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
    """The upload page

    :param request: request
    :type request: HttpRequest
    :return: render
    :rtype: render
    """

    context = {
        "numberOfSubmissions": number_of_submissions(request),
    }
    return render(request, 'misconduct_detection_app/upload.html', context)


def uploaded_folder_index(request):
    """ The uploaded folder page

        :param request: request
        :type request: HttpRequest
        :return: render
        :rtype: render
    """
    # Check if uploaded file is in uploaded folder
    is_file_included = "No"
    if is_file_included_in_folder(request):
        is_file_included = "Yes"
    context = {
        "numberOfSubmissions": number_of_submissions(request),
        "isFileIncluded": is_file_included
    }
    return render(request, 'misconduct_detection_app/uploadedFolder.html', context)

def select_index(request):
    """The select page

    :param request: request
    :type request: HttpRequest
    :return: render
    :rtype: render
    """
    try:
        file_to_be_compared_path = get_file_to_compare_path(request)
        file_to_be_compared = os.listdir(file_to_be_compared_path)
        segments = {}

        with open(os.path.join(file_to_be_compared_path, file_to_be_compared[0]), 'r') as f:
            file_to_compare_path = f.read()
        if os.path.exists(get_segments_path(request)):
            segment_files = os.listdir(get_segments_path(request))
            for segment_file in segment_files:
                if os.path.isfile(os.path.join(get_segments_path(request), segment_file)):
                    with open(os.path.join(get_segments_path(request), segment_file), 'r') as f:
                        segments[segment_file] = f.read()
        file_to_compare_path_json_string = json.dumps(file_to_compare_path, cls=DjangoJSONEncoder)
        segment_json_string = json.dumps(segments, cls=DjangoJSONEncoder)
        context = {
            "fileToComparePathJsonString": file_to_compare_path_json_string,
            "segmentJsonString": segment_json_string,
        }

        return render(request, 'misconduct_detection_app/select.html', context)
    except UnicodeDecodeError:
        logger.error("Uploaded unsupported file")
        return redirect('error_uploaded_unsupported_file')


def results_index(request):
    """The results page

    :param request: request
    :type request: HttpRequest
    :return: render
    :rtype: render
    """
    # If the detection failed and there is no result, return the "no results" error page
    if not os.path.exists(get_results_path(request)):
        return redirect('error_no_results_error')

    # Read configs from disk
    configs_path_list = {}
    with open(os.path.join(get_configs_path(request), "configs.txt")) as f:
        file_lines = f.readlines()
    for line in file_lines:
        line = line.strip('\n')
        paraname, paradata = line.split(",")
        configs_path_list[paraname] = paradata

    include_segments_path = os.path.join(get_segments_path(request), "include_segments_path")
    segment_dir = os.listdir(include_segments_path)
    segment_files = {}

    for segment in segment_dir:
        if os.path.isfile(include_segments_path + "/" + segment):
            with open(include_segments_path + "/" + segment, 'r') as f:
                segment_files[segment] = f.read()

    if not configs_path_list["detectionLibSelection"] in DETECTION_LIBS.keys():
        try:
            with open(os.path.join(get_results_path(request), "results_keys.pkl"), "rb") as f:
                DETECTION_LIBS[configs_path_list["detectionLibSelection"]] = pickle.load(f)
        except FileNotFoundError:
            return redirect("error_results_keys_not_exists")

    jplag_results, jplag_submission_number = DETECTION_LIBS[configs_path_list["detectionLibSelection"]].results_interpretation()

    segment_files_json_string = json.dumps(segment_files, cls=DjangoJSONEncoder)
    jplag_results_json_string = json.dumps(jplag_results, cls=DjangoJSONEncoder)
    # Check if uploaded file is in uploaded folder
    is_file_included = "No"
    if is_file_included_in_folder(request):
        is_file_included = "Yes"

    context = {
        "jPlagResultsJsonString": jplag_results_json_string,
        # "jPlagSubmissionNumber": jplag_submission_number, # Deprecated
        "jPlagSubmissionNumber": number_of_submissions(request),
        "segmentFilesJsonString": segment_files_json_string,
        "isFileIncluded": is_file_included
    }

    return render(request, 'misconduct_detection_app/results.html', context)


# ------------------------------------Error Page Indexes------------------------------------
def error_no_results_error(request):
    return render(request, 'misconduct_detection_app/error_pages/error_no_results_error.html')


def error_uploaded_unsupported_file(request):
    context = {
        "supportedFileTypes": SUPPORTED_PROGRAMMING_LANGUAGE_EXTENSION
    }

    return render(request, 'misconduct_detection_app/error_pages/error_uploaded_unsupported_file.html', context)


def error_results_keys_not_exists(request):
    return render(request, 'misconduct_detection_app/error_pages/error_results_keys_not_exists.html')


# ------------------------------------File uploading functions------------------------------------
def upload_file(request):
    """Single file upload function

    Accept a single file from uploading and store it.
    
    :param request: request
    :type request: HttpRequest
    :return: HttpResponse
    :rtype: HttpResponse
    """

    if request.method == 'POST':
        handle_upload_file(request, request.FILES['file'], str(request.FILES['file']))

        # Remove the previous highlights, segments if they exist
        if os.path.exists(get_segments_path(request)):
            shutil.rmtree(get_segments_path(request))

        if os.path.exists(get_configs_path(request)):
            shutil.rmtree(get_configs_path(request))

        return HttpResponse('Uploading Success')
    else:
        return HttpResponse('Uploading Failed')


def handle_upload_file(request, file, filename):
    """Store the file from memory to disk
    
    :param file: the file to store
    :type file: HttpRequest.FILES
    :param filename: the file name of the file
    :type filename: str
    """

    if os.path.exists(get_file_to_compare_path(request)):
        shutil.rmtree(get_file_to_compare_path(request))
    path = get_file_to_compare_path(request)
    if not os.path.exists(path):
        os.makedirs(path)
    with open(os.path.join(path, filename), 'wb')as destination:
        for chunk in file.chunks():
            destination.write(chunk)


# ------------------------------------Folder uploading functions------------------------------------
def upload_folder(request):
    """Folder upload function

    Accept a whole folder uploading and store the files into disk
    
    :param request: request
    :type request: HttpRequest
    :return: HttpResponse
    :rtype: HttpResponse
    """
    if os.path.exists(get_folder_path(request)):
        # "ignore_errors=True" is used to delete read-only file
        # On Windows, the system file manager will create some read-only file which cause a problem here.
        shutil.rmtree(get_folder_path(request), ignore_errors=True)
    if request.method == 'POST':
        files = request.FILES.getlist('file')
        for f in files:
            if str(f)[0] == '.':
                # Skip UNIX/Mac hidden files
                continue
            file_name, file_extension = os.path.splitext(str(f))
            original_path = f.original_path
            handle_upload_folder(request, f, file_name, file_extension, original_path)
        return HttpResponse(number_of_submissions(request))
    else:
        return HttpResponse('Uploading Failed')


def handle_upload_folder(request, file, file_name, file_extension, original_path):
    """Handle the folder uploading and store the files to disk
    
    :param file: one file 
    :type file: HttpRequest.FILES
    :param file_name: the name of the file
    :type file_name: str
    :param file_extension: the extension of the file
    :type file_extension: str
    :param original_path: the path of the file on client
    :type original_path: str
    """
    path = os.path.join(get_folder_path(request), original_path)
    if not os.path.exists(path):
        os.makedirs(path)
    with open(os.path.join(path, file_name + file_extension), 'wb') as destination:
        for chunk in file.chunks():
            destination.write(chunk)


def upload_check_included(request):
    """
    Check if the uploaded folder has the uploaded file included

    :param request:
    :return: Yes/No/NA
    """
    if os.path.exists(get_folder_path(request)) and os.path.exists(get_file_to_compare_path(request)):
        if is_file_included_in_folder(request):
            return HttpResponse("Yes")
        else:
            return HttpResponse("No")
    else:
        return HttpResponse("NA")


def upload_update_context(request):
    """
    Update the context of the bottom bar
    :param request:
    :return: Json formatted context
    """
    return JsonResponse(context_processors.update_bottom_bar(request))

# ------------------------------------Examination Code------------------------------------
def examine_file(request, name):
    """Read a file on disk and return it as plain text
    
    :param request: request
    :type request: HttpRequest
    :param name: The name of the file to show
    :type name: str
    :return: The file to show
    :rtype: HttpResponse
    """

    try:
        path = get_file_to_compare_path(request)
        f = open(os.path.join(path, name), 'r')
        file_content = f.read()
        f.close()
        return HttpResponse(file_content, content_type="text/plain")
    except UnicodeDecodeError:
        return redirect('error_uploaded_unsupported_file')


def examine_folder(request, name):
    """Read a file on disk and return it as plain text (for checking files
    in the uploaded folder)
    
    :param request: request
    :type request: HttpRequest
    :param name: The name of the file to show
    :type name: str
    :return: The file to show
    :rtype: HttpResponse
    """
    try:
        path = os.path.join(get_folder_path(request), name)
        f = open(path, 'r')
        file_content = f.read()
        f.close()
        return HttpResponse(file_content, content_type="text/plain")
    except UnicodeDecodeError:
        return redirect('error_uploaded_unsupported_file')


def examine_file_in_result_page(request, name):
    """Read detecting results pages produced by detection packages
    to the user.
    
    :param request: request
    :type request: HttpRequest
    :param name: The name of the file to show
    :type name: str
    :return: The file to show
    :rtype: HttpResponse
    """

    path_file = os.path.join(get_results_path(request), name)
    # Here we need to deal with the possible picture files
    if ".gif" in path_file:
        image_data = open(path_file, "rb").read()
        return HttpResponse(image_data, content_type="image/png")
    else:
        f = open(path_file, 'r')
        file_content = f.read()
        f.close()
        return HttpResponse(file_content)


# ------------------------------------Select Code------------------------------------
def select_code(request):
    """Called to save selected segments on the server
    
    :param request: request
    :type request: HttpRequest
    :return: operation state
    :rtype: HttpResponse
    """

    if request.method == 'POST':
        if os.path.exists(get_segments_path(request)):
            shutil.rmtree(get_segments_path(request))
        if not os.path.exists(get_segments_path(request)):
            os.makedirs(get_segments_path(request))
        if len(request.POST) > 1:
            for code_segment in request.POST.keys():
                if code_segment != "csrfmiddlewaretoken":  # we don't want csrf token here
                    with open(get_segments_path(request) + "/" + code_segment, 'w', newline="\n") as f:
                        f.write(request.POST[code_segment])
        else:
            shutil.rmtree(get_segments_path(request))
        return HttpResponse('Selection Succeeded')
    else:
        return HttpResponse('Selection Failed')


def select_check_box(request):
    """Called to save segments including checkboxe states on the server
    
    :param request: request
    :type request: HttpRequest
    :return: operation state
    :rtype: HttpResponse
    """

    if not os.path.exists(get_configs_path(request)):
        os.makedirs(get_configs_path(request))
    if request.method == 'POST':
        if len(request.POST) > 1:
            for checked_box in request.POST.keys():
                if checked_box != "csrfmiddlewaretoken":
                    with open(get_configs_path(request) + "/" + "checked_boxes" + '.txt', 'w') as f:
                        f.write(request.POST[checked_box])
        return HttpResponse('Selection Succeeded')
    else:
        return HttpResponse('Selection Failed')


def select_save_html(request):
    """Called to save segments selection page left part in HTML format
    on the server
    
    :param request: request
    :type request: HttpRequest
    :return: operation state
    :rtype: HttpResponse
    """
    
    if request.method == 'POST':
        if not os.path.exists(get_segments_path(request)):
            os.makedirs(get_segments_path(request))
        if len(request.POST) > 1:
            try:
                with open(os.path.join(get_configs_path(request), "code_select_html.html"), 'w', newline='') as f:
                    f.write(request.POST["codeDisplayHtml"])
            except KeyError:
                pass
        else:
            shutil.rmtree(get_segments_path(request))
        return HttpResponse('Selection Succeeded')
    else:
        return HttpResponse('Selection Failed')


def select_load_html(request):
    """Called to load segments selection page left part in HTML format
    from the server
    
    :param request: request
    :type request: HttpRequest
    :return: the html file
    :rtype: HttpResponse
    """
    try:
        with open(os.path.join(get_configs_path(request), "code_select_html.html"), 'r') as f:
            file_content = f.read()
            file_content_json_string = json.dumps(file_content, cls=DjangoJSONEncoder)
            return HttpResponse(file_content_json_string)
    except FileNotFoundError:
        return HttpResponse(json.dumps("FILE_NOT_FOUND", cls=DjangoJSONEncoder))

    # ------------------------------------Run the Jplag jar------------------------------------
def run_detection(request):
    """Perform detection preparation
    
    :param request: request
    :type request: HttpRequest
    :return: render
    :rtype: render
    """

    if os.path.exists(get_results_path(request)):
        shutil.rmtree(get_results_path(request))
    return render(request, 'misconduct_detection_app/runningWaiting.html')


def run_detection_core(request):
    """Run detection with settings
    
    Jump to the results page after detection finished
    :param request: request
    :type request: HttpRequest
    :return: render
    :rtype: render
    """

    configs_path_list = {}
    with open(os.path.join(get_configs_path(request), "configs.txt")) as f:
        file_lines = f.readlines()
    for line in file_lines:
        line = line.strip('\n')
        paraname, paradata = line.split(",")
        configs_path_list[paraname] = paradata

    extra_settings = configs_path_list["detectionLanguage"]
    detection_lib = detection_libs_configs[configs_path_list["detectionLibSelection"]](request, extra_settings)
    detection_lib.run_without_getting_results(get_temp_working_path(request))
    DETECTION_LIBS[configs_path_list["detectionLibSelection"]] = detection_lib

    # If the detection failed and there is no result, return the "no results" error page
    if not os.path.exists(get_results_path(request)):
        return redirect('error_no_results_error')

    with open(os.path.join(get_results_path(request), "results_keys.pkl"), "wb") as f:
        pickle.dump(detection_lib, f)

    return redirect('results')


# ------------------------------------Some global functions------------------------------------
def clean(request):
    """Clean the working folder of the current user
    
    :param request: request
    :type request: HttpRequest
    :return: operation state
    :rtype: HttpResponse
    """

    file_to_compare_path = get_file_to_compare_path(request)
    results_path = get_results_path(request)
    folder_path = get_folder_path(request)
    segments_path = get_segments_path(request)
    temp_working_path = get_temp_working_path(request)
    configs_path = get_configs_path(request)

    if os.path.exists(file_to_compare_path):
        shutil.rmtree(file_to_compare_path)
    if os.path.exists(results_path):
        shutil.rmtree(results_path)
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)
    if os.path.exists(segments_path):
        shutil.rmtree(segments_path)
    if os.path.exists(temp_working_path):
        shutil.rmtree(temp_working_path)
    if os.path.exists(configs_path):
        shutil.rmtree(configs_path)

    return HttpResponse("Clean Succeeded")


def saving_configs(request):
    """Called to save current user's configs on the server
    
    :param request: request
    :type request: HttpRequest
    :return: operation state
    :rtype: HttpResponse
    """

    if not os.path.exists(get_configs_path(request)):
        os.makedirs(get_configs_path(request))
    if request.method == 'POST':
        if len(request.POST) > 1:
            for parameter in request.POST.keys():
                if parameter == "detectionLibSelection":
                    # Clean the config file first
                    with open(os.path.join(get_configs_path(request), "configs.txt"), 'w') as f:
                        f.write("detectionLibSelection," + request.POST[parameter])
                if parameter == "detectionLanguage":
                    with open(os.path.join(get_configs_path(request), "configs.txt"), 'a') as f:
                        f.write("\ndetectionLanguage," + request.POST[parameter])
        return HttpResponse('Selection Succeeded')
    else:
        return HttpResponse('Selection Failed')


def auto_detect(request):
    """Perform auto detection. Return the results to the front-end
    
    :param request: request
    :type request: HttpRequest
    :return: operation state
    :rtype: HttpResponse
    """

    auto_detection_results = auto_detect_programming_language(request)
    auto_detection_results_json_string = json.dumps(auto_detection_results, cls=DjangoJSONEncoder)
    return HttpResponse(auto_detection_results_json_string)


def test(request):
    """Used for testing other functions. URL has been set accordingly.

    """

    tester = auto_detect_programming_language(request)

    return HttpResponse("test finished")

