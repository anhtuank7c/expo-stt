package expo.modules.stt

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.speech.RecognizerIntent
import expo.modules.kotlin.activityresult.AppContextActivityResultContract
import java.util.*

internal class VoiceRecognizerContract :
    AppContextActivityResultContract<VoiceRecognizerContractOptions, VoiceRecognizerContractResult> {

    // https://developer.android.com/training/wearables/user-input/voice#VoiceSupport
    override fun createIntent(context: Context, input: VoiceRecognizerContractOptions): Intent =
        Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
            )
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 10 * 1000) // 10s
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 10 * 1000) // 10s
        }

    override fun parseResult(
        input: VoiceRecognizerContractOptions,
        resultCode: Int,
        intent: Intent?
    ): VoiceRecognizerContractResult {
        if (resultCode == Activity.RESULT_CANCELED) {
            return VoiceRecognizerContractResult.Cancelled()
        }
        if (resultCode == Activity.RESULT_OK && intent != null) {
            val value = arrayListOf<String>()
            intent.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.let { result ->
                if (result != null) {
                    value.addAll(result)
                }
            }
            return VoiceRecognizerContractResult.Success(value)
        }
        return VoiceRecognizerContractResult.Error("Something went wrong")
    }
}

internal data class VoiceRecognizerContractOptions(
    val locale: Locale
) : java.io.Serializable

internal sealed class VoiceRecognizerContractResult private constructor() {
    class Cancelled : VoiceRecognizerContractResult()
    class Error(val cause: String) : VoiceRecognizerContractResult()
    class Success(val value: ArrayList<String>) : VoiceRecognizerContractResult()
}