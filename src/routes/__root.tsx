import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { resolvePublicHost } from "@/lib/public-host";
import appCss from "../styles.css?url";

const APP_NAME = "Emulsion";

const shareHost = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const forwarded = getRequestHeader("x-forwarded-host");
    const host = getRequestHeader("host");
    return resolvePublicHost(forwarded || host || "");
  } catch {
    return "";
  }
});

export const Route = createRootRoute({
  loader: () => shareHost(),
  head: ({ loaderData }) => {
    const host = typeof loaderData === "string" ? loaderData : "";
    const xBanner = host ? `https://${host}/x-banner.jpg` : "";
    const meta: Array<Record<string, string>> = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Script to screen. Choose a Hugging Face model at each step — breakdown, character sheets, scene stills, motion, then cut.",
      },
      { name: "theme-color", content: "#0b0b0c" },
    ];
    if (xBanner) {
      meta.push({ property: "x:game:image", content: xBanner });
    }
    return {
      meta,
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "stylesheet", href: appCss },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&display=swap",
        },
      ],
    };
  },
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
