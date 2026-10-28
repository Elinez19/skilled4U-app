export default {
  expo: {
    name: "Skilled4U",
    slug: "skilled4u-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "skilled4uapp",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.elinez.skilled4uapp",
    },
    android: {
      package: "com.elinez.skilled4uapp",
      adaptiveIcon: {
        backgroundColor: "#F4FAFF",
        foregroundImage: "./assets/images/icon.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          imageWidth: 260,
          resizeMode: "contain",
          backgroundColor: "#F4FAFF",
          dark: {
            backgroundColor: "#F4FAFF",
          },
        },
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Skilled4U to use your location to find nearby artisans."
        }
      ],
      "expo-image",
      "expo-secure-store",
      "expo-web-browser",
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 24,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: false,
    },
    extra: {
      eas: {
        projectId: "d60efe8c-c20d-498d-9118-8048df43b298"
      },
    },
  },
};
