#!/usr/bin/env bash

set -e

# Build it

npm run build

# Ship it

if [ "${1}" == "dev" ]; then
  echo "deploying to dev"
  CLOUDFRONT_DISTRIBUTION_ID="EC5JVQ58H2W7"
  CLOUDFRONT_S3_BUCKET="s3://cf-tb-vocabtrainer-dev/"
elif [ "${1}" == "staging" ]; then
  echo "deploying to staging"
  CLOUDFRONT_DISTRIBUTION_ID="E1M0QWW0RLS95E"
  CLOUDFRONT_S3_BUCKET="s3://cf-tb-vocabtrainer-staging/"
elif [ "${1}" == "prod" ]; then
  echo "deploying to prod"
  CLOUDFRONT_DISTRIBUTION_ID="E33AUQQRHN2TPO"
  CLOUDFRONT_S3_BUCKET="s3://cf-tb-vocabtrainer/"
else
  echo "Expected dev or prod as argument"
  exit 0
fi

aws s3 cp ./dist/vocitrainer $CLOUDFRONT_S3_BUCKET --recursive --profile taskbase-cloudfront-admin
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --profile taskbase-cloudfront-admin
echo "Done!"
