#!/bin/bash

export PATH="$PATH:/home/ntnu/.nvm/versions/node/v20.7.0/bin"

/home/ntnu/Documents/bppv-scripts/kill.sh

python3 /python/app.py &

yarn dev &

cd /home/ntnu/Documents/GitHub/BPPV
yarn dev &

read -p "Press Enter to exit"
