from .detection_libs import Jplag
import os

# Global system parameters defined here.
APP_PATH = "misconduct_detection_app"
DETECTION_LIBS = {}

# The following default path is used when user is unknown. Which is 'default' situation
DEFAULT_FILE_TO_COMPARE_WITH_PATH = os.path.join(APP_PATH, "uploads", "Default", "singlefiles")
DEFAULT_FOLDER_PATH = os.path.join(APP_PATH, "uploads", "Default", "folders")
DEFAULT_TEMP_WORKING_PATH = os.path.join(APP_PATH, "uploads", "Default", "temp")
DEFAULT_RESULTS_PATH = os.path.join(APP_PATH, "results", "Default")
DEFAULT_SEGMENTS_PATH = os.path.join(APP_PATH, "uploads", "Default", "segments")


def get_user_ip(request):
    """Get ip of current user

    :param request: request
    :type request: HttpRequest
    :return: user's ip
    :rtype: str
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        user_ip = x_forwarded_for.split(',')[0]
    else:
        user_ip = request.META.get('REMOTE_ADDR')
    return user_ip


"""
TODO: For later developer - When you finish the authentication part in Django, you can simply replace the user_id
function to your user id getter. Here since the authentication part hasn't finished, I use ip to distinguish users.
Which shall not be used when deployed on a server.
"""
get_user_id = get_user_ip


def get_file_to_compare_path(request):
    """

    :param request: request
    :type request: HttpRequest
    :return: path of the single uploaded file
    :rtype: str
    """
    file_to_compare_path = os.path.join(APP_PATH, "uploads", get_user_id(request), "singlefiles")
    return file_to_compare_path


def get_folder_path(request):
    """

    :param request: request
    :type request: HttpRequest
    :return: path of the uploaded folder
    :rtype: str
    """
    folder_path = os.path.join(APP_PATH, "uploads", get_user_id(request), "folders")
    return folder_path


def get_temp_working_path(request):
    """

    :param request: request
    :type request: HttpRequest
    :return: path of the temp working folder
    :rtype: str
    """
    temp_working_path = os.path.join(APP_PATH, "uploads", get_user_id(request), "temp")
    return temp_working_path


def get_results_path(request):
    """

    :param request: request
    :type request: HttpRequest
    :return: path of the results
    :rtype: str
    """
    results_path = os.path.join(APP_PATH, "results", get_user_id(request))
    return results_path


def get_segments_path(request):
    """

    :param request: request
    :type request: HttpRequest
    :return: path to save user selected segments
    :rtype: str
    """
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
