import { Config } from "@stencil/core";

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: "src/global/app.css",
  globalScript: "src/global/app.ts",
  outputTargets: [
    {
      type: "www",
      resourcesUrl: "build/app/"
    }
  ],
  copy: [
    {
      src: '../node_modules/@ionic/core',
      dest: 'vendor/ionic'
    },
    {
      src: 'gsap/ThrowPropsPlugin.js',
      dest: 'vendor/gsap/ThrowPropsPlugin.js',
    }
  ]
};
