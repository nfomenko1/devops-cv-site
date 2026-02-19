#!/usr/bin/env bash
set -euo pipefail

cd /root/web-site

echo "== Repo status (before) =="
git rev-parse --short HEAD
git status -sb

echo "== Fetch latest =="
git fetch origin

echo "== Reset to origin/main =="
git reset --hard origin/main

echo "== Repo status (after) =="
git rev-parse --short HEAD
git status -sb

echo "== Deploy: build & up =="
docker compose up -d --build

echo "== Running containers =="
docker compose ps
