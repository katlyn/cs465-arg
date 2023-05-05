/** @type {import('@remix-run/dev').AppConfig} */
const {createRoutesFromFolders} = require("@remix-run/v1-route-convention");
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },

  routes(defineRoutes) {
    return createRoutesFromFolders(defineRoutes)
  }
};
