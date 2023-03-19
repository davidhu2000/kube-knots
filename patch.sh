cd app/kube-knots
yarn version patch

version=$(cat package.json | jq .version -r)
git add -A
git commit -m $version 

git tag "v$version"
