import os
import shutil
from bs4 import BeautifulSoup
import bs4

import logging

logger = logging.getLogger(__name__)


class DetectionLib:
    """General detection library."""

    def __init__(self, name, lib_path, results_path, segments_path, folder_to_compare_path):
        """Create a new detection library object.
        
        :param name: the name of this library
        :type name: str
        :param lib_path: the path of the library on the server
        :type lib_path: str
        :param results_path: the path to store produced results. The results format should be:
        (results, submission_number), where results should be a dict which contains the results
        and file relations. And the submission_number should be the number of submissions rather
        than the number of files.
        :type results_path: str
        :param segments_path: the path where stores the uploaded single file
        :type segments_path: str
        :param folder_to_compare_path: the path where sotres the uploaded folder
        :type folder_to_compare_path: str
        """

        self.name = name
        self.lib_path = lib_path
        self.results_path = results_path
        self.segments_path = segments_path
        self.folder_to_compare_path = folder_to_compare_path
        self.file_language_supported = []

    def __str__(self):
        """ String represantation """
        return "<%s> DetectionLib".format(self.name)

    def get_results(self, temp_working_path):
        """Run the detection by the current library on given temp_working_path
        
        :param temp_working_path: the path where to run the detection library
        :type temp_working_path: str
        :return: the results produced by the detection library. BE AWARE:
        :rtype: [type]
        """

        assert (len(self.file_language_supported) != 0), "No support language defined for " + self.name
        self.run_detection(temp_working_path=temp_working_path)
        results = self.results_interpretation()
        self.clean_working_envs(temp_working_path=temp_working_path)
        return results

    def run_without_getting_results(self, temp_working_path):
        """Run the detection by the current library on given temp_working_path without returning the results
        
        :param temp_working_path: the path where to run the detection library
        :type temp_working_path: str
        """

        assert (len(self.file_language_supported) != 0), "No support language defined for " + self.name
        self.run_detection(temp_working_path=temp_working_path)
        self.clean_working_envs(temp_working_path=temp_working_path)

    def run_detection(self, temp_working_path):
        """Virtual function. Run the misconduct detection.
        
        :param temp_working_path: the temp working folder path
        :type temp_working_path: str
        """

        raise NotImplementedError

    def results_interpretation(self):
        """Virtual function. Interpret the results produced by this detection 
        package. It should return a tuple (results, submission_number). The 
        results should be a dict which uses the segment file names as keys. Its
        values should be the similarity and a list contains similar file links.
        
        """

        raise NotImplementedError

    def clean_working_envs(self, temp_working_path):
        """Virtual function. Clean the working folder.
        
        :param temp_working_path: the temp working folder path
        :type temp_working_path: str
        """

        raise NotImplementedError

    # To improve the code readability, following getters setters will not contain comments.
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
        if os.path.isfile(lib_path):
            self.__lib_path = lib_path
        else:
            raise FileNotFoundError("The library given is not found")

    @property
    def results_path(self):
        return self.__results_path

    @results_path.setter
    def results_path(self, results_path):
        self.__results_path = results_path

    @property
    def segments_path(self):
        return self.__file_to_compare_path

    @segments_path.setter
    def segments_path(self, file_to_compare_path):
        self.__file_to_compare_path = file_to_compare_path

    @property
    def folder_to_compare_path(self):
        return self.__folder_to_compare_path

    @folder_to_compare_path.setter
    def folder_to_compare_path(self, folder_to_compare_path):
        self.__folder_to_compare_path = folder_to_compare_path

    @property
    def file_language_supported(self):
        return self.__file_language_supported

    @file_language_supported.setter
    def file_language_supported(self, file_language_supported):
        self.__file_language_supported = file_language_supported


class Jplag(DetectionLib):
    """JPlag detection library."""

    def __init__(self, lib_path, results_path, segments_path, folder_to_compare_path, file_language, number_of_matches,
                 name="JPlag"):
        """Create a new JPlag detection package wrapper object.

        :param name: the name of this library
        :type name: str
        :param lib_path: the path of the library on the server
        :type lib_path: str
        :param results_path: the path to store produced results. The results format should be:
        (results, submission_number), where results should be a dict which contains the results
        and file relations. And the submission_number should be the number of submissions rather
        than the number of files.
        :type results_path: str
        :param segments_path: the path where stores the uploaded single file
        :type segments_path: str
        :param folder_to_compare_path: the path where sotres the uploaded folder
        :type folder_to_compare_path: str
        ----------------------Only for JPlag----------------------
        :param file_language: which languages are supported by this detection package
        :type file_language: str
        :param number_of_matches: (Matches) Number of matches that will be saved. This can be
        set with either a number or a percentage. I would suggest to set it with a percentage.
        The JPlag will only show the results with similarity higher than this number.
        :type number_of_matches: str
        """

        super().__init__(name, lib_path, results_path, segments_path, folder_to_compare_path)
        self.file_language_supported = ["java17", "python3", "c/c++",
                                        "c#-1.2", "char", "text", "scheme"]
        assert (file_language in self.file_language_supported), "Language parameter {0} not supported by JPlag".format(
            file_language)
        self.file_language = file_language
        self.number_of_matches = number_of_matches  # TODO: Might get rid of it
        self.file_relation = {}
        logger.debug('New instance of %s', self.name)

    def run_detection(self, temp_working_path):
        """Run the detection with given settings using OS command.
        
        :param temp_working_path: the temp working folder path
        :type temp_working_path: str
        """
        logger.debug('Running detection on working environment %s', temp_working_path)
        counter = 0

        # Preparing files
        if not os.path.exists(temp_working_path):
            os.makedirs(temp_working_path)

        for file_name in os.listdir(self.segments_path):
            shutil.copy(os.path.join(self.segments_path, file_name), os.path.join(temp_working_path, file_name))

        for (dir_path, dir_names, file_names) in os.walk(self.folder_to_compare_path):
            for file_name in file_names:
                if not os.path.exists(temp_working_path + file_name):
                    self.file_relation[str(counter)] = os.path.join(dir_path, file_name)
                    shutil.copy(self.file_relation[str(counter)],
                                temp_working_path + "/" + str(counter) + "_" + file_name)
                    counter += 1

        # HACK: Please notice here, you shall never allow users to run code on your server directly.
        # Try only receive part parameters from users, such as what I did here. DO NOT let users run
        # their command directly, that would be very dangerous.
        os.system("java -jar {0} -m {1} -l {2} -r {3} {4}".format(self.lib_path,
                                                                  self.number_of_matches,
                                                                  self.file_language,
                                                                  self.results_path,
                                                                  temp_working_path))

    def results_interpretation(self):
        """Interpret the results produced by JPlag.
        
        :return: (results, submission_number). The results should be a dict which
        uses the segment file names as keys. Its values should be the similarity
        and a list contains similar file links.
        :rtype: (dict, int)
        """

        with open(os.path.join(self.results_path, "index.html")) as fp:
            soup = BeautifulSoup(fp, 'html.parser')

        search_files = os.listdir(self.segments_path)
        for i in range(len(search_files)):
            search_files[i] = search_files[i][:search_files[i].find(".")]

        results = {}

        # Change this to change how to define a "submission" in the source folder
        # This line only list the sub-level folders in the source folder
        submission_number = len(os.listdir(
            os.path.join(self.folder_to_compare_path, os.listdir(self.folder_to_compare_path)[0])))

        for search_file in search_files:
            temp_similarities_for_searching_file = {}
            for tag in soup.find_all('h4'):
                if 'Matches sorted by maximum similarity (' in tag.contents:
                    for tr_tag in tag.parent.find_all('tr'):
                        if search_file in tr_tag.contents[0].contents[0]:
                            similarities = tr_tag.contents[2:]
                            for one_similarity in similarities:
                                original_file_name = one_similarity.contents[0].contents[0]
                                original_result_link = one_similarity.contents[0].get("href")
                                similarity = one_similarity.contents[2].contents[0]
                                temp_similarities_for_searching_file[
                                    self.file_relation[original_file_name[:original_file_name.find("_")]]] = [
                                    similarity, original_result_link]

                    for td_tag in tag.parent.find_all('td'):
                        for element in td_tag.contents:
                            if isinstance(element, bs4.element.Tag):
                                if len(element.contents) > 0:
                                    if search_file in element.contents[0]:
                                        original_file_name = td_tag.parent.contents[0].contents[0]
                                        original_result_link = td_tag.contents[0].get("href")
                                        similarity = td_tag.contents[2].contents[0]
                                        temp_similarities_for_searching_file[
                                            self.file_relation[original_file_name[:original_file_name.find("_")]]] = [
                                            similarity, original_result_link]

            results[search_file] = temp_similarities_for_searching_file

        return results, submission_number

    def clean_working_envs(self, temp_working_path):
        """Delete temp working folder
        
        :param temp_working_path: the temp working folder path
        :type temp_working_path: str
        """
        logger.debug('Cleaning working environment %s', temp_working_path)
        shutil.rmtree(temp_working_path)

    # To improve the code readability, following getters setters will not contain comments.
    @property
    def file_language(self):
        return self.__file_language

    @file_language.setter
    def file_language(self, file_language):
        if file_language not in self.file_language_supported:
            raise TypeError("Following language type is not supported by Jplag: " + file_language)
        self.__file_language = file_language

    @property
    def number_of_matches(self):
        return self.__number_of_matches

    @number_of_matches.setter
    def number_of_matches(self, number_of_matches):
        self.__number_of_matches = number_of_matches


