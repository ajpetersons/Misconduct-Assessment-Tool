import os
import shutil
from bs4 import BeautifulSoup


class DetectionLib:
    def __init__(self, name, lib_path, results_path, file_to_compare_path, folder_to_compare_path):
        self.name = name
        self.lib_path = lib_path
        self.results_path = results_path
        self.file_to_compare_path = file_to_compare_path
        self.folder_to_compare_path = folder_to_compare_path
        self.file_language_supported = []

    def get_results(self, temp_working_path):
        assert (len(self.file_language_supported) != 0), "No support language defined for " + self.name
        self.run_detection(temp_working_path=temp_working_path)
        results = self.results_interpretation()
        self.clean_working_envs(temp_working_path=temp_working_path)
        return results
    
    def run_without_getting_results(self, temp_working_path):
        assert (len(self.file_language_supported) != 0), "No support language defined for " + self.name
        self.run_detection(temp_working_path=temp_working_path)
        self.clean_working_envs(temp_working_path=temp_working_path)

    def run_detection(self, temp_working_path):
        raise NotImplementedError

    def results_interpretation(self):
        raise NotImplementedError

    def clean_working_envs(self, temp_working_path):
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
    def file_to_compare_path(self):
        return self.__file_to_compare_path

    @file_to_compare_path.setter
    def file_to_compare_path(self, file_to_compare_path):
        if not os.path.exists(file_to_compare_path):
            os.makedirs(file_to_compare_path)
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
    def __init__(self, name, lib_path, results_path, file_to_compare_path, folder_to_compare_path, file_language,
                 number_of_matches):
        super().__init__(name, lib_path, results_path, file_to_compare_path, folder_to_compare_path)
        self.file_language_supported = ["java17", "java15", "java15dm", "java12", "java11", "python3", "c/c++",
                                        "c#-1.2", "char", "text", "scheme"]
        self.file_language = file_language
        self.number_of_matches = number_of_matches
        self.file_relation = {}

    def run_detection(self, temp_working_path):
        counter = 0

        if not os.path.exists(temp_working_path):
            os.makedirs(temp_working_path)

        for file_name in os.listdir(self.file_to_compare_path):
            shutil.copy(os.path.join(self.file_to_compare_path, file_name), os.path.join(temp_working_path, file_name))

        for (dir_path, dir_names, file_names) in os.walk(self.folder_to_compare_path):
            for file_name in file_names:
                if not os.path.exists(temp_working_path + file_name):
                    self.file_relation[str(counter)] = os.path.join(dir_path, file_name)
                    shutil.copy(self.file_relation[str(counter)],
                                temp_working_path + "/" + str(counter) + "_" + file_name)
                    counter += 1

        os.system("java -jar {0} -m {1} -l {2} -r {3} {4}".format(self.lib_path,
                                                                  self.number_of_matches,
                                                                  self.file_language,
                                                                  self.results_path,
                                                                  temp_working_path))

    def results_interpretation(self):
        with open(os.path.join(self.results_path, "index.html")) as fp:
            soup = BeautifulSoup(fp, 'html.parser')

        search_files = os.listdir(self.file_to_compare_path)
        for i in range(len(search_files)):
            search_files[i] = search_files[i][:search_files[i].find(".")]

        results = {}

        for search_file in search_files:
            temp_similarities_for_searching_file = {}
            for tag in soup.find_all('h4'):
                if 'Matches sorted by maximum similarity (' in tag.contents:
                    for tr_tag in tag.parent.find_all('tr'):
                        if search_file in tr_tag.contents[0].contents[0]:
                            only_similarities = tr_tag.contents[2:]
                            for one_similarity in only_similarities:
                                original_file_name = one_similarity.contents[0].contents[0]
                                original_result_link = one_similarity.contents[0].get("href")
                                similarity = one_similarity.contents[2].contents[0]
                                temp_similarities_for_searching_file[
                                    self.file_relation[original_file_name[:original_file_name.find("_")]]] = [
                                    similarity, original_result_link]
            results[search_file] = temp_similarities_for_searching_file

        return results

    def clean_working_envs(self, temp_working_path):
        shutil.rmtree(temp_working_path)

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
