import { AudioSyncProvider } from "@/contexts/AudioSyncContext";
import { EventLogProvider } from "@/contexts/EventLogContext";
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
  const { auth, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
   if (isLoading) {
      return;
    }

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";

    if (!auth && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (auth && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isLoading, auth, segments]); 

    if (isLoading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)"  />
      <Stack.Screen name="(tabs)"  />
      <Stack.Screen name="+not-found" />
    </Stack>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  
  
  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SoundProvider>
        <AudioSyncProvider>
          <EventLogProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <ProtectedLayout />
              <StatusBar style="auto" />
            </ThemeProvider>
          </EventLogProvider>
        </AudioSyncProvider>
      </SoundProvider>
    </AuthProvider>
  );
}


