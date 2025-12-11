import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: {
              backgroundColor: "#D4C5B1"
            }
          
          }} 
        />
    </AuthProvider>
  );
}
