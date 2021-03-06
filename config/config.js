// https://umijs.org/config/
import os from "os";
import pageRoutes from "./router.config";
import webpackPlugin from "./plugin.config";
import defaultSettings from "../src/defaultSettings";

const plugins = [
  [
    "umi-plugin-react",
    {
      antd: true,
      dva: {
        hmr: true
      },
      targets: {
        ie: 11
      },
      locale: {
        enable: true, // default false
        default: "zh-CN", // default zh-CN
        baseNavigator: true // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: "./components/PageLoading/index"
      },
      ...(!process.env.TEST && os.platform() === "darwin"
        ? {
            dll: {
              include: ["dva", "dva/router", "dva/saga", "dva/fetch"],
              exclude: ["@babel/runtime"]
            },
            hardSource: true
          }
        : {})
    }
  ]
];

// judge add ga
if (process.env.APP_TYPE === "site") {
  plugins.push([
    "umi-plugin-ga",
    {
      code: "UA-72788897-6"
    }
  ]);
}
console.log(process.env.API_ENV);
export default {
  // add for transfer to umi
  plugins,
  targets: {
    ie: 11
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || "",
    "process.env": {
      API_ENV: process.env.API_ENV // 这里是重点吧，获取配置
    },
    SERVER_IP: {
      API:
        process.env.API_ENV == "dev"
          ? "http://localhost:8426"
          : "http://118.24.218.25:8426",
      SOCKET:
        process.env.API_ENV == "dev"
          ? "http://118.24.218.25:9090"
          : "http://118.24.218.25:9090",
      FILE: "http://file.1024sir.com/"
    }
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    "primary-color": defaultSettings.primaryColor
  },
  externals: {
    "@antv/data-set": "DataSet"
  },
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  proxy: {
    "/api": {
      target:
        process.env.API_ENV == "dev"
          ? "http://localhost:8426"
          : "http://118.24.218.25:8426",
      // target: 'http://118.24.218.25:8426/',
      changeOrigin: true
    },
    "/publicApi": {
      target:
        process.env.API_ENV == "dev"
          ? "http://localhost:8426"
          : "http://118.24.218.25:8426",
      // target: 'http://118.24.218.25:8426/',
      changeOrigin: true
    }
  },

  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes("node_modules") ||
        context.resourcePath.includes("ant.design.pro.less") ||
        context.resourcePath.includes("global.less")
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace(".less", "");
        const arr = antdProPath
          .split("/")
          .map(a => a.replace(/([A-Z])/g, "-$1"))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join("-")}-${localName}`.replace(/--/g, "-");
      }
      return localName;
    }
  },
  manifest: {
    basePath: "/"
  },

  hash: true,
  chainWebpack: webpackPlugin
};
