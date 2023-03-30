#!/usr/bin/env bash

# exit immediately if a command fails
set -e

echo "🚫💩 Running pretty quick"
npx pretty-quick --staged

echo "🚫🤫 Running git-secrets"
git secrets --pre_commit_hook -- "$@"

echo "✅  Everything is good to go!"
