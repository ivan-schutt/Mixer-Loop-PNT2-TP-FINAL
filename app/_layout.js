import { SoundProvider } from "@/contexts/SoundContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";


SplashScreen.preventAutoHideAsync();

function ProtectedLayout() {
  const { auth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (segments.length === 0) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!auth && !inAuthGroup) {
      router.replace("/login");
    } else if (auth && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [auth, segments]); 


  return <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  
  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SoundProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <ProtectedLayout />
          <StatusBar style="auto" />
        </ThemeProvider>
      </SoundProvider>
    </AuthProvider>
  );
}