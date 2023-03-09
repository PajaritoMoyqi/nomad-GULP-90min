import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import gimage from 'gulp-image';
import gsass from "gulp-sass";
import nsass from "node-sass";
import autoprefixer from 'gulp-autoprefixer';
import miniCSS from 'gulp-csso';
import bro from 'gulp-bro';
import babelify from 'babelify';
import ghPages from 'gulp-gh-pages';
import gchanged from 'gulp-changed';
import path from 'path';

const sass = gsass(nsass);

// index.pug to index.html

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: 'src/*.pug',
    dest: 'build/',
  },
  img: {
    src: "src/img/*",
    dest: "build/img/",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css/",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js/",
  }
};

// clean the build folder

const clean = () => {
  return del([routes.pug.dest, ".publish"]);
}

// image

const img = () => {
  return gulp.src(routes.img.src)
    .pipe(gchanged(routes.img.dest, {hasChanged: gchanged.compareLastModifiedTime}))
    .pipe(gimage())
    .pipe(gulp.dest(routes.img.dest));
}

// pug to html

const pug = () => {
  return gulp.src(routes.pug.src)
    .pipe(gchanged  (routes.pug.dest, {hasChanged: gchanged.compareLastModifiedTime}))
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));
}

// sass

const styles = () => {
  return gulp.src(routes.scss.src)
    .pipe(gchanged(routes.scss.dest, {hasChanged: gchanged.compareLastModifiedTime}))
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer()) // setting is in package.json file
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));
}

// Javascript

const js = () => {
  return gulp.src(routes.js.src)
    .pipe(gchanged(routes.js.dest, {hasChanged: gchanged.compareLastModifiedTime}))
    .pipe(bro({
      transform: [
        babelify.configure({ presets: ["@babel/preset-env"] }),
        [ "uglifyify", { global: true } ]
      ]
    }))
    .pipe(gulp.dest(routes.js.dest));
}

// webserver on

const webserver = () => gulp.src(routes.pug.dest).pipe(ws({livereload: true, open: true}));

// watch files

const watchUnlink = (unlinkDest, filePath) => {
  const filePathFromSrc = path.relative(path.resolve(unlinkDest), filePath);
  const destFilePath = path.resolve(routes.img.dest, filePathFromSrc);

  del.sync(destFilePath);
}

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img).on('unlink', function(filePath) { watchUnlink('src/img/', filePath) });
  gulp.watch(routes.scss.watch, styles).on('unlink', function(filePath) { watchUnlink('src/scss/', filePath) });
  gulp.watch(routes.js.watch, js).on('unlink', function(filePath) { watchUnlink('src/js/', filePath) });
}

// deploy

const gh = () => {
  return gulp.src("build/**/*")
    .pipe(ghPages());
}

// series

const prepare = gulp.series([clean]);
const assets = gulp.series([img, pug, styles, js]);
// two task, so parallel
const postDev = gulp.parallel([watch]);

// main function

export const example = gulp.series([assets]);

export const build = gulp.series([prepare, assets]);

export const dev = gulp.series([prepare, assets, postDev]);

export const deploy = gulp.series([build, gh, clean]);