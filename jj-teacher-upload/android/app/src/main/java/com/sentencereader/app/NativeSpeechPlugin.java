package com.sentencereader.app;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.ArrayList;
import java.util.Locale;

@CapacitorPlugin(
    name = "NativeSpeech",
    permissions = {
        @Permission(strings = { Manifest.permission.RECORD_AUDIO }, alias = "microphone")
    }
)
public class NativeSpeechPlugin extends Plugin {
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private SpeechRecognizer recognizer;
    private boolean listening = false;
    private String activeLanguage = "";

    @PluginMethod
    public void start(PluginCall call) {
        mainHandler.post(() -> {
            if (getPermissionState("microphone") != PermissionState.GRANTED) {
                requestPermissionForAlias("microphone", call, "microphonePermissionCallback");
                return;
            }
            startListening(call);
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        mainHandler.post(() -> {
            if (recognizer != null && listening) {
                recognizer.stopListening();
            }
            call.resolve();
        });
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        mainHandler.post(() -> {
            stopRecognizer();
            call.resolve();
        });
    }

    @PermissionCallback
    public void microphonePermissionCallback(PluginCall call) {
        if (getPermissionState("microphone") == PermissionState.GRANTED) {
            startListening(call);
        } else {
            call.reject("Microphone permission denied");
        }
    }

    private void startListening(PluginCall call) {
        if (!SpeechRecognizer.isRecognitionAvailable(getContext())) {
            call.reject("Speech recognition is not available on this device");
            return;
        }

        stopRecognizer();
        activeLanguage = normalizeLanguage(call.getString("language", ""));
        recognizer = SpeechRecognizer.createSpeechRecognizer(getContext());
        recognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {
                listening = true;
                notifyText("speechReady", "");
            }

            @Override
            public void onBeginningOfSpeech() {
                listening = true;
                notifyText("speechListening", "");
            }

            @Override
            public void onRmsChanged(float rmsdB) {
                JSObject data = new JSObject();
                data.put("level", rmsdB);
                notifyListeners("speechLevel", data);
            }

            @Override
            public void onBufferReceived(byte[] buffer) {}

            @Override
            public void onEndOfSpeech() {
                listening = false;
            }

            @Override
            public void onError(int error) {
                listening = false;
                JSObject data = new JSObject();
                data.put("code", error);
                data.put("message", getErrorMessage(error));
                notifyListeners("speechError", data);
                stopRecognizer();
            }

            @Override
            public void onResults(Bundle results) {
                listening = false;
                notifyText("speechResult", getBestText(results));
                stopRecognizer();
            }

            @Override
            public void onPartialResults(Bundle partialResults) {
                notifyText("speechPartial", getBestText(partialResults));
            }

            @Override
            public void onEvent(int eventType, Bundle params) {}
        });

        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
        intent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getContext().getPackageName());
        if (!activeLanguage.isEmpty()) {
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, activeLanguage);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, activeLanguage);
        }

        try {
            recognizer.startListening(intent);
            call.resolve();
        } catch (Exception exception) {
            stopRecognizer();
            call.reject("Unable to start speech recognition", exception);
        }
    }

    private String normalizeLanguage(String language) {
        String clean = language == null ? "" : language.trim();
        if (clean.isEmpty() || "auto".equalsIgnoreCase(clean)) {
            return Locale.getDefault().toLanguageTag();
        }
        return clean;
    }

    private String getBestText(Bundle bundle) {
        if (bundle == null) return "";
        ArrayList<String> matches = bundle.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        if (matches == null || matches.isEmpty()) return "";
        return matches.get(0) == null ? "" : matches.get(0).trim();
    }

    private void notifyText(String eventName, String text) {
        JSObject data = new JSObject();
        data.put("text", text == null ? "" : text);
        data.put("language", activeLanguage);
        notifyListeners(eventName, data);
    }

    private String getErrorMessage(int error) {
        switch (error) {
            case SpeechRecognizer.ERROR_AUDIO:
                return "Audio recording error";
            case SpeechRecognizer.ERROR_CLIENT:
                return "Speech client error";
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                return "Microphone permission denied";
            case SpeechRecognizer.ERROR_NETWORK:
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                return "Speech network error";
            case SpeechRecognizer.ERROR_NO_MATCH:
                return "No speech recognized";
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                return "Speech recognizer is busy";
            case SpeechRecognizer.ERROR_SERVER:
                return "Speech server error";
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                return "No speech heard";
            default:
                return "Speech recognition error";
        }
    }

    private void stopRecognizer() {
        listening = false;
        SpeechRecognizer currentRecognizer = recognizer;
        recognizer = null;
        if (currentRecognizer == null) return;
        try {
            currentRecognizer.setRecognitionListener(null);
            currentRecognizer.cancel();
        } catch (Exception ignored) {
            // The recognizer may already be stopped.
        } finally {
            currentRecognizer.destroy();
        }
    }

    @Override
    protected void handleOnDestroy() {
        stopRecognizer();
        super.handleOnDestroy();
    }
}
