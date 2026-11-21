// Guarda, só enquanto o app está aberto, se a animação de entrada já foi mostrada.
let vista = false;
export const introVista = () => vista;
export const marcarIntro = () => {
  vista = true;
};
