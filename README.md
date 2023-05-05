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
or
yarn add expo-stt
```

### Configure for iOS

Run `npx pod-install` after installing the npm package.
## Add missing permissions for iOS

I have trouble with [expo plugin setup](https://docs.expo.dev/modules/config-plugin-and-native-module-tutorial/#4-creating-a-new-config-plugin) so you need to manually add these permissions key to `Info.plist` in `ios` project

Android don't need any permission even `RECORD_AUDIO`

```
  <key>NSMicrophoneUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your microphone</string>
  <key>NSSpeechRecognitionUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your speech recognition</string>
```

In case I could resolve the plugin config as mentioned above, add following key to plugins of `app.json`
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

Register some listeners
```
  import * as ExpoStt from 'expo-stt';

  useEffect(() => {
    const onSpeechStart = ExpoStt.addOnSpeechStartListener(() => {
      setSpokenText("");
      setError(undefined);
      setRecognizing(true);
    });

    const onSpeechResult = ExpoStt.addOnSpeechResultListener(({ value }) => {
      setSpokenText(value.join());
    });

    const onSpeechCancelled = ExpoStt.addOnSpeechCancelledListener(() => {
      setRecognizing(false);
    });

    const onSpeechError = ExpoStt.addOnSpeechErrorListener(({ cause }) => {
      setError(cause);
      setRecognizing(false);
    });

    const onSpeechEnd = ExpoStt.addOnSpeechEndListener(() => {
      setRecognizing(false);
    });

    return () => {
      onSpeechStart.remove();
      onSpeechResult.remove();
      onSpeechCancelled.remove();
      onSpeechError.remove();
      onSpeechEnd.remove();
    };
  }, []);
```

There are some functions available to call such as:

* ExpoStt.startSpeech()
* ExpoStt.stopSpeech()
* ExpoStt.cancelSpeech()
* ExpoStt.destroySpeech()
* ExpoStt.requestRecognitionPermission()
* ExpoStt.checkRecognitionPermission()

Take a look into `example/App.tsx` for completed example

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).

## Author

I am looking for a job as a React native developer, remote work is preferred.

Check out my CV: https://anhtuank7c.github.io
