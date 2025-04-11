import "./globals.css";
import ThemeRegistry from "@/app/styles/themeRegistry";
import { MessageProvider } from "@/app/context/MessageContext";

export const metadata = {
  title: "OSHRM Interactive Timeline",
  description:
    "Explore the people behind OSHRM — an interactive showcase of board and team members.",
  keywords:
    "OSHRM, Interactive Timeline, Board Members, Team Members, WhiteWall, WhiteWall Digital Solutions, WWDS, wwds",
  author: "WhiteWall Digital Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#96D8EA" />
        <link rel="icon" href="/osh-icon.png" type="image/png" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
      </head>
      <body>
        <ThemeRegistry>
          <MessageProvider>{children}</MessageProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
