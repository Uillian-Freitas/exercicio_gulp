const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');

function limpaBuild() {
  return gulp.src('build', { allowEmpty: true, read: false })
    .pipe(clean());
}

function compilaSass() {
  return gulp.src('source/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ 
        outputStyle: 'compressed',
        quietDeps: true, 
        silenceDeprecations: ['import'] 
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/styles'));
}

function comprimeImagens() {
  return gulp.src('source/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'));
}

function comprimeJavaScript() {
  return gulp.src('source/scripts/main.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/scripts'));
}

function observaArquivos() {
  gulp.watch('source/styles/**/*.scss', compilaSass);
  gulp.watch('source/scripts/**/*.js', comprimeJavaScript);
  gulp.watch('source/images/*', comprimeImagens);
}

const build = gulp.series(
  limpaBuild,
  gulp.parallel(compilaSass, comprimeImagens, comprimeJavaScript)
);

exports.clean = limpaBuild;
exports.sass = compilaSass;
exports.images = comprimeImagens;
exports.scripts = comprimeJavaScript;
exports.watch = observaArquivos;
exports.build = build;