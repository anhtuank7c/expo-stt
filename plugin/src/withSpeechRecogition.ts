import {
  ConfigPlugin,
  createRunOncePlugin,
  InfoPlist,
  withInfoPlist,
} from "@expo/config-plugins";

const pkg = require("expo-image-picker/package.json");

const MICROPHONE_USAGE = "Allow $(PRODUCT_NAME) to access your microphone";
const SPEECHRECOGNITION_USAGE =
  "Allow $(PRODUCT_NAME) to access your speech recognition";

type Props = {
  speechRecognitionPermission?: string | false;
  microphonePermission?: string | false;
};

export function setSpeechRecognitionInfoPlist(
  infoPlist: InfoPlist,
  { speechRecognitionPermission, microphonePermission }: Props
): InfoPlist {
  if (speechRecognitionPermission === false) {
    delete infoPlist.NSSpeechRecognitionUsageDescription;
  } else {
    infoPlist.NSSpeechRecognitionUsageDescription =
      speechRecognitionPermission ||
      infoPlist.NSSpeechRecognitionUsageDescription ||
      SPEECHRECOGNITION_USAGE;
  }
  if (microphonePermission === false) {
    delete infoPlist.NSMicrophoneUsageDescription;
  } else {
    infoPlist.NSMicrophoneUsageDescription =
      microphonePermission ||
      infoPlist.NSMicrophoneUsageDescription ||
      MICROPHONE_USAGE;
  }
  return infoPlist;
}

const withSpeechRecogition: ConfigPlugin<Props | void> = (
  config,
  { speechRecognitionPermission, microphonePermission } = {}
) => {
  config = withInfoPlist(config, (config) => {
    config.modResults = setSpeechRecognitionInfoPlist(config.modResults, {
      speechRecognitionPermission,
      microphonePermission,
    });
    return config;
  });

  return config;
};

export default createRunOncePlugin(withSpeechRecogition, pkg.name, pkg.version);
