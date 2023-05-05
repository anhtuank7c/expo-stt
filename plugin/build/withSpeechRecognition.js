"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSpeechRecognitionInfoPlist = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const pkg = require("expo-stt/package.json");
const MICROPHONE_USAGE = "Allow $(PRODUCT_NAME) to access your microphone";
const SPEECHRECOGNITION_USAGE = "Allow $(PRODUCT_NAME) to access your speech recognition";
function setSpeechRecognitionInfoPlist(infoPlist, { speechRecognitionPermission, microphonePermission }) {
    if (speechRecognitionPermission === false) {
        delete infoPlist.NSSpeechRecognitionUsageDescription;
    }
    else {
        infoPlist.NSSpeechRecognitionUsageDescription =
            speechRecognitionPermission ||
                infoPlist.NSSpeechRecognitionUsageDescription ||
                SPEECHRECOGNITION_USAGE;
    }
    if (microphonePermission === false) {
        delete infoPlist.NSMicrophoneUsageDescription;
    }
    else {
        infoPlist.NSMicrophoneUsageDescription =
            microphonePermission ||
                infoPlist.NSMicrophoneUsageDescription ||
                MICROPHONE_USAGE;
    }
    return infoPlist;
}
exports.setSpeechRecognitionInfoPlist = setSpeechRecognitionInfoPlist;
const withSpeechRecognition = (config, { speechRecognitionPermission, microphonePermission } = {}) => {
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
        config.modResults = setSpeechRecognitionInfoPlist(config.modResults, {
            speechRecognitionPermission,
            microphonePermission,
        });
        return config;
    });
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withSpeechRecognition, pkg.name, pkg.version);
