import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import gimage from 'gulp-image';
import gsass from "gulp-sass";
import nsass from "node-sass";
import autoprefixer from 'gulp-autoprefixer';
import miniCSS from 'gulp-csso';

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
  }
};

// clean the build folder

const clean = () => {
  return del([routes.pug.dest]);
}

// image

const img = () => {
  return gulp.src(routes.img.src)
    .pipe(gimage())
    .pipe(gulp.dest(routes.img.dest));
}

// pug to html

const pug = () => {
  return gulp.src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));
}

// sass

const styles = () => {
  return gulp.src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer()) // setting is in package.json file
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));
}

// webserver on

const webserver = () => gulp.src(routes.pug.dest).pipe(ws({livereload: true, open: true}));

// watch files

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
}

// series

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles]);
// two task, so parallel
const postDev = gulp.parallel([webserver, watch]);

// main function

export const dev = gulp.series([prepare, assets, postDev]);