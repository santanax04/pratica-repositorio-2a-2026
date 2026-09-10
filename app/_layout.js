import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { stack } from "expo-router";

export default function RootLayout() {
    return (
        <GluestackUIProvider mode="ligth">
            <stack>
                <stack.Screen name="index"/>
                <stack.Screen name="details"/>
            </stack>
        </GluestackUIProvider>
    )
}