REPO_SSH=$1
INSERT_SCRIPT=$2
MAIN_FILE=$3
ENDPOINT=$4
USER=$5
PASSWORD=$6

if [ -z "$REPO_SSH" ] ; then
    echo "Repo directory not specified"
    exit 1
fi

DIR_NAME=working_directory
git clone $REPO_SSH $DIR_NAME

cd $DIR_NAME
git submodule update --init
COMMITS=$(git log | grep "commit [a-z0-9]*" | awk '{print $2}')

for COMMIT in $COMMITS
do
    $INSERT_SCRIPT $DIR_NAME $MAIN_FILE $ENDPOINT $USER $PASSWORD $COMMIT
done

rm -rf $DIR_NAME