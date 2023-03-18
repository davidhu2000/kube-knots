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

async function getFileSignature(fetch, downloadUrl) {
  const response = await fetch(downloadUrl);
  return await response.text();
}

function parseReleaseNotes(releaseNotesRaw) {
  const lines = releaseNotesRaw.split("\n");

  const features = [];
  const bugfixes = [];

  for (const line of lines) {
    const message = line.replace(/by @.+/, "").replace(/\* \w+:/, "");
    if (line.startsWith("* feat")) {
      features.push(message);
    }
    if (line.startsWith("* fix")) {
      bugfixes.push(message);
    }
  }

  const notes = [];

  if (features.length > 0) {
    notes.push(`Features: ${features.join(", ")}`);
  }

  if (bugfixes.length > 0) {
    notes.push(`Bugfixes: ${bugfixes.join(", ")}`);
  }

  if (notes.length === 0) {
    notes.push("No notable changes");
  }

  return notes.join(". ");
}

module.exports = async ({ github, context, fetch, core }) => {
  console.log(process.env.releaseId);

  const params = {
    release_id: process.env.releaseId,
    owner: context.repo.owner,
    repo: context.repo.repo,
  };

  const { data: release } = await github.rest.repos.getRelease(params);
  const { data: assets } = await github.rest.repos.listReleaseAssets(params);

  gistContent.version = release.tag_name;
  gistContent.notes = parseReleaseNotes(release.body);
  gistContent.pub_date = release.published_at;

  console.log(`Release ${release.name} (${release.tag_name}) has ${assets.length} assets:`);

  for (const asset of assets) {
    console.log(`>>> Processing: ${asset.name}`);

    // macos x86_64 and aarch64, maybe split between two archs in the future
    if (asset.name.endsWith(".app.tar.gz")) {
      gistContent.platforms["darwin-x86_64"].url = asset.browser_download_url;
      gistContent.platforms["darwin-aarch64"].url = asset.browser_download_url;
    }
    if (asset.name.endsWith(".app.tar.gz.sig")) {
      const signature = await getFileSignature(fetch, asset.browser_download_url);
      gistContent.platforms["darwin-x86_64"].signature = signature;
      gistContent.platforms["darwin-aarch64"].signature = signature;
    }

    // linux x86_64
    if (asset.name.endsWith(".AppImage.tar.gz")) {
      gistContent.platforms["linux-x86_64"].url = asset.browser_download_url;
    }

    if (asset.name.endsWith(".AppImage.tar.gz.sig")) {
      const signature = await getFileSignature(fetch, asset.browser_download_url);
      gistContent.platforms["linux-x86_64"].signature = signature;
    }

    // windows x86_64
    if (asset.name.endsWith(".msi.zip")) {
      gistContent.platforms["windows-x86_64"].url = asset.browser_download_url;
    }
    if (asset.name.endsWith(".msi.zip.sig")) {
      const signature = await getFileSignature(fetch, asset.browser_download_url);
      gistContent.platforms["windows-x86_64"].signature = signature;
    }

    console.log(`*** Done: ${asset.name}`);
  }

  console.log(gistContent);

  const response = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${process.env.gistToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      files: {
        "update.json": { content: JSON.stringify(gistContent) },
      },
      description: "kube knots updater",
    }),
  });

  if (response.ok) {
    console.log("Gist updated successfully");
  } else {
    console.log("Gist update failed");
    core.setFailed("Gist update failed");
  }
};
