from .detection_lib_manager import Jplag
import os

APP_PATH = "misconduct_detection_app"

FOLDER_PATH = os.path.join(APP_PATH, "uploads", "folders")
FILE_TO_COMPARE_PATH = os.path.join(APP_PATH, "uploads", "singlefiles")
TEMP_WORKING_PATH = os.path.join(APP_PATH, "uploads", "temp")
RESULTS_PATH = os.path.join(APP_PATH, "results")
SEGMENTS_PATH = os.path.join(APP_PATH, "uploads", "segments")

detection_libs_path = {
    "Jplag": os.path.join(APP_PATH, "detection_libs", "jplag-2.11.9-SNAPSHOT-jar-with-dependencies.jar")
}

jplag_detector = Jplag(name="Jplag",
                       lib_path=detection_libs_path["Jplag"],
                       results_path=RESULTS_PATH,
                       file_to_compare_path=SEGMENTS_PATH,
                       folder_to_compare_path=FOLDER_PATH,
                       file_language="c/c++",
                       number_of_matches="1%",
                       )
