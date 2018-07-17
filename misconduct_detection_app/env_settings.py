from .detection_libs import Jplag
import os

APP_PATH = "misconduct_detection_app"
DETECTION_LIBS = {}


def get_user_ip(request):
    """Get ip of current user

    :param request:
    :return:
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        user_ip = x_forwarded_for.split(',')[0]
    else:
        user_ip = request.META.get('REMOTE_ADDR')
    return user_ip


get_user_id = get_user_ip


def get_file_to_compare_path(request):
    file_to_compare_path = os.path.join(APP_PATH, "uploads", get_user_id(request), "singlefiles")
    return file_to_compare_path


def get_folder_path(request):
    folder_path = os.path.join(APP_PATH, "uploads", get_user_id(request), "folders")
    return folder_path


def get_temp_working_path(request):
    temp_working_path = os.path.join(APP_PATH, "uploads", get_user_id(request), "temp")
    return temp_working_path


def get_results_path(request):
    results_path = os.path.join(APP_PATH, "results", get_user_id(request))
    return results_path


def get_segments_path(request):
    segments_path = os.path.join(APP_PATH, "uploads", get_user_id(request), "segments")
    return segments_path


detection_libs_path = {
    "Jplag": os.path.join(APP_PATH, "detection_libs", "jplag-2.11.9-SNAPSHOT-jar-with-dependencies.jar")
}

detection_libs_support_language = {
    "Jplag": ["java17", "java15", "java15dm", "java12", "java11", "python3", "c/c++", "c#-1.2", "char", "text",
              "scheme"]
}


def detection_lib_selector(selection, parameters):
    if selection not in detection_libs_path.keys():
        raise NotImplementedError("The library has not been registered")
    elif selection == "Jplag":
            name, results_path, file_to_compare_path, folder_to_compare_path, file_language, number_of_matches =\
                parameters
            return Jplag(name=selection,
                         lib_path=detection_libs_path[selection],
                         results_path=results_path,
                         file_to_compare_path=file_to_compare_path,
                         folder_to_compare_path=folder_to_compare_path,
                         file_language=file_language,
                         number_of_matches=number_of_matches,
                         )
