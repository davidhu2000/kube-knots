---
sidebar_position: 5
---

# Telemetry

This app collect some basic information about your app usage. [umami](https://umami.is/) is used, as it is open source and privacy-focused. From their [FAQ](https://umami.is/docs/faq) regarding GDPR compliance.

> Yes, Umami does not collect any personally identifiable information and anonymizes all data collected. Users cannot be identified and are never tracked across websites.

You can view the data [here](https://analytics.umami.is/share/GMYNZUUE64wQhw3C/kube-knots)

The payload is a based64 encoded JSON object with the following data:

```json
{
  "alg":"HS256",
  "typ":"JWT"
}
{
  "id":"uuid",
  "websiteId":"a160693a-4f3d-44cd-8d68-eeb87dd8bc4a",
  "hostname":"localhost",
  "browser":"ios-webview",
  "os":"Mac OS",
  "device":"laptop",
  "screen":"1440x900",
  "language":"en-US",
  "country":"US",
  "iat":1000000000
}
```

The custom metric collected at the moment is the application version running.

You can view the code in [`app/kube-knots/src/telemetry.ts`](https://github.com/davidhu2000/kube-knots/blob/main/app/kube-knots/src/telemetry.ts).

```ts
const appVersion = await getVersion();
window.umami(`v${appVersion}`);
```
