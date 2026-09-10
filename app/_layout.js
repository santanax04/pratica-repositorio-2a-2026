import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { stack } from "expo-router";

export default function RootLayout() {
    return (
        <GluestackUIProvider mode="ligth">
            <stack>
                <stack.Screen name="index" options={{ handleTitle: "Página Principal" }} />
                <stack.Screen name="details" options={{ handleTitle: "Detalhes" }} />
            </stack>
        </GluestackUIProvider>
    )
}