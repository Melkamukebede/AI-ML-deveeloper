package com.example.ethiohealth;

import android.animation.*;
import android.app.*;
import android.content.*;
import android.content.res.*;
import android.graphics.*;
import android.graphics.drawable.*;
import android.media.*;
import android.net.*;
import android.os.*;
import android.text.*;
import android.text.style.*;
import android.util.*;
import android.view.*;
import android.view.View.*;
import android.view.animation.*;
import android.webkit.*;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.*;
import androidx.activity.ktx.*;
import androidx.annotation.*;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import com.example.ethiohealth.databinding.*;
import com.google.android.material.appbar.AppBarLayout;
import java.io.*;
import java.text.*;
import java.util.*;
import java.util.regex.*;
import org.json.*;
import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.CalendarContract;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.FileProvider;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {
	
	private MainBinding binding;
private WebView webView;
    private ProgressBar progressBar;
    private ValueCallback<Uri[]> filePathCallback;
    private ExecutorService executorService;
    private Handler mainHandler;
    
    private static final String TAG = "EthioHealthAI";
    private static final int FILE_CHOOSER_REQUEST = 100;
    private static final int NOTIFICATION_PERMISSION = 101;
    private static final int LOCATION_PERMISSION = 102;
    
    // API Endpoints
    private static final String OPENFDA_API = "https://api.fda.gov/drug/label.json";
    private static final String RXNORM_API = "https://rxnav.nlm.nih.gov/REST";
    private static final String PUBMED_API = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
    private static final String DISEASE_API = "https://disease.sh/v3/covid-19";
    
    // Ethiopian Emergency Number
    private static final String EMERGENCY_NUMBER = "907";
    
    // Ethiopian health facilities API (mock endpoint for demo)
    private static final String ETHIOPIAN_HEALTH_API = "https://moh.gov.et/api/health-facilities";
    
    private SharedPreferences sharedPreferences;
    private String currentAnalysisData = "";
	
	@Override
	protected void onCreate(Bundle _savedInstanceState) {
		super.onCreate(_savedInstanceState);
		binding = MainBinding.inflate(getLayoutInflater());
		setContentView(binding.getRoot());
		initialize(_savedInstanceState);
		initializeLogic();
	}
	
	private void initialize(Bundle _savedInstanceState) {
		setSupportActionBar(binding.Toolbar);
		getSupportActionBar().setDisplayHomeAsUpEnabled(true);
		getSupportActionBar().setHomeButtonEnabled(true);
		binding.Toolbar.setNavigationOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View _v) {
				onBackPressed();
			}
		});
		
		//webviewOnProgressChanged
		binding.webview1.setWebChromeClient(new WebChromeClient() {
			@Override public void onProgressChanged(WebView view, int _newProgress) {
				
			}
		});
		
		//OnDownloadStarted
		binding.webview1.setDownloadListener(new DownloadListener() {
			public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
				DownloadManager.Request binding.webview1a = new DownloadManager.Request(Uri.parse(url));
				String binding.webview1b = CookieManager.getInstance().getCookie(url);
				binding.webview1a.addRequestHeader("cookie", binding.webview1b);
				binding.webview1a.addRequestHeader("User-Agent", userAgent);
				binding.webview1a.setDescription("Downloading file...");
				binding.webview1a.setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype));
				binding.webview1a.allowScanningByMediaScanner(); binding.webview1a.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED); binding.webview1a.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimetype));
				
				DownloadManager binding.webview1c = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
				binding.webview1c.enqueue(binding.webview1a);
				showMessage("Downloading File....");
				BroadcastReceiver onComplete = new BroadcastReceiver() {
					public void onReceive(Context ctxt, Intent intent) {
						showMessage("Download Complete!");
						unregisterReceiver(this);
						
					}};
				registerReceiver(onComplete, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
			}
		});
		
		binding.webview1.setWebViewClient(new WebViewClient() {
			@Override
			public void onPageStarted(WebView _param1, String _param2, Bitmap _param3) {
				final String _url = _param2;
				
				super.onPageStarted(_param1, _param2, _param3);
			}
			
			@Override
			public void onPageFinished(WebView _param1, String _param2) {
				final String _url = _param2;
				
				super.onPageFinished(_param1, _param2);
			}
		});
	}
	
	private void initializeLogic() {
		
		// Full screen setup
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		getWindow().setFlags(
		WindowManager.LayoutParams.FLAG_FULLSCREEN,
		WindowManager.LayoutParams.FLAG_FULLSCREEN
		);
		
		// Hide action bar
		if (getSupportActionBar() != null) {
			getSupportActionBar().hide();
		}
		
		// Make status bar transparent
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
			getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
		}
		
		setContentView(R.layout.activity_main);
		
		// Initialize components
		executorService = Executors.newFixedThreadPool(4);
		mainHandler = new Handler(Looper.getMainLooper());
		sharedPreferences = getSharedPreferences("EthioHealthPrefs", MODE_PRIVATE);
		
		// Setup views
		progressBar = findViewById(R.id.progressBar);
		webView = findViewById(R.id.webView);
		
		// Configure and setup WebView
		setupWebView();
		
		// Load the health application
		loadHealthApp();
		
		// Request necessary permissions
		requestAllPermissions();
		
		// Load saved analysis data
		loadSavedData();
	}
	
	private void setupWebView() {
		WebSettings webSettings = webView.getSettings();
		
		// Basic settings
		webSettings.setJavaScriptEnabled(true);
		webSettings.setDomStorageEnabled(true);
		webSettings.setDatabaseEnabled(true);
		webSettings.setAllowFileAccess(true);
		webSettings.setAllowContentAccess(true);
		
		// HTML5 features
		webSettings.setAppCacheEnabled(true);
		webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
		webSettings.setAppCachePath(getCacheDir().getAbsolutePath());
		
		// Performance
		webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
		webSettings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NARROW_COLUMNS);
		webSettings.setLoadWithOverviewMode(true);
		webSettings.setUseWideViewPort(true);
		webSettings.setSupportZoom(false);
		webSettings.setBuiltInZoomControls(false);
		webSettings.setDisplayZoomControls(false);
		
		// Enable geolocation
		webSettings.setGeolocationEnabled(true);
		webSettings.setGeolocationDatabasePath(getFilesDir().getPath());
		
		// Mixed content handling for APIs
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
			webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
			CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
		}
		
		// Custom User Agent
		String userAgent = webSettings.getUserAgentString();
		webSettings.setUserAgentString(userAgent + " EthioHealthAI/2.0 (Ethiopia)");
		
		// Add JavaScript Interfaces
		webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
		webView.addJavascriptInterface(new HealthAPIBridge(), "HealthAPI");
		webView.addJavascriptInterface(new DiseaseDetectionBridge(), "DiseaseDetector");
		
		// WebViewClient for page loading
		webView.setWebViewClient(new WebViewClient() {
			@Override
			public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
				String url = request.getUrl().toString();
				
				// Handle special protocols
				if (url.startsWith("tel:")) {
					Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
					startActivity(intent);
					return true;
				} else if (url.startsWith("mailto:")) {
					Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse(url));
					startActivity(intent);
					return true;
				} else if (url.startsWith("sms:")) {
					startActivity(new Intent(Intent.ACTION_SENDTO, Uri.parse(url)));
					return true;
				} else if (url.startsWith("geo:")) {
					Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
					startActivity(intent);
					return true;
				}
				return false;
			}
			
			@Override
			public void onReceivedError(WebView view, int errorCode, 
			String description, String failingUrl) {
				Log.e(TAG, "WebView Error " + errorCode + ": " + description);
				
				// Load offline fallback
				view.loadUrl("about:blank");
				String offlineHtml = "<html><body style='font-family:sans-serif;text-align:center;padding:40px;'>" +
				"<h1>🔌 Offline</h1>" +
				"<p>Please check your internet connection</p>" +
				"<button onclick='location.reload()' style='background:#10b981;color:white;" +
				"border:none;padding:12px 24px;border-radius:25px;font-size:16px;'>Retry</button>" +
				"</body></html>";
				view.loadDataWithBaseURL(null, offlineHtml, "text/html", "UTF-8", null);
			}
			
			@Override
			public void onPageFinished(WebView view, String url) {
				super.onPageFinished(view, url);
				progressBar.setVisibility(View.GONE);
				
				// Inject JavaScript for Android API access
				injectJavaScriptBridge();
			}
		});
		
		// WebChromeClient for dialogs and file uploads
		webView.setWebChromeClient(new WebChromeClient() {
			@Override
			public void onProgressChanged(WebView view, int newProgress) {
				if (newProgress < 100 && progressBar.getVisibility() == View.GONE) {
					progressBar.setVisibility(View.VISIBLE);
				}
				progressBar.setProgress(newProgress);
				if (newProgress == 100) {
					progressBar.setVisibility(View.GONE);
				}
			}
			
			@Override
			public boolean onShowFileChooser(WebView webView, 
			ValueCallback<Uri[]> filePathCallback,
			FileChooserParams fileChooserParams) {
				MainActivity.this.filePathCallback = filePathCallback;
				
				Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
				intent.addCategory(Intent.CATEGORY_OPENABLE);
				intent.setType("*/*");
				startActivityForResult(
				Intent.createChooser(intent, "Select File"), 
				FILE_CHOOSER_REQUEST
				);
				return true;
			}
			
			@Override
			public void onPermissionRequest(PermissionRequest request) {
				if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
					request.grant(request.getResources());
				}
			}
		});
	}
	
	private void injectJavaScriptBridge() {
		String jsBridge = 
		"if (!window.Android) {" +
		"  window.Android = {" +
		"    getStepCount: function() { return AndroidBridge.getStepCount(); }," +
		"    openCalendar: function(title, date) { AndroidBridge.openCalendar(title, date); }," +
		"    shareReport: function(data) { AndroidBridge.shareReport(data); }," +
		"    showToast: function(msg) { AndroidBridge.showToast(msg); }," +
		"    vibrate: function(ms) { AndroidBridge.vibrate(ms); }," +
		"    getDeviceInfo: function() { return AndroidBridge.getDeviceInfo(); }," +
		"    isOnline: function() { return AndroidBridge.isOnline(); }," +
		"    cacheData: function(key, data) { AndroidBridge.cacheData(key, data); }," +
		"    getCachedData: function(key) { return AndroidBridge.getCachedData(key); }," +
		"    callEmergency: function() { AndroidBridge.callEmergency(); }" +
		"  };" +
		"  window.HealthAPI = {" +
		"    searchMedicine: function(name) { return HealthAPI.searchMedicine(name); }," +
		"    searchPubMed: function(query) { return HealthAPI.searchPubMed(query); }," +
		"    getDiseaseStats: function() { return HealthAPI.getDiseaseStats(); }," +
		"    getEthiopianHealthData: function() { return HealthAPI.getEthiopianHealthData(); }" +
		"  };" +
		"  window.DiseaseDetector = {" +
		"    analyzeVitals: function(data) { return DiseaseDetector.analyzeVitals(data); }," +
		"    analyzeSymptoms: function(data) { return DiseaseDetector.analyzeSymptoms(data); }," +
		"    getMedicinesForDisease: function(disease) { return DiseaseDetector.getMedicinesForDisease(disease); }," +
		"    logAnalysis: function(data) { DiseaseDetector.logAnalysis(data); }" +
		"  };" +
		"}";
		
		webView.evaluateJavascript(jsBridge, null);
	}
	
	private void loadHealthApp() {
		// Check for cached version first
		File cachedApp = new File(getCacheDir(), "ethiohealth/index.html");
		File assetsApp = new File("file:///android_asset/heal.html");
		
		if (cachedApp.exists()) {
			webView.loadUrl("file://" + cachedApp.getAbsolutePath());
			Log.d(TAG, "Loading from cache");
		} else {
			// Try loading from assets
			try {
				InputStream is = getAssets().open("ethiohealth/index.html");
				is.close();
				webView.loadUrl("file:///android_asset/ethiohealth/index.html");
				Log.d(TAG, "Loading from assets");
			} catch (Exception e) {
				// Fallback to inline HTML if no asset file
				String fallbackHtml = getFallbackHtml();
				webView.loadDataWithBaseURL(null, fallbackHtml, "text/html", "UTF-8", null);
				Log.d(TAG, "Loading fallback HTML");
			}
		}
	}
	
	private String getFallbackHtml() {
		// Minimal fallback HTML if assets aren't available
		return "<!DOCTYPE html><html><head>" +
		"<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
		"<title>EthioHealth AI</title>" +
		"<style>" +
		"body{font-family:sans-serif;background:#f0fdf4;margin:0;padding:20px;text-align:center;}" +
		".card{background:white;border-radius:16px;padding:20px;margin:10px 0;box-shadow:0 4px 6px rgba(0,0,0,0.1);}" +
		"button{background:#10b981;color:white;border:none;padding:12px 24px;border-radius:25px;font-size:16px;}" +
		"input{width:100%;padding:10px;border:1px solid #ddd;border-radius:10px;margin:5px 0;}" +
		"</style></head><body>" +
		"<h1>🧬 EthioHealth AI</h1>" +
		"<div class='card'>" +
		"<h3>Quick Health Check</h3>" +
		"<input type='number' id='systolic' placeholder='Systolic BP'>" +
		"<input type='number' id='glucose' placeholder='Glucose mg/dL'>" +
		"<button onclick='analyze()'>Analyze Now</button>" +
		"<p id='result'></p>" +
		"</div>" +
		"<script>" +
		"function analyze(){" +
		"var sys=document.getElementById('systolic').value;" +
		"var glu=document.getElementById('glucose').value;" +
		"var r='';" +
		"if(sys>140)r='High BP risk! Visit health center.';" +
		"else if(sys>120)r='BP elevated. Monitor regularly.';" +
		"else r='BP normal.';" +
		"if(glu>126)r+=' Diabetes risk detected.';" +
		"document.getElementById('result').innerHTML=r;" +
		"if(window.DiseaseDetector)DiseaseDetector.logAnalysis(JSON.stringify({systolic:sys,glucose:glu}));" +
		"}" +
		"</script>" +
		"</body></html>";
	}
	
	private void loadSavedData() {
		currentAnalysisData = sharedPreferences.getString("last_analysis", "");
	}
	
	private void requestAllPermissions() {
		// Notification permission (Android 13+)
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
			if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
			!= PackageManager.PERMISSION_GRANTED) {
				ActivityCompat.requestPermissions(this,
				new String[]{Manifest.permission.POST_NOTIFICATIONS},
				NOTIFICATION_PERMISSION);
			}
		}
		
		// Location permission for health facility finder
		if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
		!= PackageManager.PERMISSION_GRANTED) {
			ActivityCompat.requestPermissions(this,
			new String[]{
				Manifest.permission.ACCESS_FINE_LOCATION,
				Manifest.permission.ACCESS_COARSE_LOCATION
			},
			LOCATION_PERMISSION);
		}
		
		// Body sensors for health monitoring
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
			if (ContextCompat.checkSelfPermission(this, Manifest.permission.BODY_SENSORS)
			!= PackageManager.PERMISSION_GRANTED) {
				ActivityCompat.requestPermissions(this,
				new String[]{Manifest.permission.BODY_SENSORS},
				103);
			}
		}
	}
	
	@Override
	public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
	@NonNull int[] grantResults) {
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
		
		if (requestCode == NOTIFICATION_PERMISSION) {
			if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
				Log.d(TAG, "Notification permission granted");
				webView.evaluateJavascript(
				"javascript:if(window.onPermissionGranted)window.onPermissionGranted('notifications')", 
				null
				);
			}
		} else if (requestCode == LOCATION_PERMISSION) {
			if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
				Log.d(TAG, "Location permission granted");
			}
		}
	}
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		
		if (requestCode == FILE_CHOOSER_REQUEST) {
			if (filePathCallback != null) {
				Uri[] results = null;
				if (resultCode == Activity.RESULT_OK && data != null) {
					String dataString = data.getDataString();
					if (dataString != null) {
						results = new Uri[]{Uri.parse(dataString)};
					}
				}
				filePathCallback.onReceiveValue(results);
				filePathCallback = null;
			}
		}
	}
	
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			// Check if JavaScript wants to handle back press
			webView.evaluateJavascript(
			"javascript:if(window.onBackPressed)window.onBackPressed()",
			value -> {
				if (!"true".equals(value) && webView.canGoBack()) {
					webView.goBack();
				} else if (!"true".equals(value)) {
					finish();
				}
			}
			);
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		if (webView != null) {
			webView.onResume();
			webView.evaluateJavascript("javascript:if(window.onAppResume)window.onAppResume()", null);
		}
	}
	
	@Override
	protected void onPause() {
		super.onPause();
		if (webView != null) {
			webView.onPause();
		}
	}
	
	@Override
	protected void onDestroy() {
		super.onDestroy();
		if (executorService != null) {
			executorService.shutdown();
		}
		if (webView != null) {
			webView.loadUrl("about:blank");
			webView.clearHistory();
			webView.clearCache(true);
			webView.removeAllViews();
			webView.destroy();
			webView = null;
		}
	}
	
	@Override
	protected void onSaveInstanceState(Bundle outState) {
		super.onSaveInstanceState(outState);
		if (webView != null) {
			webView.saveState(outState);
		}
	}
	
	@Override
	protected void onRestoreInstanceState(Bundle savedInstanceState) {
		super.onRestoreInstanceState(savedInstanceState);
		if (webView != null) {
			webView.restoreState(savedInstanceState);
		}
	}
	
	// ============================================
	// ANDROID BRIDGE - Native Functionality
	// ============================================
	public class AndroidBridge {
		
		@JavascriptInterface
		public void showToast(String message) {
			mainHandler.post(() -> 
			Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show()
			);
		}
		
		@JavascriptInterface
		public String getStepCount() {
			// Simulated step counter (would use Sensor API in production)
			int steps = sharedPreferences.getInt("step_count", 3247);
			return "{\"steps\":" + steps + ",\"unit\":\"steps\"}";
		}
		
		@JavascriptInterface
		public String getDeviceInfo() {
			JSONObject info = new JSONObject();
			try {
				info.put("model", Build.MODEL);
				info.put("manufacturer", Build.MANUFACTURER);
				info.put("androidVersion", Build.VERSION.RELEASE);
				info.put("sdkVersion", Build.VERSION.SDK_INT);
				info.put("device", Build.DEVICE);
				info.put("brand", Build.BRAND);
			} catch (Exception e) {
				Log.e(TAG, "Error getting device info", e);
			}
			return info.toString();
		}
		
		@JavascriptInterface
		public void openCalendar(String title, String dateStr) {
			try {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
				Date date = sdf.parse(dateStr);
				long startMillis = date.getTime();
				long endMillis = startMillis + 3600000; // 1 hour
				
				Intent intent = new Intent(Intent.ACTION_INSERT)
				.setData(CalendarContract.Events.CONTENT_URI)
				.putExtra(CalendarContract.Events.TITLE, title)
				.putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, startMillis)
				.putExtra(CalendarContract.EXTRA_EVENT_END_TIME, endMillis);
				
				startActivity(intent);
			} catch (Exception e) {
				Log.e(TAG, "Calendar error", e);
				showToast("Could not open calendar");
			}
		}
		
		@JavascriptInterface
		public void shareReport(String reportData) {
			Intent shareIntent = new Intent(Intent.ACTION_SEND);
			shareIntent.setType("text/plain");
			shareIntent.putExtra(Intent.EXTRA_SUBJECT, "EthioHealth AI Report");
			shareIntent.putExtra(Intent.EXTRA_TEXT, reportData);
			startActivity(Intent.createChooser(shareIntent, "Share Health Report"));
		}
		
		@JavascriptInterface
		public void vibrate(long milliseconds) {
			android.os.Vibrator vibrator = (android.os.Vibrator) 
			getSystemService(VIBRATOR_SERVICE);
			if (vibrator != null && vibrator.hasVibrator()) {
				vibrator.vibrate(milliseconds);
			}
		}
		
		@JavascriptInterface
		public boolean isOnline() {
			return NetworkUtil.isNetworkAvailable(MainActivity.this);
		}
		
		@JavascriptInterface
		public void cacheData(String key, String data) {
			sharedPreferences.edit().putString(key, data).apply();
		}
		
		@JavascriptInterface
		public String getCachedData(String key) {
			return sharedPreferences.getString(key, "");
		}
		
		@JavascriptInterface
		public void callEmergency() {
			Intent intent = new Intent(Intent.ACTION_DIAL);
			intent.setData(Uri.parse("tel:" + EMERGENCY_NUMBER));
			startActivity(intent);
		}
		
		@JavascriptInterface
		public void openUrl(String url) {
			Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
			startActivity(browserIntent);
		}
		
		@JavascriptInterface
		public String getAppVersion() {
			try {
				return getPackageManager()
				.getPackageInfo(getPackageName(), 0).versionName;
			} catch (Exception e) {
				return "2.0.0";
			}
		}
	}
	
	// ============================================
	// HEALTH API BRIDGE - Online Database Access
	// ============================================
	public class HealthAPIBridge {
		
		@JavascriptInterface
		public void searchMedicine(final String medicineName) {
			executorService.execute(() -> {
				try {
					String url = OPENFDA_API + "?search=active_ingredient:\"" + 
					medicineName + "\"&limit=5";
					String response = makeHttpRequest(url);
					
					final String escapedResponse = escapeJson(response);
					mainHandler.post(() -> {
						webView.evaluateJavascript(
						"javascript:if(window.onMedicineResult)window.onMedicineResult('" + 
						escapedResponse + "')", null
						);
					});
				} catch (Exception e) {
					Log.e(TAG, "Medicine search error", e);
					mainHandler.post(() -> {
						webView.evaluateJavascript(
						"javascript:if(window.onMedicineError)window.onMedicineError('" + 
						e.getMessage() + "')", null
						);
					});
				}
			});
		}
		
		@JavascriptInterface
		public void searchPubMed(final String query) {
			executorService.execute(() -> {
				try {
					String searchUrl = PUBMED_API + "/esearch.fcgi?db=pubmed&retmax=5&retmode=json&term=" +
					query + "+Ethiopia";
					String response = makeHttpRequest(searchUrl);
					
					final String escapedResponse = escapeJson(response);
					mainHandler.post(() -> {
						webView.evaluateJavascript(
						"javascript:if(window.onPubMedResult)window.onPubMedResult('" + 
						escapedResponse + "')", null
						);
					});
				} catch (Exception e) {
					Log.e(TAG, "PubMed search error", e);
				}
			});
		}
		
		@JavascriptInterface
		public String getDiseaseStats() {
			try {
				String url = DISEASE_API + "/all";
				return makeHttpRequest(url);
			} catch (Exception e) {
				Log.e(TAG, "Disease stats error", e);
				return "{}";
			}
		}
		
		@JavascriptInterface
		public String getEthiopianHealthData() {
			// Return cached Ethiopian health statistics
			JSONObject data = new JSONObject();
			try {
				data.put("hypertension_prevalence", "16-20%");
				data.put("diabetes_prevalence", "5-8%");
				data.put("malaria_risk_population", "60%");
				data.put("tb_burden", "High (150+ per 100,000)");
				data.put("health_facilities", "3,500+ public facilities");
				data.put("emergency_number", "907");
			} catch (Exception e) {
				Log.e(TAG, "Error creating health data", e);
			}
			return data.toString();
		}
		
		@JavascriptInterface
		public void findNearbyHealthFacilities() {
			// Open Google Maps with health facilities search
			Intent intent = new Intent(Intent.ACTION_VIEW, 
			Uri.parse("geo:0,0?q=health+center+near+me"));
			startActivity(intent);
		}
		
		private String makeHttpRequest(String urlString) throws Exception {
			URL url = new URL(urlString);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setConnectTimeout(8000);
			conn.setReadTimeout(8000);
			conn.setRequestProperty("User-Agent", "EthioHealthAI/2.0");
			
			BufferedReader reader = new BufferedReader(
			new InputStreamReader(conn.getInputStream()));
			StringBuilder response = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				response.append(line);
			}
			reader.close();
			conn.disconnect();
			return response.toString();
		}
		
		private String escapeJson(String json) {
			return json.replace("\\", "\\\\")
			.replace("'", "\\'")
			.replace("\"", "\\\"")
			.replace("\n", "\\n")
			.replace("\r", "\\r");
		}
	}
	
	// ============================================
	// DISEASE DETECTION BRIDGE - AI Analysis
	// ============================================
	public class DiseaseDetectionBridge {
		
		@JavascriptInterface
		public String analyzeVitals(String vitalsJson) {
			try {
				JSONObject vitals = new JSONObject(vitalsJson);
				
				double systolic = vitals.optDouble("systolic", 120);
				double diastolic = vitals.optDouble("diastolic", 80);
				double glucose = vitals.optDouble("glucose", 95);
				double bmi = vitals.optDouble("bmi", 24);
				double temperature = vitals.optDouble("temperature", 36.6);
				int age = vitals.optInt("age", 30);
				
				JSONObject results = new JSONObject();
				
				// Hypertension analysis
				int hyperRisk = 0;
				if (systolic > 140) hyperRisk += 40;
				else if (systolic > 130) hyperRisk += 25;
				else if (systolic > 120) hyperRisk += 10;
				if (diastolic > 90) hyperRisk += 30;
				else if (diastolic > 85) hyperRisk += 15;
				if (age > 40) hyperRisk += 15;
				if (bmi > 30) hyperRisk += 15;
				else if (bmi > 25) hyperRisk += 8;
				
				JSONObject hypertension = new JSONObject();
				hypertension.put("disease", "hypertension");
				hypertension.put("riskPercentage", Math.min(100, hyperRisk));
				hypertension.put("level", hyperRisk > 50 ? "high" : hyperRisk > 25 ? "medium" : "low");
				hypertension.put("recommendation", "Reduce salt intake. Monitor BP weekly at health center.");
				hypertension.put("medicines", new JSONArray("['Enalapril','Amlodipine','Hydrochlorothiazide']"));
				
				// Diabetes analysis
				int diabetesRisk = 0;
				if (glucose > 200) diabetesRisk += 50;
				else if (glucose > 140) diabetesRisk += 35;
				else if (glucose > 126) diabetesRisk += 20;
				else if (glucose > 110) diabetesRisk += 10;
				if (bmi > 30) diabetesRisk += 20;
				else if (bmi > 25) diabetesRisk += 10;
				if (age > 45) diabetesRisk += 15;
				
				JSONObject diabetes = new JSONObject();
				diabetes.put("disease", "diabetes_type2");
				diabetes.put("riskPercentage", Math.min(100, diabetesRisk));
				diabetes.put("level", diabetesRisk > 40 ? "high" : diabetesRisk > 20 ? "medium" : "low");
				diabetes.put("recommendation", "Exercise 30 min daily. Reduce sugary foods and refined carbs.");
				diabetes.put("medicines", new JSONArray("['Metformin','Glibenclamide']"));
				
				// Malaria risk
				int malariaRisk = 0;
				if (temperature > 39) malariaRisk += 50;
				else if (temperature > 38) malariaRisk += 30;
				else if (temperature > 37.5) malariaRisk += 10;
				
				// Seasonal factor
				int month = Calendar.getInstance().get(Calendar.MONTH) + 1;
				if (month >= 6 && month <= 9) malariaRisk += 20;
				
				JSONObject malaria = new JSONObject();
				malaria.put("disease", "malaria");
				malaria.put("riskPercentage", Math.min(100, malariaRisk));
				malaria.put("level", malariaRisk > 40 ? "high" : malariaRisk > 20 ? "medium" : "low");
				malaria.put("recommendation", "Sleep under treated nets. Seek testing if fever persists.");
				malaria.put("medicines", new JSONArray("['Artemether-Lumefantrine','Chloroquine']"));
				
				// Compile results
				results.put("hypertension", hypertension);
				results.put("diabetes", diabetes);
				results.put("malaria", malaria);
				results.put("timestamp", System.currentTimeMillis());
				
				// Save for later use
				currentAnalysisData = results.toString();
				sharedPreferences.edit().putString("last_analysis", currentAnalysisData).apply();
				
				return results.toString();
				
			} catch (Exception e) {
				Log.e(TAG, "Analysis error", e);
				return "{\"error\":\"" + e.getMessage() + "\"}";
			}
		}
		
		@JavascriptInterface
		public String analyzeSymptoms(String symptomsJson) {
			try {
				JSONObject input = new JSONObject(symptomsJson);
				JSONArray symptoms = input.optJSONArray("symptoms");
				String duration = input.optString("duration", "days");
				
				JSONObject results = new JSONObject();
				JSONArray matches = new JSONArray();
				
				// Simple symptom matching
				if (symptoms != null) {
					String symptomStr = symptoms.toString().toLowerCase();
					
					if (symptomStr.contains("fever") || symptomStr.contains("chills")) {
						JSONObject match = new JSONObject();
						match.put("disease", "malaria");
						match.put("confidence", symptomStr.contains("chills") ? 75 : 50);
						match.put("urgency", "urgent");
						match.put("message", "Seek malaria testing within 24 hours.");
						matches.put(match);
					}
					
					if (symptomStr.contains("cough") && symptomStr.contains("fever")) {
						JSONObject match = new JSONObject();
						match.put("disease", "tuberculosis");
						match.put("confidence", 60);
						match.put("urgency", "immediate");
						match.put("message", "Visit health center for TB screening.");
						matches.put(match);
					}
					
					if (symptomStr.contains("headache") && symptomStr.contains("fatigue")) {
						JSONObject match = new JSONObject();
						match.put("disease", "hypertension");
						match.put("confidence", 45);
						match.put("urgency", "moderate");
						match.put("message", "Check blood pressure at nearest health center.");
						matches.put(match);
					}
				}
				
				results.put("matches", matches);
				results.put("timestamp", System.currentTimeMillis());
				return results.toString();
				
			} catch (Exception e) {
				Log.e(TAG, "Symptom analysis error", e);
				return "{\"error\":\"" + e.getMessage() + "\"}";
			}
		}
		
		@JavascriptInterface
		public String getMedicinesForDisease(String disease) {
			JSONObject medicines = new JSONObject();
			try {
				switch (disease.toLowerCase()) {
					case "hypertension":
					medicines.put("medicines", new JSONArray("['Enalapril','Amlodipine','Hydrochlorothiazide','Atenolol']"));
					medicines.put("availability", "Available at all public hospitals");
					medicines.put("price_range", "40-120 Birr/month");
					break;
					case "diabetes":
					case "diabetes_type2":
					medicines.put("medicines", new JSONArray("['Metformin','Glibenclamide','Insulin NPH']"));
					medicines.put("availability", "Metformin available everywhere, Insulin at referral hospitals");
					medicines.put("price_range", "50-500 Birr/month");
					break;
					case "malaria":
					medicines.put("medicines", new JSONArray("['Artemether-Lumefantrine','Chloroquine','Quinine']"));
					medicines.put("availability", "Free at public health facilities");
					medicines.put("price_range", "Free (public) - 200 Birr (private)");
					break;
					default:
					medicines.put("medicines", new JSONArray("[]"));
					medicines.put("message", "Consult healthcare provider for medication");
				}
			} catch (Exception e) {
				Log.e(TAG, "Medicine lookup error", e);
			}
			return medicines.toString();
		}
		
		@JavascriptInterface
		public void logAnalysis(String data) {
			currentAnalysisData = data;
			sharedPreferences.edit().putString("last_analysis", data).apply();
			Log.d(TAG, "Analysis logged: " + data);
		}
		
		@JavascriptInterface
		public String getLastAnalysis() {
			return currentAnalysisData.isEmpty() ? 
			sharedPreferences.getString("last_analysis", "{}") : 
			currentAnalysisData;
		}
	}
	
	// ============================================
	// NETWORK UTILITY
	// ============================================
	public static class NetworkUtil {
		public static boolean isNetworkAvailable(Activity activity) {
			android.net.ConnectivityManager cm = (android.net.ConnectivityManager) 
			activity.getSystemService(CONNECTIVITY_SERVICE);
			if (cm != null) {
				android.net.NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
				return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
			}
			return false;
		}
	}
	
}