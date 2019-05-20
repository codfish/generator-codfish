#!/usr/bin/env bash

# $1 = github username
# $2 = reponame
# $3 = description

# Check if repo already exists

STATUS=$(curl -s -o /dev/null -w '%{http_code}' https://github.com/$1/$2)
if [ $STATUS -eq 200 ]; then
  exit 0
else
  echo "Creating a new repository in Github..."
fi

# Create a new repository in Github

DATA='{"name":"'"$2"'","description":"'"$3"'"}'
TOKEN=${GITHUB_TOKEN:-$GH_TOKEN}

if [ -z "$TOKEN" ]; then
  printf "\nYou need to enter your Github password. If you have 2FA on, provide a token instead.\n"
  curl -u $1 https://api.github.com/user/repos -d $DATA 1> /dev/null
else
  curl -H "Authorization: Bearer $TOKEN" https://api.github.com/user/repos -d $DATA 1> /dev/null
fi


