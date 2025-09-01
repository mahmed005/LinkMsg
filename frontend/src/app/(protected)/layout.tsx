import { PropsWithChildren } from "react";
import "./globals.css";
import { auth } from "@/auth";
import CustomThemeProvider from "./CustomThemeProvider";
import { getMediaUrl } from "../utils/actions";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  let imageUrl = session?.user?.image;
  if (imageUrl && !imageUrl.startsWith("https"))
    imageUrl = await getMediaUrl(imageUrl);

  return (
    <html>
      <head>
        <title>LinkMsg</title>
        {/* <link rel="icon" href="" /> */}
      </head>
      <body className="w-screen min-h-screen h-screen pt-[calc(100px+1.125rem)] px-[3rem] overflow-y-auto overflow-x-hidden">
        <CustomThemeProvider image={imageUrl} session={session}>
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  );
}
