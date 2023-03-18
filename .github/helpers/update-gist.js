const gistContent = {
  version: "",
  notes: "",
  pub_date: "",
  platforms: {
    "darwin-x86_64": {
      signature: "",
      url: "https://github.com/davidhu2000/kube-knots/releases/download/v0.0.31/Kube.Knots.app.tar.gz",
    },
    "darwin-aarch64": {
      signature: "",
      url: "https://github.com/davidhu2000/kube-knots/releases/download/v0.0.31/Kube.Knots.app.tar.gz",
    },
    "linux-x86_64": {
      signature: "",
      url: "https://github.com/davidhu2000/kube-knots/releases/download/v0.0.31/kube-knots_0.0.31_amd64.AppImage.tar.gz",
    },
    "windows-x86_64": {
      signature: "",
      url: "https://github.com/davidhu2000/kube-knots/releases/download/v0.0.31/Kube.Knots_0.0.31_x64_en-US.msi.zip",
    },
  },
};

module.exports = async ({ github, context }) => {
  console.log(process.env.releaseId);
  // console.log(Object.keys(github.rest.repos));

  const params = {
    release_id: process.env.releaseId,
    owner: context.repo.owner,
    repo: context.repo.repo,
  };

  const { data: release } = await github.rest.repos.getRelease(params);
  const { data: assets } = await github.rest.repos.listReleaseAssets(params);

  console.log(`Release ${release.name} (${release.tag_name}) has ${assets.length} assets:`);
  assets.forEach((asset) => {
    console.log(asset);
    console.log(asset.name);
  });

  // asset.browser_download_url - URL to download the asset
};
