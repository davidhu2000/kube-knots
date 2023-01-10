# automate release process locally
# this script should be replaces by github actions

yarn version patch
yarn tauri build
version=$(grep version package.json | awk -F \" '{print $4}')

echo "releasing version: $version"
gh release create $version "src-tauri/target/release/bundle/dmg/Kube Knots_${version}_x64.dmg" --generate-notes
