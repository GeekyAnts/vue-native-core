set -e

# check if np is installed
# if not, prompt the user to install it
np_version=$(np --version)
if [[ $? -eq 0 ]]; then
  echo "Using np version: " $np_version
else
  echo "np is not installed"
  read -e -p "Install globally? (Executes: npm install -global np) [y/n]" REPLY
  if [[ $REPLY =~ ^(y|yes)$ ]]; then
    npm install -global np
  elif [[ $REPLY =~ ^(n|no)$ ]]; then
    echo "Exiting..."
    exit 1
  fi
fi

# get the version number from the user
read -e -p "Enter the new version" VERSION
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
  # refer to build/config.js
  VERSION=$VERSION npm run build

  # commit
  git add -A
  git commit -m "[build] $VERSION"

  # use np to create release with VERSION and publish vue-native-core
  # you MUST be in the master branch to do this
  # if it fails, then the last commit is reset and the script exits
  # TODO: add tests and remove --yolo
  np --no-yarn --contents packages/vue-native-core --yolo $VERSION || { git reset --soft HEAD~1; exit 1; }

  # publish packages
  # vue-native-core has already been published by np
  # packages:
  # - vue-native-helper
  # - vue-native-scripts
  # - vue-native-template-compiler

  cd packages/vue-native-helper
  npm publish
  cd -

  cd packages/vue-native-scripts
  npm publish
  cd -

  cd packages/vue-native-template-compiler
  npm publish
  cd -

fi
