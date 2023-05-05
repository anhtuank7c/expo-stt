import { setSpeechRecognitionInfoPlist } from "../withSpeechRecognition";

describe(setSpeechRecognitionInfoPlist, () => {
  it(`adds defaults to the plist`, () => {
    expect(setSpeechRecognitionInfoPlist({}, {})).toStrictEqual({
      NSMicrophoneUsageDescription:
        "Allow $(PRODUCT_NAME) to access your microphone",
      NSSpeechRecognitionUsageDescription:
        "Allow $(PRODUCT_NAME) to access your speech recognition",
    });
  });

  it(`uses custom messages`, () => {
    expect(
      setSpeechRecognitionInfoPlist(
        {
          NSMicrophoneUsageDescription: "foobar",
        },
        {
          microphonePermission: "yolo",
        }
      )
    ).toStrictEqual({
      NSMicrophoneUsageDescription: "foobar",
      NSSpeechRecognitionUsageDescription: "foobar",
    });
  });

  it(`disables defaults explicitly`, () => {
    expect(
      setSpeechRecognitionInfoPlist(
        {
          NSMicrophoneUsageDescription: "foobar",
          NSSpeechRecognitionUsageDescription: "foobar",
        },
        {
          microphonePermission: false,
          speechRecognitionPermission: false,
        }
      )
    ).toStrictEqual({});
  });
});
