module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');

	var config = {
		lib: [
          'public/lib/angular/angular.js',
          'public/lib/angular-route/angular-route.js',
          'public/lib/angular-sanitize/angular-sanitize.js',
          'public/lib/angular-ui-select/dist/select.js',
		],
		lib_min: [
          'public/lib/angular/angular.min.js',
          'public/lib/angular-route/angular-route.min.js',
          'public/lib/angular-sanitize/angular-sanitize.min.js',
          'public/lib/angular-ui-select/dist/select.min.js',
		],
		app: [
			'public/js/app.js',
			'public/js/controller.js',
			'public/js/service.js'
		],
		less: [
			'public/css/app.less'
		],
		css: [
          'public/css/app.css',
          'public/lib/angular-ui-select/dist/select.css',
          'public/lib/bootstrap/dist/css/bootstrap.css',
          'public/lib/font-awesome/css/font-awesome.css'
		]
	}

	grunt.initConfig({
		uglify: {
			assets: {
				options: {
					preserveComments: false,
					mangle: false
				},
				files: {
					'.tmp/uglifyjs/app.min.js': config.app
				}
			},
			lib: {
				options: {
					preserveComments: false,
					mangle: false
				},
				files: {
					'.tmp/uglifyjs/lib.min.js': config.lib_min,
				}
			}
		},
		concat: {
			'public/dist/main.min.js': ['.tmp/uglifyjs/lib.min.js', '.tmp/uglifyjs/app.min.js']
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/main.min.css': config.css
				}
			}
		},
		less: {
			development: {
				files: {
					'public/css/app.css': config.less
				}
			}
        }
	});

	grunt.registerTask('default', ['less', 'cssmin', 'uglify:assets', 'uglify:lib', 'concat']);
};
