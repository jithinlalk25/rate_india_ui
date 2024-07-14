const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.androjlk.rateindia.dev";
  }

  if (IS_PREVIEW) {
    return "com.androjlk.rateindia.preview";
  }

  return "com.androjlk.rateindia";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Rate India (Dev)";
  }

  if (IS_PREVIEW) {
    return "Rate India (Preview)";
  }

  return "Rate India";
};

export default {
  expo: {
    name: getAppName(),
    slug: "rate_india_ui",
    scheme: "rate-india-ui",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      config: {
        usesNonExemptEncryption: false,
      },
      bundleIdentifier: getUniqueIdentifier(),
      buildNumber: "1",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: getUniqueIdentifier(),
      versionCode: "1",
      googleServicesFile: "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-router", "expo-secure-store"],
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "ec98f2fa-b323-41d7-98d5-85979cbb7258",
      },
    },
    owner: "jithinlalk25",
  },
};
