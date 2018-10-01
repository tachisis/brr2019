var options = {};
var fs = require('fs');

options.argv = require('yargs').argv;

// Root directory for assets.
options.basedir = 'src/static/';

// Browser sync options (http://www.browsersync.io/docs/options/).
// browserSync.proxy    - Proxy an EXISTING vhost. Used for `gulp watch`.
options.browserSync = {
    proxy   : "127.0.0.1:4000",
    logLevel: "silent",
    notify  : false
};

// List of sources to extract localized styles.
options.localize = [];

// List of styles to apply rtl-postprocessor.
options.rtlize = ['*-ar.css'];

// Create rtl copy compiled from this sources, -rtl suffix will be added.
options.rtlcopy = [];

// Directories names.
options.dirs = {
    css    : 'css/',
    html   : 'templates/',
    img    : 'i/dest/',
    imgsrc : 'i/src/',
    js     : 'js/',
    scss   : 'scss/',
    svg    : 'svg/'
};


// Path relative to gulpfile.js, to store...
// paths.css        - compiled and processed CSS.
// paths.html       - HTML files.
// paths.img        - optomized image files.
// paths.imgsrc     - not optimized source image files.
// paths.js         - JS scriptes.
// paths.scss       - SCSS sources.
// paths.sprites    - sprite source directories.
// paths.svg        - SVG source files.
options.paths = {
    css       : options.basedir + options.dirs.css,
    html      : options.dirs.html,
    img       : options.basedir + options.dirs.img,
    imgsrc    : options.basedir + options.dirs.imgsrc,
    js        : options.basedir + options.dirs.js,
    scss      : options.basedir + options.dirs.scss,
    svg       : options.basedir + options.dirs.svg
};

// A single glob or array of globs that indicate which files to watch for
// changes.
// Used for `gulp watch`.
// `options.files.img` used in images proccessing task.
options.files = {
    css    : [options.paths.css + '**/*.css'],
    html   : [options.paths.html + '**/*.html'],
    img    : [
        options.paths.imgsrc + '**/*.+(png|jpg|gif|svg)',
        options.paths.scss + '**/*.+(png|jpg|gif|svg)'
    ],
    js     : [options.paths.js + '**/*.js'],
    scss   : [options.paths.scss + '**/*.scss'],
    svg    : [options.paths.svg + '**/*.svg']
};



// PostCSS processors and options.
// Autoprefixer (https://github.com/postcss/autoprefixer).
//
// CSS MQPacker (https://github.com/hail2u/node-css-mqpacker).
// sort                 - set true to sort queries automatically
//
// Assets (https://github.com/borodean/postcss-assets).
// assets.basePath      - Processor would treat this directory as / for all
//                        URLs and load paths would be relative to it.
// assets.loadPaths     - Processor will search for files in this specific
//                        directories (relative to basePath).
// assets.baseUrl       - The URL of base path.
// assets.cachebuster   - Cache busting function, changes urls depending on
//                        asset’s filesize in bytes.
options.postcss = {
    autoprefixer: {
        browsers: ['last 2 version']
    },
    assets      : {
        basePath   : options.basedir,
        loadPaths  : [options.dirs.img],
        baseUrl    : '/static/',
        cachebuster: function(path) {
            return fs.statSync(path).size.toString(16);
        }
    },
    mqpacker    : {
        sort: true
    }
};

// Sprites options (https://github.com/aslansky/css-sprite).
// sprites.prefix        - This prefix will be added to the class name in CSS
//                         and name of sprite image and SCSS file.
// sprites.src           - Source directory to looking for subdirectories with
//                         images. The name of the sprites subdirectory should
//                         start with `options.sprites.prefix` or it will be
//                         ignored. Sprite images will be stored at
//                         `options.sprites.dest` directory.
//                         Sprite SCSS will be stored at the same parent
//                         directory as directory with sprite source images
//                         (`options.sprites.src`).
//                         If directory name ends with `@2x`, normal and retina
//                         sprites will be created.
// sprites.dest          - Target directory to store sprite images.
// sprites.scss          - Target directory to store SCSS.
// sprites.url           - HTTP path to images on the web server, used in scss,
//                         i.e. background: url('i/sprites/').
// sprites.orientation   - Orientation of the sprite image
//                         (vertical|horizontal|binary-tree).
// sprites.margin        - Margin in px between images in sprite.
// sprites.template      - Output mustache template file.
// sprites.interpolation - Interpolation algorithm used when scaling retina
//                         images to standard definition.
//                         Possible values are nearest-neighbor, moving-average,
//                         linear, grid, cubic, lanczos.
options.sprites = {
    prefix       : 'sprite-',
    src          : options.paths.scss,
    dest         : options.paths.img,
    url          : options.dirs.img,
    orientation  : 'binary-tree',
    margin       : 10,
    template     : './gulp/utils/gulp-sprite.mustache',
    interpolation: 'cubic'
};

// Exclude directories with _ at the beginning of the name
options.files.img.push('!**/_**/**/');

// Exclude sprite source directories from been copied to image dest directory
options.files.img.push('!**/'+ options.sprites.prefix + '**/**/');

// Ignore svg images with `sprite-` prefix from been copied to image dest
// directory. They used in svg sprites (svg task).
options.files.img.push('!**/sprite-*.svg');

// Hack to copy object
options.linter = JSON.parse(JSON.stringify(options.files.scss));

// Exclude directories from scss linter.
// Don't lint directories with _ at the beginning of the name, tools, settings.
options.linter.push('!**/_**/**/');
options.linter.push('!**/tools/**/');
options.linter.push('!**/settings/**/');

// Ignore automatically generated sprite files
options.linter.push('!**/_' + options.sprites.prefix + '*');

module.exports = options;
