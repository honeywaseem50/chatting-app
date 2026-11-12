 
import "./globals.css";

export const metadata = {
  title: "Chatting App",
  description: "A beautiful group messaging application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
