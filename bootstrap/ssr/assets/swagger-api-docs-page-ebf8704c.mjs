import { jsxs, jsx } from "react/jsx-runtime";
import SwaggerUI from "swagger-ui-react";
import { useMemo } from "react";
import { u as useSettings, N as Navbar, aS as Footer } from "../server-entry.mjs";
import "react-dom/server";
import "process";
import "http";
import "@tanstack/react-query";
import "axios";
import "react-router-dom/server.mjs";
import "framer-motion";
import "slugify";
import "deepmerge";
import "clsx";
import "@internationalized/date";
import "nano-memoize";
import "zustand";
import "zustand/middleware/immer";
import "nanoid";
import "react-router-dom";
import "@internationalized/number";
import "react-hook-form";
import "@react-aria/utils";
import "@react-stately/utils";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "@react-aria/focus";
import "react-dom";
import "@react-aria/ssr";
import "immer";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "react-use-clipboard";
const swaggerUi = "";
function SwaggerApiDocsPage() {
  const settings = useSettings();
  const plugins = useMemo(() => {
    return getPluginsConfig(settings);
  }, [settings]);
  return /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto h-full bg-alt", children: [
    /* @__PURE__ */ jsx(Navbar, { size: "sm" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto", children: [
      /* @__PURE__ */ jsx(
        SwaggerUI,
        {
          url: `${settings.base_url}/swagger.yaml`,
          plugins
        }
      ),
      /* @__PURE__ */ jsx(Footer, { className: "px-20" })
    ] })
  ] });
}
function getPluginsConfig(settings) {
  return [
    {
      statePlugins: {
        spec: {
          wrapActions: {
            updateSpec: (oriAction) => {
              return (spec) => {
                spec = spec.replaceAll(
                  "SITE_NAME",
                  settings.branding.site_name
                );
                spec = spec.replaceAll("SITE_URL", settings.base_url);
                return oriAction(spec);
              };
            },
            // Add current server url to docs
            updateJsonSpec: (oriAction) => {
              return (spec) => {
                spec.servers = [{ url: `${settings.base_url}/api/v1` }];
                return oriAction(spec);
              };
            }
          }
        }
      }
    }
  ];
}
export {
  SwaggerApiDocsPage as default
};
//# sourceMappingURL=swagger-api-docs-page-ebf8704c.mjs.map
