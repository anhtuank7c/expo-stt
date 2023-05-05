import { Subscription, PermissionResponse } from "expo-modules-core";
import { OnSpeechResultEventPayload, OnSpeechErrorEventPayload, ReactEvents } from "./ExpoStt.types";
export declare function startSpeech(): boolean;
export declare function stopSpeech(): void;
export declare function cancelSpeech(): void;
export declare function destroySpeech(): void;
export declare function requestRecognitionPermission(): Promise<PermissionResponse>;
export declare function checkRecognitionPermission(): Promise<PermissionResponse>;
export declare function addOnSpeechStartListener(listener: () => void): Subscription;
export declare function addOnSpeechEndListener(listener: () => void): Subscription;
export declare function addOnSpeechCancelledListener(listener: () => void): Subscription;
export declare function addOnSpeechResultListener(listener: (event: OnSpeechResultEventPayload) => void): Subscription;
export declare function addOnSpeechErrorListener(listener: (event: OnSpeechErrorEventPayload) => void): Subscription;
export { OnSpeechResultEventPayload, OnSpeechErrorEventPayload, ReactEvents };
//# sourceMappingURL=index.d.ts.map