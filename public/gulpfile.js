var
/******************************<PLUGINS>********************************/
gulp = require('gulp'),
gulpLoadPlugins = require('gulp-load-plugins'),
p = gulpLoadPlugins(),
browserSync = require("browser-sync").create(),
streamqueue = require('streamqueue'),
bowerFiles = require('main-bower-files'),
series = require('stream-series'),
/*****************************</PLUGINS>********************************/

/******************************<CONFIG>********************************/
//PATHS
base = 'www',
paths = {
	base : base,
	browserSync : [base+"/css/*.css",base+"/js/*.js",base+"/*.html"]
},

//TASK PROPERTIES
settings = {
	'browser-sync' : {
		base : paths.base,
		src : paths.browserSync
	},
	inject : {
		external : [
			'<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCUwIMx6QwurUt2ApgaLghDShDq-a9umyY"></script>'
		]
	},
	bower : {
		css : {
			filter : '*.css',
			dest : base+'/css',
			compileFileName : 'libs.css'
		},
		js : {
			filter : '*.js',
			dest : base+'/js',
			compileFileName : 'libs.js'
		},
		fonts : {
			filter : ['*.eot','*.woff','*.woff2','*.ttf','*.svg', '*.otf'],
			dest : base+'/css'
		}
	},
	app : {
		less : {
			src : ['src/less/*.less','src/views/**/*.less','devl/*.less'],
			dest : base+'/css',
			compileFileName : 'styles.css'
		},
		js : {
			src : ['src/*.js','src/**/*.js','src/**/**/*.js','devl/*.js'],
			dest : base+'/js',
			compileFileName : 'app.js',
			debug : true
		},
		templates : {
			src : ['src/views/**/*.html','src/tiles/*.html'],
			dest : base+'/js',
			compileFileName : 'templates.js'
		},
		fonts : {
			src : ['src/fonts/*.eot','src/fonts/*.woff','src/fonts/*.woff2','src/fonts/*.ttf','src/fonts/*.svg', 'src/fonts/*.otf'],
			dest : base+'/css'
		},
		images : {
			src : ['src/images/*.jpg','src/images/*.png','src/images/*.gif'],
			dest : base+'/images'
		}
	}
};

/*****************************</CONFIG>********************************/



//******************************<INJECTS>**********************************

var bowerJs,
	bowerCss,
	appLess,
	appJs,
	appTemplates;

/****<DEPENDENCIAS DE LA APLICACIÓN Y/O LIBRERIAS DE BOWER>****/

gulp.task('bower:css', function(){			var options = settings.bower.css;
	bowerCss = gulp.src(bowerFiles())
	.pipe(p.filter(options.filter))
	.pipe(p.concat(options.compileFileName))
    .pipe(gulp.dest(options.dest));
});

gulp.task('bower:js', function(){			var options = settings.bower.js;
	bowerJs = gulp.src(bowerFiles())
	.pipe(p.filter(options.filter))
	.pipe(p.concat(options.compileFileName))
	.pipe(p.uglify())
    .pipe(gulp.dest(options.dest));
});

gulp.task('bower:fonts', function(){		var options = settings.bower.fonts;
	gulp.src(bowerFiles())
	.pipe(p.filter(options.filter))
    .pipe(gulp.dest(options.dest));
});

gulp.task('build:dependences',['bower:css','bower:js','bower:fonts']);

/****</DEPENDENCIAS DE LA APLICACIÓN Y/O LIBRERIAS DE BOWER>****/


/***<APP>***/

gulp.task('app:less', function() {			var options = settings.app.less;
	appLess = gulp.src(options.src)
	//.pipe(p.plumber())
	.pipe(p.concat(options.compileFileName))
	.pipe(p.less({compress: true}))
	.pipe(gulp.dest(options.dest));
});

gulp.task('app:js', function(){				var options = settings.app.js;

	appJs = gulp.src(options.src)
	.pipe(p.jshint())
	//.pipe(p.jshint.reporter('default'))
	.pipe(p.concat(options.compileFileName))
	.pipe(p.uglify({
		mangle: false,
		compress: {
			drop_console: !options.debug
		}
	}))
	.pipe(gulp.dest(options.dest));

});

gulp.task('app:templates', function() { 	var options = settings.app.templates;

	appTemplates = gulp.src(options.src)
	.pipe(p.minifyHtml({empty: true}))
	.pipe(p.angularTemplatecache({ module: 'livepost' }))
	.pipe(p.concat(options.compileFileName))
	.pipe(p.uglify({
		mangle: false
	}))
	.pipe(gulp.dest(options.dest));
	
});

gulp.task('app:images', function () {		var options = settings.app.images;
	var stream = gulp.src(options.src);
	return stream.pipe(gulp.dest(options.dest));
});

gulp.task('app:fonts', function () {		var options = settings.app.fonts;
	var stream = gulp.src(options.src);
	return stream.pipe(gulp.dest(options.dest));
});

gulp.task('build:app',['app:less','app:js','app:templates']);

/***</APP>***/


/******************************<INJECTS>**********************************/

/*INJECT WHEN WATCH*/
gulp.task('index', function(){
	var injectOptions = {
		addRootSlash: false,
    	ignorePath : base,
    	relative: false
	};
	var sources = 	gulp.src([base+'/css/*.css',base+'/js/*.js'], {read: false});
    var stream 	= 	gulp.src(['src/index.html'])
				    .pipe(p.inject(sources,injectOptions));

	for(var i in settings.inject.external)
		stream.pipe(p.injectString.before('</head>','\t'+settings.inject.external[i]+'\n'));

  	stream.pipe(gulp.dest(base));
});

/*INJECT WHEN RUN*/
gulp.task('inject', ['build:dependences','build:app'], function(){

    var stream 	= 	gulp.src(['src/index.html'])
				    .pipe(p.inject(series(bowerJs,bowerCss,appLess,appJs,appTemplates),{
				    	addRootSlash: false,
				    	ignorePath : base,
				    	relative: false
				    }));

	for(var i in settings.inject.external)
		stream.pipe(p.injectString.before('</head>','\t'+settings.inject.external[i]+'\n'));

	stream.pipe(gulp.dest(base));

});

/******************************</INJECTS>**********************************/

gulp.task('watch', function(){
	gulp.watch(settings.app.less.src, ['app:less']);
	gulp.watch(settings.app.js.src, ['app:js']);
	gulp.watch(settings.app.templates.src, ['app:templates']);
	gulp.watch(['src/*.html'], ['index']);
});

gulp.task('run', ['app:images','app:fonts','inject','watch'], function() {
	browserSync.init({
        server: {
            baseDir: settings['browser-sync'].base
        }
    });
    gulp.watch(settings['browser-sync'].src).on('change', browserSync.reload);
});

gulp.task('build', ['build:dependences','build:app']);

gulp.task('default', ['run']);