import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

// wpg - used to copy the bootstrap installed via NPM to our public folder
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/bundle.css');
			}
		}),

		// using the rollup-plugin-copy module to copy our bootstrap module code from the modules directory to our build directory
		// as well as copy the service worker, manifest, and images
		copy({
            targets: [{ 
                src: 'node_modules/bootstrap/dist/**/*', 
                dest: 'public/vendor/bootstrap' 
			},
			{ 
                src: 'src/sw.js', 
                dest: 'public/' 
			},
			{ 
                src: 'src/manifest.json', 
                dest: 'public/' 
			},
			{ 
                src: 'src/images/*', 
                dest: 'public/images/'
			}
		]
		}),
		
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

const gulp = require('gulp');
const workboxBuild = require('workbox-build');
// add "service worker" task here
const serviceWorker = () => {
	console.log('init sw workboxBuild');
	return workboxBuild.injectManifest({
	  swSrc: 'src/sw.js',
	  swDest: 'public/sw.js',
	  globDirectory: 'public',
	  globPatterns: [
		'**/*.{html,json,js,css}'
	  ]
	}).then(resources => {
	  console.log(`Injected ${resources.count} resources for precaching, ` +
		  `totaling ${resources.size} bytes.`);
	}).catch(err => {
	  console.log('Uh oh 😬', err);
	});
}
gulp.task('service-worker', serviceWorker);

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
