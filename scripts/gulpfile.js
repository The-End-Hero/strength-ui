/**
 * @name gulpfile.js
 * @description 打包项目css依赖
 * 参考
 * https://github.com/JeromeLin/dragon-ui/blob/dev/scripts/gulp/gulpfile.js
 */

const path = require("path");
const gulp = require("gulp");
const concat = require("gulp-concat");
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const size = require("gulp-filesize");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const { name } = require("../package.json");
const del = require("del");
const browserList = [
  "last 2 versions",
  "Android >= 4.0",
  "Firefox ESR",
  "not ie < 9"
];

const DIR = {
  less: path.resolve(__dirname, "../components/**/*.less"),
  dts: path.resolve(__dirname, "../components/**/*.d.ts"),
  js: path.resolve(__dirname, "../components/**/*.js"),
  js_map: path.resolve(__dirname, "../components/**/*.js.map"),
  buildSrc: [
    path.resolve(__dirname, "../components/**/styles.less"),
    path.resolve(__dirname, "../components/**/index.less")
  ],
  lib: path.resolve(__dirname, "../lib"),
  es: path.resolve(__dirname, "../es"),
  lib_css: path.resolve(__dirname, "../lib/**"),
  es_css: path.resolve(__dirname, "../es/**"),
  dist: path.resolve(__dirname, "../dist")
};
// 将components目录下less拷贝到lib es下
gulp.task("copyLess", () => {
  return gulp
    .src(DIR.less)
    .pipe(gulp.dest(DIR.lib))
    .pipe(gulp.dest(DIR.es));
});
// 删除tsc编译js/js.map文件
gulp.task("deleteJS", async() => {
  await del([DIR.js, DIR.js_map],{force: true});
});

// 将d.ts拷贝到lib es 目录下
gulp.task("copyDts", () => {
  return gulp
    .src(DIR.dts)
    .pipe(gulp.dest(DIR.lib))
    .pipe(gulp.dest(DIR.es));
});
gulp.task("copyCss", () => {
  return gulp
    .src(DIR.buildSrc)
    .pipe(sourcemaps.init())
    .pipe(
      less({
        outputStyle: "compressed"
      })
    )
    .pipe(autoprefixer({ overrideBrowserslist: browserList }))
    .pipe(size()) // css大小日志
    .pipe(cssnano({
      zindex: false,
      reduceIdents: false
    })) // css压缩
    .pipe(gulp.dest(DIR.lib))
    .pipe(gulp.dest(DIR.es));
});

gulp.task("dist", () => {
  return gulp
    .src(DIR.buildSrc)
    .pipe(sourcemaps.init())
    .pipe(
      less({
        outputStyle: "compressed"
      })
    )
    .pipe(autoprefixer({ overrideBrowserslist: browserList }))
    .pipe(concat(`${name}.css`))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(sourcemaps.write())
    .pipe(rename(`${name}.css.map`))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))

    .pipe(cssnano({
      zindex: false,
      reduceIdents: false
    }))
    .pipe(concat(`${name}.min.css`))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(sourcemaps.write())
    .pipe(rename(`${name}.min.css.map`))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist));
});

gulp.task("default", gulp.series("deleteJS", "copyDts", "copyLess", "copyCss", "dist"));
