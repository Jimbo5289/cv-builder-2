#!/bin/bash

# This script is designed to work with Render's server/ $ prefix
# It changes to the current directory and runs the render:direct npm script

cd "$(dirname "$0")" # Move to the directory where this script is located
npm run render:direct 