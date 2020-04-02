import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import terser from 'terser';	// using the basic terser since we need to run this after processing the build files
import fs from 'fs-extra';	// used in connection with terser to update the fileVersion string in our build files

// cache files offline
import workbox from 'rollup-plugin-workbox-build'

// wpg - used to copy the bootstrap installed via NPM to our public folder
import copy from 'rollup-plugin-copy';

// used to replace instances of 'caching versions' in our build files
import replace from 'replace-in-file';	

const production = !process.env.ROLLUP_WATCH;
const fileVersion = 'v0.1.204';	// change this when we want to update the file cache

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [

		// clear out the staging directory
		updateStagingDir(),

		runCodeVersionReplaceOnStaging(),

		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/bundle.css');
			}
		}),

		//throwOut(),	// use if we want to stop the code at some point

		// using the rollup-plugin-copy module to copy our bootstrap module code from the modules directory to our build directory
		// as well as copy the service worker, manifest, idb handler, and images
		copy({
            targets: [{ 
                src: 'staging/bs4.4.1.css', 
                dest: 'public/' 
			},
			{ 
                src: 'staging/sw.js',
                dest: 'public/' 
			},
			{ 
                src: 'staging/index.html',
                dest: 'public/' 
			},
			{ 
                src: 'staging/manifest.json', 
                dest: 'public/' 
			},
			{ 
                src: 'staging/images/*', 
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
		// cache files
		workbox({
			mode: 'injectManifest',
			options: {
				swSrc: 'staging/sw.js',
				swDest: 'public/sw.js',
				globDirectory: 'public',
				globPatterns: [
				'**/*.{json,js,css,png,map}',
				'./manifest.json',
				'./images/**',
				'./bs4.4.1.css',
				'./index.html'
				]
			}
			}),


		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && serve(true)
		
	],
	watch: {
		clearScreen: false
	}
};

// we need to clear and update the staging directory syncronously
function updateStagingDir() {
	console.log('Clear staging directory');
	
	try {
		fs.emptyDirSync('staging');
		console.log('Empty staging directory');
	} catch (err) {
		throw "err";
	}

	try {
		fs.copySync('src', 'staging');
		console.log('Copied src to staging');
	} catch (err) {
		throw "err";
	}
	console.log('Updated staging directory');
}

function runCodeVersionReplaceOnStaging() {
	
	// this function simply replaces text in our staging files to help clear the file cache when the code is built
	const replaceResults = replace.sync({
		files: [
			'staging/index.html',
			'staging/main.js',
			'staging/manifest.json'
		],
		from: /__cVersion__/g,
		to: fileVersion,
		});
	// var code = fs.readFileSync("staging/index.html", "utf8");
	// console.log(code);
	console.log(replaceResults);
}

function throwOut() {
	throw 'end this code run';
}

// default to starting dev build (prodBuild=true for production build)
function serve(prodBuild=false){
	 let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});

				// this function simply replaces text in our build files to help clear the file cache (not local storage)
				replace.sync({
					files: [
						'public/index.html',
						'public/manifest.json',
						'public/build/bundle.js'
					],
					from: /__cVersion__/g,
					to: fileVersion,
				  });

				//console.log('terser me');
				if (prodBuild) {
					var code = fs.readFileSync("public/build/bundle.js", "utf8");
					fs.writeFileSync("public/build/bundle.js", terser.minify(code).code, "utf8");
				}
				  
			}
		}
	};
}