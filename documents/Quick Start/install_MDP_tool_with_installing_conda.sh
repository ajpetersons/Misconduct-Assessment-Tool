#!/usr/bin/env bash
echo "name: MDP" >> environment.yml
echo "channels:" >> environment.yml
echo "  - defaults" >> environment.yml
echo "dependencies:" >> environment.yml
echo "  - certifi=2018.4.16=py37_0" >> environment.yml
echo "  - pip=10.0.1=py37_0" >> environment.yml
echo "  - python=3.7.0" >> environment.yml
echo "  - setuptools=39.2.0=py37_0" >> environment.yml
echo "  - wheel=0.31.1=py37_0" >> environment.yml
echo "  - git=2.17.0" >> environment.yml
echo "  - pip:" >> environment.yml
echo "    - beautifulsoup4==4.6.1" >> environment.yml
echo "    - django==2.0.7" >> environment.yml
echo "    - pytz==2018.5" >> environment.yml
echo "prefix: C:\Users\YuchengXie\Anaconda3\envs\MDP" >> environment.yml
echo "" >> environment.yml

wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh

rm Miniconda3-latest-Linux-x86_64.sh
echo "export PATH=\""\$PATH":$HOME/miniconda3/bin\"" >> ~/.benv
source ~/.benv

conda_root="$HOME/miniconda3/envs/MDP"
install_pos="$(pwd)"

echo "Your conda root is:"
echo $conda_root
echo "Your installation path is:"
echo $install_pos

conda env create -f environment.yml
source activate MDP

git clone https://github.com/Weak-Chicken/misconduct_detection_project misconduct_detection_project/

cd $conda_root

mkdir -p ./etc/conda/activate.d
mkdir -p ./etc/conda/deactivate.d

echo -e '#!/bin/sh\n' >> ./etc/conda/activate.d/env_vars.sh
echo "export SECRET_KEY=changeThisIfYouNeedToDeploy" >> ./etc/conda/activate.d/env_vars.sh
echo -e '#!/bin/sh\n' >> ./etc/conda/deactivate.d/env_vars.sh
echo 'unset SECRET_KEY' >> ./etc/conda/deactivate.d/env_vars.sh

source deactivate MDP
source activate MDP

cd $install_pos
rm environment.yml

cd $install_pos/misconduct_detection_project

timeout 3 python manage.py runserver
python manage.py migrate

echo "=============================================="
echo "Installation finished!"
echo "use 'source activate MDP' to activate the virtual environment"
echo "cd into the tool folder, e.g. 'cd misconduct_detection_project'"
echo "and use 'python manage.py runserver' to begin"
