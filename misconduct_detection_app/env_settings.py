from .detection_lib_manager import Jplag

Jplag_detector = Jplag(name="Jplag",
                       lib_path="%cd%\\misconduct_detection_app\\detection_libs\\jplag-2.11.9-SNAPSHOT-jar-with-dependencies.jar",
                       results_path="%cd%\\misconduct_detection_app\\results\\",
                       file_language="c/c++",
                       number_of_matches="999")
