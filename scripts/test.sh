rm -rf dist/*
grunt

aws s3 sync --profile=nescaum dist/ s3://staging.resilientma.org/map --acl public-read

rm -rf dist/*
