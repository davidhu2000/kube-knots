# automate release process locally
# this script should be replaces by github actions

npm version patch
yarn tauri build --target aarch64-apple-darwin
yarn tauri build --target x86_64-apple-darwin
version=$(grep version package.json | awk -F \" '{print $4}')

echo "releasing version: $version"

macos_intel_path="src-tauri/target/x86_64-apple-darwin/release/bundle/dmg"
macos_m1_path="src-tauri/target/aarch64-apple-darwin/release/bundle/dmg"
gh release create $version "$macos_intel_path/kube-knots_${version}_x64.dmg" "$macos_m1_path/kube-knots_${version}_aarch64.dmg" --generate-notes
