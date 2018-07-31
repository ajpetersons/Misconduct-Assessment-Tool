#!/usr/bin/env bash
conda_root=${1:-~/miniconda3/envs/MDP}
install_pos=${2:-$(pwd)}

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
echo "export SECRET_KEY=#0@7rf_8hf#3__b=5m_1$q5u_hb+rjs4j!4hsnr-6kqdfwztfj" >> ./etc/conda/activate.d/env_vars.sh
echo -e '#!/bin/sh\n' >> ./etc/conda/deactivate.d/env_vars.sh
echo 'unset MLP_DATA_DIR' >> ./etc/conda/deactivate.d/env_vars.sh

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
echo "and use 'python manage.py runserver' to begin"
