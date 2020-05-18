# SDK Examples

- [SDK Examples](#sdk-examples)
    - [Prerequisites](#prerequisites)
    - [Setup monorepo root](#setup-monorepo-root)
    - [Setup packages](#setup-packages)
    - [Run the inspector app](#run-the-inspector-app)
    - [Run the virtual staging app](#run-the-virtual-staging-app)
    - [Run the magical bunny app](#run-the-magical-bunny-app)
    - [Clean packages](#clean-packages)
    - [Make a prod build](#make-a-prod-build)
    - [Packages](#packages)
      - [vs-app](#vs-app)
      - [inspector](#inspector)
      - [easter](#easter)
      - [common](#common)
      - [core](#core)
      - [bundle](#bundle)
    - [License](#license)

### Prerequisites
Your development environment will need node.js and yarn installed.

See <https://nodejs.org/en/> and <https://classic.yarnpkg.com/en/docs/install> for installation instructions specific to your environment.

> To run the examples, you will need to replace the existing developer key strings with your own. The existing key is `2d4dfb9fd6414902b663c25a6c767cfa`.<br>
> If you need a key, you can request one at our [developer site](https://matterport.github.io/showcase-sdk/index.html).

### Setup monorepo root
Run this when you first download the repo. You will need to provide a password when excuting the `install-bundle` script.
```shell
> yarn install
> yarn install-bundle
yarn run v1.22.4
$ yarn fetch-bundle && yarn expand-bundle
$ curl https://static.matterport.com/misc/bundle/showcase/$npm_package_config_bundle_version/showcase-bundle.zip -o bundle.zip
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 2322k  100 2322k    0     0  3796k      0 --:--:-- --:--:-- --:--:-- 3801k
$ unzip -o bundle.zip -d ./packages/bundle
Archive:  bundle.zip
[bundle.zip] version.txt password:
 extracting: ./packages/bundle/version.txt
 ...
```

### Setup packages
Call this to install or update the package dependencies. It also links local packages together.
```shell
> yarn bootstrap
yarn run v1.21.1
$ lerna bootstrap
lerna notice cli v3.3.2
lerna info Bootstrapping 4 packages
lerna info Installing external dependencies
lerna info Symlinking packages and binaries
lerna success Bootstrapped 4 packages
✨  Done in 20.58s.
```

### Run the inspector app
```shell
> yarn inspector
yarn run v1.22.4
$ lerna run develop --scope=inspector --stream
lerna notice cli v3.3.2
lerna info filter [ 'inspector' ]
lerna info Executing command in 1 package: "yarn run develop"
inspector: warning package.json: "inspector" is also the name of a node core module
inspector: $ webpack-dev-server
inspector: ℹ ｢wds｣: Project is running at http://localhost:8000/
inspector: ℹ ｢wds｣: webpack output is served from /
inspector: ℹ ｢wds｣: Content not from webpack is served from /Users/bguillermo/projects/sdk_examples/packages/inspector
```

### Run the virtual staging app
```shell
> yarn vs-app
yarn run v1.22.4
$ lerna run develop --scope=vs-app --stream
lerna notice cli v3.3.2
lerna info filter [ 'vs-app' ]
lerna info Executing command in 1 package: "yarn run develop"
vs-app: $ webpack-dev-server
vs-app: ℹ ｢wds｣: Project is running at http://localhost:8000/
vs-app: ℹ ｢wds｣: webpack output is served from /
vs-app: ℹ ｢wds｣: Content not from webpack is served from /Users/bguillermo/projects/sdk_examples/packages/vs-app
```

### Run the magical bunny app
```shell
> yarn easter
yarn run v1.22.4
$ lerna run develop --scope=easter --stream
lerna notice cli v3.3.2
lerna info filter [ 'easter' ]
lerna info Executing command in 1 package: "yarn run develop"
easter: $ webpack-dev-server
easter: ℹ ｢wds｣: Project is running at http://localhost:8000/
easter: ℹ ｢wds｣: webpack output is served from /
easter: ℹ ｢wds｣: Content not from webpack is served from /Users/bguillermo/projects/sdk_examples/packages/easter
```

### Clean packages
You will need to bootstrap after cleaning.
```shell
> yarn clean
yarn run v1.21.1
$ lerna clean --yes
lerna notice cli v3.3.2
lerna info clean removing /Users/bguillermo/projects/sdk_examples/packages/bundle/node_modules
lerna info clean removing /Users/bguillermo/projects/sdk_examples/packages/common/node_modules
lerna info clean removing /Users/bguillermo/projects/sdk_examples/packages/inspector/node_modules
lerna info clean removing /Users/bguillermo/projects/sdk_examples/packages/vs-app/node_modules
lerna success clean finished
✨  Done in 5.11s.
```

### Make a prod build
```shell
> yarn build-all-prod
$ webpack --mode=production
Hash: 95bb160f191dc13eb410
Version: webpack 4.18.1
Time: 1029ms
...
lerna success run Ran npm script 'build-prod' in 3 packages:
lerna success - easter
lerna success - inspector
lerna success - vs-app
✨  Done in 38.83s.
```

### Packages
The repository is a [Lerna](https://lerna.js.org/) monorepo with the following local packages:

#### vs-app
frameworks: [Reactjs](https://reactjs.org/) + [SDK Bundle](https://matterport.github.io/showcase-sdk/sdkbundle_home.html)
- virtual staging
- local webcam
- canvas
- security camera

#### inspector
frameworks: [Reactjs](https://reactjs.org/) + [RxJS](https://rxjs.dev/) + [SDK Bundle](https://matterport.github.io/showcase-sdk/sdkbundle_home.html)
- object placement using sdk scene files

#### easter
frameworks: [Reactjs](https://reactjs.org/) + [Phaser](https://phaser.io/) + [SDK Bundle](https://matterport.github.io/showcase-sdk/sdkbundle_home.html)
  - minigame

#### common
- reusable sdk bundle components

#### core
- matterport observable library

#### bundle
- showcase sdk bundle

### License
See the [MATTERPORT SAMPLE SDK CODE LICENSE AGREEMENT](LICENSE) file for license rights and limitations for this repository.
