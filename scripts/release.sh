if [[ -n $(git status --porcelain) ]]; then echo "repo is not checked in fully. Try again."; exit 1; fi
rm -rf dist/*
grunt

aws s3 sync --profile=nescaum dist/ s3://vt-nescaum-ccsc-dataservices

rm -rf dist/*
