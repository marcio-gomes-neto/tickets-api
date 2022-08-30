#!/bin/bash
set -e

MS_PATH="/api/service/$ms/"

yarn install

cd /api/global
yarn link
yarn install

cd ..

yarn link global-database

cd $MS_PATH

yarn install
yarn start-prd