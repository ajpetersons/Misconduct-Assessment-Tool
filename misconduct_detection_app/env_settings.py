from .detection_libs import Jplag
import os


def get_user_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        user_ip = x_forwarded_for.split(',')[0]
    else:
        user_ip = request.META.get('REMOTE_ADDR')
    return user_ip


APP_PATH = "misconduct_detection_app"


def get_file_to_compare_path(request):
    file_to_compare_path = os.path.join(APP_PATH, "uploads", get_user_ip(request), "singlefiles")
    return file_to_compare_path


def get_folder_path(request):
    folder_path = os.path.join(APP_PATH, "uploads", get_user_ip(request), "folders")
    return folder_path


def get_temp_working_path(request):
    temp_working_path = os.path.join(APP_PATH, "uploads", get_user_ip(request), "temp")
    return temp_working_path


def get_results_path(request):
    results_path = RESULTS_PATH = os.path.join(APP_PATH, "results", get_user_ip(request))
    return results_path


def get_segments_path(request):
    segments_path = SEGMENTS_PATH = os.path.join(APP_PATH, "uploads", get_user_ip(request), "segments")
    return segments_path


detection_libs_path = {
    "Jplag": os.path.join(APP_PATH, "detection_libs", "jplag-2.11.9-SNAPSHOT-jar-with-dependencies.jar")
}

# jplag_detector = Jplag(name="Jplag",
#                        lib_path=detection_libs_path["Jplag"],
#                        results_path=RESULTS_PATH,
#                        file_to_compare_path=SEGMENTS_PATH,
#                        folder_to_compare_path=FOLDER_PATH,
#                        file_language="c/c++",
#                        number_of_matches="1%",
#                        )
