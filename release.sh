# automate release process locally
# this script should be replaces by github actions

yarn tauri build
yarn version patch
version=$(grep version package.json | awk -F \" '{print $4}')

echo "releasing version: $version"
gh release create $version "src-tauri/target/release/bundle/dmg/Kube Knots_$version_x64.dmg" --generate-notes
