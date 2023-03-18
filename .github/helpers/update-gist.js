let gistContent = {
  version: "",
  notes: "",
  pub_date: "",
  platforms: {
    "darwin-x86_64": {
      signature: "",
      url: "",
    },
    "darwin-aarch64": {
      signature: "",
      url: "",
    },
    "linux-x86_64": {
      signature: "",
      url: "",
    },
    "windows-x86_64": {
      signature: "",
      url: "",
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

  gistContent.version = release.tag_name;
  gistContent.notes = release.body;
  gistContent.pub_date = release.published_at;

  console.log(`Release ${release.name} (${release.tag_name}) has ${assets.length} assets:`);

  assets.forEach((asset) => {
    console.log(`>>> Processing: ${asset.name}`);
    console.log(asset.browser_download_url);

    // macos x86_64 and aarch64
    if (asset.name.endsWith(".app.tar.gz")) {
      gistContent.platforms["darwin-x86_64"].url = asset.browser_download_url;
      gistContent.platforms["darwin-aarch64"].url = asset.browser_download_url;
    }
    if (asset.name.endsWith(".app.tar.gz.sig")) {
      gistContent.platforms["darwin-x86_64"].signature = "TODO";
      gistContent.platforms["darwin-aarch64"].signature = "TODO";
    }

    // linux x86_64
    if (asset.name.endsWith(".AppImage.tar.gz")) {
      gistContent.platforms["linux-x86_64"].url = asset.browser_download_url;
    }

    if (asset.name.endsWith(".AppImage.tar.gz.sig")) {
      gistContent.platforms["linux-x86_64"].signature = "TODO";
    }

    // windows x86_64
    if (asset.name.endsWith(".msi.zip")) {
      gistContent.platforms["windows-x86_64"].url = asset.browser_download_url;
    }
    if (asset.name.endsWith(".msi.zip.sig")) {
      gistContent.platforms["windows-x86_64"].signature = "TODO";
    }
  });

  console.log(gistContent);
};
