#!/usr/bin/env bash

# exit immediately if a command fails
set -e

echo "🚫💩 Running pretty quick"
npx pretty-quick --staged

echo "✅  Everything is good to go!"
