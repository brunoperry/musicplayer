const { src, dest, watch, series } = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser");
const concat = require("gulp-concat");
const strReplace = require("gulp-string-replace");
const each = require("gulp-each");
const inlinesource = require("gulp-source-injector");
const cleanCSS = require("gulp-clean-css");

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
  "./src/Utils.js",
  "./src/components/Component.js",
  "./src/components/Controls.js",
  "./src/components/Info.js",
  "./src/components/List.js",
  "./src/components/Locker.js",
  "./src/components/Menu.js",
  "./src/components/Player.js",
  "./src/components/Settings.js",
  "./src/components/buttons/Button.js",
  "./src/components/buttons/IconButton.js",
  "./src/components/buttons/LabelButton.js",
  "./src/components/buttons/ListButton.js",
  "./src/components/buttons/ToggleButton.js",
  "./src/components/inputs/Breadcrumb.js",
  "./src/components/inputs/RangeSlider.js",
  "./src/components/Splash.js",
  "./src/backend.js",
  "./src/main.js",
];

//METHODS
const watchTask = () => {
  watch("src/*.js", minifyJS);
};

const minifyCSS = () => {
  return src("styles.css").pipe(cleanCSS()).pipe(dest("dist/css/"));
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

const inject2HTML = () => {
  return src("index_deploy.html")
    .pipe(inlinesource())
    .pipe(dest("./dist/index.html"));
};

exports.default = series(minifyJS, minifyCSS, inject2HTML);
