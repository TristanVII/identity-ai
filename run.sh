#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/AspireAppHost"
exec dotnet run
