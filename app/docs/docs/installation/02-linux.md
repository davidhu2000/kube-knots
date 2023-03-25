# Linux

The app bundle is built using ubuntu 20.04, so it should work on any newer distributions. See tauri [docs](https://tauri.app/v1/guides/building/linux#limitations) for potential issues with running on older distributions.

## .AppImage

AppImage is bundled with all the necesary dependencies, so it should work on most linux distribution. You simply need to make the file executeable

```bash
mv kube-knots_X.Y.Z_amd64.AppImage kube-knots.AppImage # optional: just making the name friendlier
chmod a+x ./kube-knots.AppImage
```

This however does mean the file size is larger compared to the .deb version.

## .deb

To use the `.deb` file, you need to make sure the correct dependencies are installed.

```bash
apt-get update
apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf
```

You may need to run the following command to fix any broken dependencies

```bash
apt install --fix-broken -y
```

Then you can run

```bash
dpkg -i kube-knots_X.Y.Z_amd64.deb
```

and finally

```bash
kube-knots
```

to launch the app
