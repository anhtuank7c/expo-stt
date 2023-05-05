import * as ExpoStt from "expo-stt";
import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  View,
  ScrollView,
  ViewStyle,
  StatusBar,
} from "react-native";

import styles from "./styles";

const btnPresets = {
  info: { backgroundColor: "gray" } as ViewStyle,
  danger: { backgroundColor: "red" } as ViewStyle,
  warning: { backgroundColor: "yellow" } as ViewStyle,
  success: { backgroundColor: "green" } as ViewStyle,
};

type ButtonPresets = keyof typeof btnPresets;
type ButtonProps = TouchableOpacityProps & {
  title: string;
  preset: ButtonPresets;
};
function Button(props: ButtonProps) {
  const { title, preset, style, ...otherProps } = props;
  const btnStyle = [styles.btn, btnPresets[preset], style];
  return (
    <TouchableOpacity {...otherProps} style={btnStyle}>
      <Text style={styles.txtBtn}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [spokenText, setSpokenText] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [recognizing, setRecognizing] = useState(false);

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

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <StatusBar barStyle="dark-content" />
      <Text style={styles.txtHeader}>Unofficial Expo STT</Text>
      {recognizing && <Text style={styles.txtResult}>Say something cool</Text>}
      <View style={styles.resultContainer}>
        <Text style={styles.txtResult}>{spokenText}</Text>
        {error ? <Text style={styles.txtError}>{error}</Text> : null}
      </View>
      <Button
        preset="success"
        title="Recognize speech"
        onPress={() => ExpoStt.startSpeech()}
      />
      <Button
        disabled={!recognizing}
        preset="warning"
        title="Stop speech"
        onPress={() => ExpoStt.stopSpeech()}
      />
      <Button
        disabled={!recognizing}
        preset="warning"
        title="cancel speech"
        onPress={() => ExpoStt.cancelSpeech()}
      />
      <Button
        disabled={!recognizing}
        preset="danger"
        title="Destroy speech"
        onPress={() => ExpoStt.destroySpeech()}
      />
      <Button
        preset="info"
        title="Ask speech recognition permission"
        onPress={() =>
          ExpoStt.requestRecognitionPermission()
            .then((rest) => {
              console.log("request permission", rest);
            })
            .catch((e) => console.warn(e))
        }
      />
      <Button
        preset="info"
        title="Check speech recognition permission"
        onPress={() =>
          ExpoStt.checkRecognitionPermission()
            .then((rest) => {
              console.log("Check permission", rest);
            })
            .catch((e) => console.warn(e))
        }
      />
      <Text style={styles.txtCaption}>
        "Cancel/Stop/Destroy/requestRecognitionPermission/checkRecognitionPermission
        functions will never work on Android (no permission needed). I just
        unify the APIs with iOS one. The mechanism is way different so if you
        have any idea to improve it, please submit a new pull request."
      </Text>
    </ScrollView>
  );
}
