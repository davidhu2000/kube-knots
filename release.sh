# automate release process locally
# this script should be replaces by github actions

npm version patch
yarn tauri build --target aarch64-apple-darwin
yarn tauri build --target x86_64-apple-darwin
version=$(grep version package.json | awk -F \" '{print $4}')

echo "releasing version: $version"
gh release create $version \
 "src-tauri/target/x86_64-apple-darwin/release/bundle/dmg/kube-knots_${version}_x64.dmg"  \ 
 "src-tauri/target/aarch64-apple-darwin/release/bundle/dmg/kube-knots_${version}_aarch64.dmgg"  \ 
 --generate-notes
