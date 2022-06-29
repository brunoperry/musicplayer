const { src, dest, watch, series } = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser");
const concat = require("gulp-concat");
const strReplace = require("gulp-string-replace");
const each = require("gulp-each");
const inlinesource = require("gulp-source-injector");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const copy = require("gulp-copy");

//PROPS
let scriptName = "script.js";
const terser_config = {
  compress: {
    dead_code: true,
    drop_console: true,
    drop_debugger: true,
    keep_classnames: false,
    keep_fargs: false,
    keep_fnames: false,
    keep_infinity: false,
  },
  mangle: {
    eval: false,
    keep_classnames: true,
    keep_fnames: false,
    toplevel: false,
    safari10: false,
  },
  module: true,
  sourceMap: false,
  output: {
    comments: false,
  },
};

const modules = [
  "./public/src/Utils.js",
  "./public/src/components/Component.js",
  "./public/src/components/Controls.js",
  "./public/src/components/Info.js",
  "./public/src/components/List.js",
  "./public/src/components/Locker.js",
  "./public/src/components/Menu.js",
  "./public/src/components/Player.js",
  "./public/src/components/Settings.js",
  "./public/src/components/buttons/Button.js",
  "./public/src/components/buttons/IconButton.js",
  "./public/src/components/buttons/LabelButton.js",
  "./public/src/components/buttons/ListButton.js",
  "./public/src/components/buttons/ToggleButton.js",
  "./public/src/components/inputs/Breadcrumb.js",
  "./public/src/components/inputs/RangeSlider.js",
  "./public/src/components/Splash.js",
  "./public/src/backend.js",
  "./public/src/main.js",
];

//METHODS
const minifyCSS = () => {
  return src("public/styles.css").pipe(cleanCSS()).pipe(dest("dist/css/"));
};
const minifyJS = () => {
  return (
    src(modules)
      .pipe(
        each((content, file, callback) => {
          if (file.basename !== "backend.js") {
            let out = [];
            content.split("\n").forEach((ln) => {
              if (ln.includes("import ")) ln = `//${ln}`;
              out.push(ln);
            });
            content = out.join("\n");
          }
          callback(null, content);
        })
      )
      .pipe(strReplace("export default", ""))
      // .pipe(sourcemaps.init())
      .pipe(concat(scriptName))
      .pipe(terser(terser_config))
      // .pipe(sourcemaps.write('./'))
      .pipe(dest("dist/js"))
  );
};
const copyFiles = () => {
  return src([
    "public/data.json",
    "public/loading_bar.svg",
    "public/manifest.json",
    "public/settings.json",
    "public/icon.svg",
    "public/icon192.png",
    "public/icon512.png",
    "public/service-worker.js",
    "public/offline.html",
  ]).pipe(dest("dist/"));
};

const inject2HTML = () => {
  return src("index_deploy.html")
    .pipe(rename("index.html"))
    .pipe(inlinesource())
    .pipe(dest("./dist/"));
};

exports.default = series(copyFiles, minifyJS, minifyCSS, inject2HTML);
