REPO_DIR=$1
INSERT_SCRIPT=$2
MAIN_FILE=$3
ENDPOINT=$4
USER=$5
PASSWORD=$6

if [ -z "$REPO_DIR" ] ; then
    echo "Repo directory not specified"
    exit 1
fi

cd $REPO_DIR
COMMITS=$(git log | grep "commit [a-z0-9]*" | awk '{print $2}')

for COMMIT in $COMMITS
do
    echo $INSERT_SCRIPT $REPO_DIR $MAIN_FILE $ENDPOINT $USER $PASSWORD $COMMIT
    $INSERT_SCRIPT $REPO_DIR $MAIN_FILE $ENDPOINT $USER $PASSWORD $COMMIT
done