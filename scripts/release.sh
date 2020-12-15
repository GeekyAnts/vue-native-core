set -e

CURRENT_BRANCH=$(git branch --show-current)
if [ $CURRENT_BRANCH != "master" ]; then
  echo "This script can only be run in the master branch. Exiting..."
  exit 1
fi

# get the version number from the user
read -e -p "Enter the new Vue Native version: " VERSION
if [[ -z $VERSION ]]; then
  echo "No version entered. Exiting..."
  exit 0
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $VERSION ..."

  # bump package versions
  # packages:
  # - vue-native-core
  # - vue-native-helper
  # - vue-native-scripts
  # - vue-native-template-compiler

  cd packages/vue-native-core
  npm version $VERSION
  cd -

  cd packages/vue-native-helper
  npm version $VERSION
  cd -

  cd packages/vue-native-scripts
  npm version $VERSION
  cd -

  cd packages/vue-native-template-compiler
  npm version $VERSION
  cd -

  # build
  # the build needs to be generated after the version bump
  # because the Vue version comes from packages/vue-native-core/package.json
  # refer to scripts/config.js
  VERSION=$VERSION npm run build

  # commit
  git add -A
  git commit -m "[build] $VERSION"

  # publish packages
  # vue-native-core has already been published by np
  # packages:
  # - vue-native-core
  # - vue-native-helper
  # - vue-native-scripts
  # - vue-native-template-compiler

  cd packages/vue-native-core
  npm publish
  cd -

  cd packages/vue-native-helper
  npm publish
  cd -

  cd packages/vue-native-scripts
  npm publish
  cd -

  cd packages/vue-native-template-compiler
  npm publish
  cd -

  # Update version in main package.json and commit
  npm version $VERSION

  # Push the tags and version update
  git push origin v$VERSION
  git push origin master

  echo "\nPublished v$VERSION!"
fi
