import { ConfigPlugin, InfoPlist } from "@expo/config-plugins";
type Props = {
    speechRecognitionPermission?: string | false;
    microphonePermission?: string | false;
};
export declare function setSpeechRecognitionInfoPlist(infoPlist: InfoPlist, { speechRecognitionPermission, microphonePermission }: Props): InfoPlist;
declare const _default: ConfigPlugin<void | Props>;
export default _default;
