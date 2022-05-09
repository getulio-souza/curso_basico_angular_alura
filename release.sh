#!/bin/bash

export GIT_MERGE_AUTOEDIT=no

# recover target version from git
branch="$(git rev-parse --abbrev-ref HEAD)"
version="$(echo $branch | grep -oP 'release/\K.*')"
if [ -z $version ]
then
  version="$(echo $branch | grep -oP 'hotfix/\K.*')"
fi
if [ -z $version ]
then
  read -p "ABORTING RELEASE: please run this within a release or hotfix branch!"
  exit -1
fi
echo
echo Running release for version $version...

trap "echo; read -p \"ERROR EXECUTING SCRIPT\"; exit -2" ERR




echo
echo Updating package.json with version extracted from git branch
echo
echo npm --no-git-tag-version --allow-same-version version $version 
npm --no-git-tag-version --allow-same-version version $version

echo
echo Using npm run build to build the projetc to check if everything is ok
echo
echo npm run clean
npm run clean
echo npm run build
npm run build

echo
echo Commiting package.json with version extracted from git branch
echo
echo git commit -a -m "Updating package.json with version extracted from git branch"
git commit -a -m "Updating package.json with version extracted from git branch"

echo
echo Merging changes into master and tagging
echo
echo git checkout master
git checkout master
echo git merge --no-ff -m \"Merge $branch into master\" $branch
git merge --no-ff -m "Merge $branch into master" $branch
echo git tag -a $version -m \"Tag $version\"
git tag -a $version -m "Tag $version"
echo git checkout $branch
git checkout $branch

echo
echo Updating package.json with new snapshot version \(in develop branch\)
# captures version using semver and runs command twice on purpose to make sure we get it ok
trap "echo; echo \"Installing 'semver'...\"; npm i -g semver; echo" ERR
snapshot_version="$(semver -i $version)-SNAPSHOT"
snapshot_version="$(semver -i $version)-SNAPSHOT"
trap "echo; read -p \"ERROR EXECUTING SCRIPT\"; exit -2" ERR
echo
echo npm --no-git-tag-version version $snapshot_version 
npm --no-git-tag-version version $snapshot_version
echo git commit -a -m "Updating package.json with new snapshot version"
git commit -a -m "Updating package.json with new snapshot version"

echo
echo Merging changes into develop
echo
echo git checkout develop
git checkout develop
echo git merge --no-ff -m \"Merge $branch into develop\" $branch
git merge --no-ff -m "Merge $branch into develop" $branch

echo
echo Deleting release branch
echo
echo git branch -d $branch
git branch -d $branch

echo
read -p "SUCCESS! Don't forget to push your changes to complete the release"
