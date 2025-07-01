import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";

export default function StackLayout(){

  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"  />
        <Stack.Screen name="login"  />
        <Stack.Screen name="register"  />
      </Stack>
    </SafeAreaView>
  );
}



