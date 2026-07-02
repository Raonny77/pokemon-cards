import "./globals.css";

export const metadata = {
  title: "Pokemon Cards",
  description: "Gerenciamento de Cards Pokemon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
