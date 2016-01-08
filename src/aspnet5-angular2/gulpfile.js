/// <binding />

"use strict";

var gulp = require("gulp"),
		concat = require("gulp-concat"),
		cssmin = require("gulp-cssmin"),
		sass = require("gulp-sass"),
		mainBowerFiles = require('gulp-main-bower-files'),
		typescript = require('gulp-typescript'),
		inlineNg2Template = require('gulp-inline-ng2-template'),
		sourcemaps = require("gulp-sourcemaps"),
		uglify = require("gulp-uglify"),
		del = require("del"),
		merge = require("merge-stream"),
		project = require("./project.json");

var paths = {
	bootstrapDir: "./bower_components/bootstrap-sass",
	webroot: "./" + project.webroot + "/"
};

paths.js = paths.webroot + "./js/**/*";
paths.jsMaps = paths.webroot + "./**/*.js.map";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.cssMaps = paths.webroot + "css/**/*.map";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/app.min.js";
paths.concatCssDest = paths.webroot + "css/app.min.css";

var config = {
	libBase: 'node_modules',
	lib: [
		require.resolve('angular2/bundles/angular2-polyfills.js'),
		require.resolve('reflect-metadata/Reflect.js'),
		require.resolve('systemjs/dist/system.src.js'),
		require.resolve('rxjs/bundles/Rx.js'),
		require.resolve('angular2/bundles/angular2.dev.js'),
		require.resolve('angular2/bundles/http.dev.js'),
		require.resolve('angular2/bundles/router.dev.js'),
		require.resolve('bootstrap/dist/css/bootstrap.css'),
		require.resolve('bootstrap/dist/js/bootstrap.js')
	]
};

gulp.task("build", ["clean", "build.lib", "build.js", "build.css"]);

gulp.task('build.lib', function () {
	var nodeClientLibs = gulp.src(config.lib, { base: config.libBase })
												.pipe(gulp.dest(paths.webroot + 'js/lib'));

	var bowerLibs = gulp.src('./bower.json')
										.pipe(mainBowerFiles({
											overrides: {
												"bootstrap-sass": {
													main: []
												}
											}
										}))
										.pipe(gulp.dest(paths.webroot + 'js/lib'));

	return merge(nodeClientLibs, bowerLibs);
});

gulp.task('build.js', function () {
	var tsProject = typescript.createProject('./tsconfig.json', { typescript: require('typescript') });
	var tsSrcInlined = gulp.src([paths.webroot + 'app/**/*.ts'], { base: paths.webroot })
			.pipe(inlineNg2Template({ base: paths.webroot }));

	return tsSrcInlined
			.pipe(sourcemaps.init())
			.pipe(typescript(tsProject))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(paths.webroot + 'js'));
});

gulp.task("clean.js", function (cb) {
	return del([
		paths.js,
		paths.jsMaps
	]);
});

gulp.task("clean.css", function (cb) {
	return del([
		paths.css,
		paths.cssMaps
	]);
});

gulp.task("clean", ["clean.js", "clean.css"]);

gulp.task("build.css", function () {
	return gulp.src(paths.webroot + "css/**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: [paths.bootstrapDir + "/assets/stylesheets"],
		}))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(paths.webroot + "/css"));
});

gulp.task("min.js", function () {
	return gulp.src([paths.j, "!" + paths.minJs], { base: "." })
		.pipe(concat(paths.concatJsDest))
		.pipe(uglify())
		.pipe(gulp.dest("."));
});

gulp.task("min.css", function () {
	return gulp.src([paths.css, "!" + paths.minCss])
		.pipe(concat(paths.concatCssDest))
		.pipe(cssmin())
		.pipe(gulp.dest("."));
});

gulp.task("min", ["build", "min.js", "min.css"]);

gulp.task("default", ["build"]);