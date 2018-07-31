# Quick Start Guide

## Linux
### If you already installed JRE and conda
If you already installed JRE and conda, please download the [install_MDP_tool_without_installing_conda.sh](https://raw.githubusercontent.com/Weak-Chicken/misconduct_detection_project/master/documents/Quick%20Start/install_MDP_tool_without_installing_conda.sh) script.

Then, put the script at where you wish to install the tool, and run the script:
```bash
chmod +x install_MDP_tool_without_installing_conda.sh

./install_MDP_tool_without_installing_conda.sh
```

*NOTICE:* If you have not installing miniconda in default path or you are using Anaconda, you may need to change the install script parameters. The usage of this script:

```bash
./install_MDP_tool_without_installing_conda.sh conda_path/envs/MDP install_path
```

For example, if you downloaded the script in `~/MDP/` and installed miniconda in `~/whaterverpath/miniconda3/`. Then you should install with following command:

```bash
./install_MDP_tool_without_installing_conda.sh ~/whaterverpath/miniconda3/envs/MDP 
```

This will install the tool to `~/MDP/`. So, you can use:
```bash
./install_MDP_tool_without_installing_conda.sh ~/whaterverpath/miniconda3/envs/MDP ~/some/other/path/
```
To install the tool to `~/some/other/path/`.

And If you see the finish message without any error, you are good to go.

If you see any error occurs, please create an issue on [this page](https://github.com/Weak-Chicken/misconduct_detection_project/issues). However, if you wish to solve it immediately, please refer the installation manual.

### If you have not installed JRE *AND* conda
If you have not installed JRE *AND* conda, please first go to java page download and install [java](https://java.com/en/). Then, please download the [install_MDP_tool_with_installing_conda.sh](https://raw.githubusercontent.com/Weak-Chicken/misconduct_detection_project/master/documents/Quick%20Start/install_MDP_tool_with_installing_conda.sh) script.

Then, put the script at where you wish to install the tool, and run the script:
```bash
chmod +x install_MDP_tool_with_installing_conda.sh

./install_MDP_tool_with_installing_conda.sh
```

Specially, you might be asked to choose the install settings for the miniconda. Please *KEEP* the default setting! Or the script might get errors.

If you see any error occurs, please create an issue on [this page](https://github.com/Weak-Chicken/misconduct_detection_project/issues). However, if you wish to solve it immediately, please refer the installation manual.

## macOS
### If you already installed JRE and conda

### If you have not installed JRE *AND* conda

## Windows
### If you already installed JRE and conda

### If you have not installed JRE *AND* conda
