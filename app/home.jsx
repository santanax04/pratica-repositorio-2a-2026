import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";

export default function app() {
  return (
    <Box className="flex-1 bg-white p-6">
      <VStack space="lg">
        <Heading size="xl">Tela Inicial</Heading>
        <Text size="md">
              Esta é a rota "/" (arquivo app/home.jsx). Os botões abaixo levam para a mesma tela de detalhes,
              usando as formas de navegar do expo-router.
        </Text>
           <divider />

      </VStack>
    </Box>
  );
}