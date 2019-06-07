if [[ -n $(git status --porcelain) ]]; then echo "repo is not checked in fully. Try again."; exit 1; fi
rm -rf dist/*
grunt

aws s3 sync --profile=nescaum dist/ s3://ma-map-nescaum-ccsc-dataservices --acl public-read

rm -rf dist/*

echo "Avaialable at:   https://ma-map-nescaum-ccsc-dataservices.s3.amazonaws.com/map_viewer.html"
