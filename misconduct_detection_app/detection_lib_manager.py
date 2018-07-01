import os

class DetectionLib:
    def __init__(self, name, lib_path, results_path):
        self.name = name
        self.lib_path = lib_path
        self.results_path = results_path

    def run_detection(self, upload_file_path):
        raise NotImplementedError

    @property
    def name(self):
        return self.__name

    @name.setter
    def name(self, name):
        self.__name = name

    @property
    def lib_path(self):
        return self.__lib_path

    @lib_path.setter
    def lib_path(self, lib_path):
        self.__lib_path = lib_path

    @property
    def results_path(self):
        return self.__results_path

    @results_path.setter
    def results_path(self, results_path):
        self.__results_path = results_path


class Jplag(DetectionLib):
    def __init__(self, name, lib_path, results_path, file_language, number_of_matches):
        self.file_language = file_language
        self.number_of_matches = number_of_matches
        super().__init__(name, lib_path, results_path)

    def run_detection(self, upload_file_path):
        os.system(
            "java -jar {0} -m {1} -l {2} -r {3} {4}".format(self.lib_path,
                                                            self.file_language,
                                                            self.number_of_matches,
                                                            self.results_path,
                                                            upload_file_path))

    @property
    def file_language(self):
        return self.__file_language

    @file_language.setter
    def file_language(self, file_language):
        if file_language not in ["java17", "java15", "java15dm", "java12", "java11", "python3", "c/c++", "c#-1.2", "char", "text", "scheme"]:
            raise TypeError("Following language type is not supported by Jplag: " + file_language)
        self.__file_language = file_language

    @property
    def number_of_matches(self):
        return self.__number_of_matches

    @number_of_matches.setter
    def number_of_matches(self, number_of_matches):
        self.__number_of_matches = number_of_matches
