# expo-stt

Unofficial Speech To Text module for Expo which supported iOS and Android

This module just support iOS and Android platforms.

So sorry that I am unemployed and don't have much money to spend more time to make this module work also for web.

If you still want to support web platform, please follow this article https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API

![Demo speech to text](demo.png "Demo Speech To Text")

# API documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/stt.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/stt/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/versions/latest/introduction/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install expo-stt
```

### Configure for iOS

Run `npx pod-install` after installing the npm package.
## Custom Permission strings

Add this line to the plugins under `app.json` to custom permissions string for iOS. We don't need any extra permission for Android.

```
  "plugins": [
    [
      "expo-stt",
      {
        "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
        "speechRecognitionPermission": "Allow $(PRODUCT_NAME) to access your speech recognition"
      }
    ]
  ]
```

## Usage

Please go into `example/App.tsx` to follow the instruction.

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).

## Author

I am looking for a job as a React native developer, remote work is preferred.

Check out my CV: https://anhtuank7c.github.io
