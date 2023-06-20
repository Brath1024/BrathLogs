import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Brath-Blog",
      description: "Brath Blog",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Brath的博客空间",
      description: "Brath的博客空间",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
