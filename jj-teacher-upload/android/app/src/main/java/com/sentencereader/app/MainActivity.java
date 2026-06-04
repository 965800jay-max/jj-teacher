package com.sentencereader.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int STATUS_BAR_COLOR = Color.parseColor("#000000");
    private static final int NAVIGATION_BAR_COLOR = Color.parseColor("#000000");
    private static final long MIN_SPLASH_DURATION_MS = 1000L;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        long splashStartedAt = System.currentTimeMillis();
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        splashScreen.setKeepOnScreenCondition(
            () -> System.currentTimeMillis() - splashStartedAt < MIN_SPLASH_DURATION_MS
        );
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
        registerPlugin(NativeAudioPlugin.class);
        registerPlugin(NativeSpeechPlugin.class);
        super.onCreate(savedInstanceState);
        setupSystemBackHandler();
        applySystemBarColors();
    }

    @Override
    public void onResume() {
        super.onResume();
        applySystemBarColors();
    }

    private void applySystemBarColors() {
        Window window = getWindow();
        View decorView = window.getDecorView();

        decorView.setBackgroundColor(STATUS_BAR_COLOR);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.setStatusBarColor(STATUS_BAR_COLOR);
            window.setNavigationBarColor(NAVIGATION_BAR_COLOR);
        }

        int flags = decorView.getSystemUiVisibility();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }
        decorView.setSystemUiVisibility(flags);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController controller = decorView.getWindowInsetsController();
            if (controller != null) {
                controller.setSystemBarsAppearance(
                    0,
                    WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                        | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
                );
            }
        }
    }

    private void setupSystemBackHandler() {
        getOnBackPressedDispatcher().addCallback(
            this,
            new OnBackPressedCallback(true) {
                @Override
                public void handleOnBackPressed() {
                    handleSystemBack();
                }
            }
        );
    }

    private void handleSystemBack() {
        if (bridge == null || bridge.getWebView() == null) {
            finish();
            return;
        }

        WebView webView = bridge.getWebView();
        webView.evaluateJavascript(
            "Boolean(window.zhiyuHandleNativeBack && window.zhiyuHandleNativeBack())",
            handled -> {
                if ("true".equals(handled)) {
                    return;
                }
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    finish();
                }
            }
        );
    }
}
