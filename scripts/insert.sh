#!/bin/bash

REPO_DIR=$1
MAIN_FILE=$2
ENDPOINT=$3
USER=$4
PASSWORD=$5
COMMIT=$6

if [ -z $REPO_DIR ] ; then
    echo "No repo dir specified"
    exit 1
fi

if [ -z $MAIN_FILE ] ; then
    echo "No main file specified"
    exit 1
fi

if [ -z $COMMIT ] ; then
    echo "No commit sha specified"
    exit 1
fi

if [ -z $ENDPOINT ] ; then
    echo "No endpoint specified"
    exit 1
fi

if [ -z $USER ] ; then
    echo "No user specified"
    exit 1
fi

if [ -z $PASSWORD ] ; then
    echo "No password specified"
    exit 1
fi

echo "Inserting commit $COMMIT..."

ORIGINAL_DIR=$PWD

git stash
git checkout $COMMIT
git submodule update

if [ $? -ne 0 ] ; then
    echo "Commit does not exist!"
    exit 1
fi

DATETIME_LOGSTRING=$(git log -n1 --pretty=format:"%ad" --date=iso)

IFS=' '
read -ra DATETIME_ELMS <<< "$DATETIME_LOGSTRING"
DATE=${DATETIME_ELMS[0]}
TIME=${DATETIME_ELMS[1]}
ZONE=${DATETIME_ELMS[2]}
DATETIME="${DATE}T${TIME}${ZONE}"
DATETIME="${DATETIME//+/%2B}"
DATETIME="${DATETIME//:/%3A}"

WORDS=$(texcount -inc $MAIN_FILE.tex | grep "Words in text:" | awk 'END{print $4}')

latexmk -pdf -halt-on-error $MAIN_FILE.tex

if [ $? -ne 0 ] ; then
    echo "Latex file does not compile!"
    exit 1
fi

PAGES=$(pdftk $MAIN_FILE.pdf dump_data output | grep -i NumberOfPages | awk '{print $2}')

TOKEN_RESPONSE=$(curl -s -X 'POST' \
  $ENDPOINT/token \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "grant_type=&username=$USER&password=$PASSWORD&scope=&client_id=&client_secret="
)

if [[ "$TOKEN_RESPONSE" != *"access_token"* ]] ; then
    echo "Could not get token!"
    exit 1
fi

TOKEN=$(echo $TOKEN_RESPONSE | json access_token)

RESULT=$(curl -s -X 'POST' \
  "$ENDPOINT/commit?commit_sha=$COMMIT&commit_datetime=$DATETIME&words=$WORDS&pages=$PAGES" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d ''
)

git stash pop
git checkout main
cd $ORIGINAL_DIR