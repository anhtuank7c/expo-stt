import AVFoundation
import ExpoModulesCore

public class MicrophoneRequester: NSObject, EXPermissionsRequester {
    public static func permissionType() -> String! {
        "audioRecording"
    }
    
    public func requestPermissions(resolver resolve: EXPromiseResolveBlock!, rejecter reject: EXPromiseRejectBlock!) {
        AVAudioSession.sharedInstance().requestRecordPermission { granted in
            resolve(self.getPermissions())
        }
    }
    
    public func getPermissions() -> [AnyHashable : Any]! {
        var status: EXPermissionStatus
        var systemStatus: AVAudioSession.RecordPermission
        let microphoneUsageDescription = Bundle.main.object(forInfoDictionaryKey: "NSMicrophoneUsageDescription")
        if microphoneUsageDescription == nil {
            EXFatal(EXErrorWithMessage("This app is missing 'NSMicrophoneUsageDescription' so microphone will fail"))
            systemStatus = AVAudioSession.RecordPermission.denied
        } else {
            systemStatus = AVAudioSession.sharedInstance().recordPermission
        }
        switch systemStatus {
        case .granted:
            status = EXPermissionStatusGranted
        case .denied:
            status = EXPermissionStatusDenied
        case .undetermined:
            fallthrough
        @unknown default:
            status = EXPermissionStatusUndetermined
        }
        return ["status": status.rawValue]
    }
    
}
