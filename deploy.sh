#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build-only

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# Deploying to https://luigiventuriie.github.io/vue-ennesimo-ecommerce/
git push -f git@github.com:luigiventuriie/vue-ennesimo-ecommerce.git main:gh-pages

cd -
