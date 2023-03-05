노마드코더 "Gulp 90분 마스터하기" 강의 연습 repository입니다.

https://pajaritomoyqi.github.io/nomad-GULP-90min

### version dependency

del@4.1.1
gulp-image@6.2.1

### 2023/3/4

폴더명에 `[]`가 들어가 있으면 안 된다....

나름 `[`의 갯수에 따라 의미가 있었는데...

다 underscore로 바꾸었다...

시간을 많이 날렸다...

gulp는 디버깅이 좀 쉽지 않은 것 같다...

슬프다...

### 2023/3/5

underscore는 sass에게 compile하지 않도록 이야기를 해주는 용도다.

### 2023/3/6

만일 완전 같은 directory structure를 가지게 하고자 한다면 아래와 같이 하면 된다.

```js
gulp.src(["assets/file.doc"], {base: "."})
  .pipe(gulp.dest("dist/"));
```

nomad 코드 기반으로 하자면 아래와 같다(delpoy와 dev 로직을 망치기 때문에, 코드는 수정하지 않았다)

```js
const img = () => {
  return gulp.src(routes.img.src, {base: "."})
    .pipe(gimage())
    .pipe(gulp.dest(routes.img.dest));
}

// pug to html

const pug = () => {
  return gulp.src(routes.pug.src, {base: "."})
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));
}

// sass

const styles = () => {
  return gulp.src(routes.scss.src, {base: "."})
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer()) // setting is in package.json file
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));
}

// Javascript

const js = () => {
  return gulp.src(routes.js.src, {base: "."})
    .pipe(bro({
      transform: [
        babelify.configure({ presets: ["@babel/preset-env"] }),
        [ "uglifyify", { global: true } ]
      ]
    }))
    .pipe(gulp.dest(routes.js.dest));
}
```