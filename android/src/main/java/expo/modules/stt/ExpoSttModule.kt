package expo.modules.stt

import android.util.Log
import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.*

class ExpoSttModule : Module() {
    private lateinit var voiceRecognizer: AppContextActivityResultLauncher<VoiceRecognizerContractOptions, VoiceRecognizerContractResult>
    private var isRecognizing: Boolean = false

    companion object {
        const val onSpeechResult = "onSpeechResult"
        const val onSpeechError = "onSpeechError"
        const val onSpeechCancelled = "onSpeechCancelled"
        const val onSpeechStart = "onSpeechStart"
        const val onSpeechEnd = "onSpeechEnd"
        const val TAG = "ExpoStt"
    }

    override fun definition() = ModuleDefinition {
        Name(TAG)

        /**
         * We don't need any permission for Recognizer on Android
         * Just act like iOS one to unify the APIs
         */
        AsyncFunction("requestRecognitionPermission") {
            return@AsyncFunction mapOf(
                "status" to "granted",
                "expires" to "never",
                "granted" to true,
                "canAskAgain" to true
            )
        }

        AsyncFunction("checkRecognitionPermission") {
            return@AsyncFunction mapOf(
                "status" to "granted",
                "expires" to "never",
                "granted" to true,
                "canAskAgain" to true
            )
        }

        Function("startSpeech") {
            if (isRecognizing) {
                sendEvent(onSpeechError, mapOf("cause" to "Speech recognition already started!"))
                return@Function false
            }

            isRecognizing = true
            sendEvent(onSpeechStart)
            val options = VoiceRecognizerContractOptions(Locale.getDefault())
            CoroutineScope(Dispatchers.Main).launch {
                when (val result = voiceRecognizer.launch(options)) {
                    is VoiceRecognizerContractResult.Success -> {
                        isRecognizing = false
                        sendEvent(onSpeechResult, mapOf("value" to result.value))
                        sendEvent(onSpeechEnd)
                    }
                    is VoiceRecognizerContractResult.Cancelled -> {
                        isRecognizing = false
                        sendEvent(onSpeechCancelled)
                    }
                    is VoiceRecognizerContractResult.Error -> {
                        isRecognizing = false
                        sendEvent(onSpeechError, mapOf("cause" to result.cause))
                    }
                }
            }
            return@Function true
        }

        /**
         * There are nothing to do with these functions
         * since it belong to activity behavior
         * A bit different compare to iOS APIs
         */
        Function("stopSpeech") {
            Log.d(TAG, "Stop Voice Recognizer")
        }

        Function("cancelSpeech") {
            Log.d(TAG, "Cancel Voice Recognizer")
        }

        Function("destroySpeech") {
            Log.d(TAG, "Destroy Voice Recognizer")
        }

        RegisterActivityContracts {
            voiceRecognizer =
                registerForActivityResult(VoiceRecognizerContract()) { _, _ ->
                    Log.d(TAG, "handleResultUponActivityDestruction")
                }
        }

        Events(onSpeechResult, onSpeechError, onSpeechEnd, onSpeechStart, onSpeechCancelled)
    }
}
