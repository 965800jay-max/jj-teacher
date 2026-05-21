package com.sentencereader.app;

import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.PlaybackParams;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.HashMap;
import java.util.Map;

@CapacitorPlugin(name = "NativeAudio")
public class NativeAudioPlugin extends Plugin {
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private MediaPlayer player;
    private PluginCall activeCall;

    @PluginMethod
    public void play(PluginCall call) {
        mainHandler.post(() -> startPlayback(call));
    }

    @PluginMethod
    public void stop(PluginCall call) {
        mainHandler.post(() -> {
            stopPlayer();
            call.resolve();
        });
    }

    private void startPlayback(PluginCall call) {
        String url = call.getString("url");
        Float requestedRate = call.getFloat("rate", 1.0F);
        float rate = Math.max(0.5F, Math.min(1.0F, requestedRate == null ? 1.0F : requestedRate));

        if (url == null || url.trim().isEmpty()) {
            call.reject("Missing audio URL");
            return;
        }

        stopPlayer();
        activeCall = call;

        MediaPlayer nextPlayer = new MediaPlayer();
        player = nextPlayer;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            nextPlayer.setAudioAttributes(
                new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build()
            );
        }

        nextPlayer.setOnPreparedListener(mediaPlayer -> {
            try {
                mediaPlayer.start();
                applyPlaybackRate(mediaPlayer, rate);
            } catch (Exception exception) {
                rejectActiveCall(call, "Unable to start audio", exception);
            }
        });

        nextPlayer.setOnCompletionListener(mediaPlayer -> resolveActiveCall(call));
        nextPlayer.setOnErrorListener((mediaPlayer, what, extra) -> {
            JSObject details = new JSObject();
            details.put("what", what);
            details.put("extra", extra);
            rejectActiveCall(call, "Unable to play audio", null, details);
            return true;
        });

        try {
            Map<String, String> headers = new HashMap<>();
            headers.put(
                "User-Agent",
                "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Mobile Safari/537.36"
            );
            headers.put("Accept", "audio/mpeg,audio/*;q=0.9,*/*;q=0.8");
            nextPlayer.setDataSource(getContext(), Uri.parse(url), headers);
            nextPlayer.prepareAsync();
        } catch (Exception exception) {
            rejectActiveCall(call, "Unable to load audio", exception);
        }
    }

    private void applyPlaybackRate(MediaPlayer mediaPlayer, float rate) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return;

        try {
            PlaybackParams params = mediaPlayer.getPlaybackParams();
            params.setSpeed(rate);
            params.setPitch(1.0F);
            mediaPlayer.setPlaybackParams(params);
        } catch (Exception ignored) {
            // Some Android builds do not allow speed changes on streamed media.
        }
    }

    private void resolveActiveCall(PluginCall call) {
        if (activeCall != call) return;

        releasePlayer();
        activeCall = null;
        call.resolve();
    }

    private void rejectActiveCall(PluginCall call, String message, Exception exception) {
        rejectActiveCall(call, message, exception, null);
    }

    private void rejectActiveCall(PluginCall call, String message, Exception exception, JSObject details) {
        if (activeCall != call) return;

        releasePlayer();
        activeCall = null;

        if (details == null) {
            call.reject(message, exception);
        } else {
            call.reject(message, exception, details);
        }
    }

    private void stopPlayer() {
        if (activeCall != null) {
            activeCall.resolve();
            activeCall = null;
        }

        releasePlayer();
    }

    private void releasePlayer() {
        if (player == null) return;

        try {
            player.setOnPreparedListener(null);
            player.setOnCompletionListener(null);
            player.setOnErrorListener(null);
            if (player.isPlaying()) player.stop();
        } catch (Exception ignored) {
            // Releasing is still safe after a partially prepared stream.
        } finally {
            player.release();
            player = null;
        }
    }

    @Override
    protected void handleOnDestroy() {
        stopPlayer();
        super.handleOnDestroy();
    }
}
