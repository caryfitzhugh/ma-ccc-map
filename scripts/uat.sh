rm -rf dist/*
grunt


aws s3 sync --profile=mass-uat dist/ s3://eea-usersworkspace/home/Cary.FitzHugh/mass-map --acl public-read
