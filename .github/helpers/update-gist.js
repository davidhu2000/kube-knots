module.exports = async ({ github }) => {
  console.log(process.env.releaseId);
  console.log(Object.keys(github.rest.repos));
  const { data: release } = await github.rest.repos.getRelease({
    release_id: process.env.releaseId,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  const { data: assets } = await github.rest.repos.listReleaseAssets({
    release_id: process.env.releaseId,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  console.log(`Release ${release.name} (${release.tag_name}) has ${assets.length} assets:`);
  assets.forEach((asset) => console.log(asset.name));
};
