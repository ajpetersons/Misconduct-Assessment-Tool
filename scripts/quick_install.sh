#!/usr/bin/env bash
echo "==================================================================="
echo "= Welcome to the Misconduct Assessment Tool Quick Install Script! ="
echo "==================================================================="
echo "Install Conda? [Y,n]"
read input
if [[ $input == "Y" || $input == "y" ]]; then
    wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
    bash Miniconda3-latest-Linux-x86_64.sh

    rm Miniconda3-latest-Linux-x86_64.sh
    echo "export PATH=\""\$PATH":$HOME/miniconda3/bin\"" >> ~/.benv
    source ~/.benv
else
        echo "don't do that"
fi

conda_root="$HOME/miniconda3/envs/mat"
install_pos="$(pwd)"

echo "Your conda root is:"
echo $conda_root
echo "Your installation path is:"
echo $install_pos

conda env create -f environment.yml
source activate mat

git clone https://github.com/iamstelios/Misconduct-Assessment-Tool

cd $conda_root

mkdir -p ./etc/conda/activate.d
mkdir -p ./etc/conda/deactivate.d

echo -e '#!/bin/sh\n' >> ./etc/conda/activate.d/env_vars.sh
echo "Enter the value for the SECRET_KEY environment variable:"
read secret
echo "export SECRET_KEY=$secret" >> ./etc/conda/activate.d/env_vars.sh
echo -e '#!/bin/sh\n' >> ./etc/conda/deactivate.d/env_vars.sh
echo 'unset SECRET_KEY' >> ./etc/conda/deactivate.d/env_vars.sh

source deactivate mat
source activate mat

cd $install_pos

cd $install_pos/Misconduct-Assessment-Tool

python manage.py migrate

echo "==================================================================="
echo "Installation finished!"
echo "Activate the virtual environment: $ source activate mat"
echo "Run the system: $ python manage.py runserver"
echo "==================================================================="
