# SDK Examples

- [SDK Examples](#sdk-examples)
  - [Prerequisites](#prerequisites)
  - [Setup monorepo root](#setup-monorepo-root)
  - [Setup packages](#setup-packages)
  - [Run packages](#run-packages)
  - [Clean packages](#clean-packages)
  - [Make a prod build](#make-a-prod-build)
  - [Packages](#packages)
    - [vs-app](#vs-app)
    - [rc-app](#rc-app)
    - [inspector](#inspector)
    - [easter](#easter)
    - [embed examples](#embed-examples])
    - [common](#common)
    - [core](#core)
    - [bundle](#bundle)
  - [License](#license)

### Prerequisites

Your development environment will need node.js and yarn installed.

See <https://nodejs.org/en/> and <https://classic.yarnpkg.com/en/docs/install> for installation instructions specific to your environment.

> To run these examples, you will need to generate a sandboxed sdk key for your Matterport account. See [Matterport Developer Tools Pricing and Availability](https://support.matterport.com/hc/en-us/articles/360057506813-Matterport-Developer-Tools-Pricing-and-Availability).

> You will need to insert your SDK Key into the following line in packages/common/src/index.ts:

export const sdkKey = 'YOUR SDK KEY HERE';

### Setup Monorepo

Run these two commands when you first download the repo.

```shell
> yarn install
> yarn install-bundle
```

### Setup packages

Call this to install or update the package dependencies. It also links local packages together.

```shell
> yarn bootstrap
```

### Run packages

All packages can run in a development environment by their respective names:

```shell
> yarn inspector
> yarn vs-app
> yarn easter
> yarn rc-app
> yarn embed-examples
```

### Clean packages

You will need to bootstrap after cleaning.

```shell
> yarn clean
```

### Make a prod build

```shell
> yarn build-all-prod
```

### Packages

The repository is a [Lerna](https://lerna.js.org/) monorepo. This means that the package.json dependencies at the root of the repository are shared with each of the individual packages. Please keep in mind that not all root-level dependencies are used by all examples. The packages include:

#### vs-app

frameworks: [Reactjs](https://reactjs.org/) + [SDK Bundle](https://matterport.github.io/showcase-sdk/sdkbundle_home.html)

- virtual staging
- local webcam
- canvas
- security camera

#### rc-app

frameworks: [Reactjs](https://reactjs.org/) + [Photon SDK](https://www.photonengine.com/sdks#sdkrealtimejavascript) + [SDK for Embeds](https://matterport.github.io/showcase-sdk/sdk_home.html)

- an example that shows how to build a remote controlled showcase

#### inspector

frameworks: [Reactjs](https://reactjs.org/) + [RxJS](https://rxjs.dev/) + [SDK Bundle](https://matterport.github.io/showcase-sdk/sdkbundle_home.html)

- Object placement using sdk scene files

#### easter

frameworks: [Reactjs](https://reactjs.org/) + [Phaser](https://phaser.io/) + [SDK Bundle](https://matterport.github.io/showcase-sdk/sdkbundle_home.html)

- Hidden object minigame


#### embed-examples

frameworks: Vanilla JS + [SDK for Embeds](https://matterport.github.io/showcase-sdk/sdk_home.html)

- Sensor - Point Areas
- Sensor - Sweep Controls
- Sensor - Tags Level of Details
- Sensor - Tags per Sweep
- Training Tags Demo - [Training Application](https://matterport.github.io/showcase-sdk/sdk_tags_quiz.html)
- Training Tags Overlay Demo - [Training Application](https://matterport.github.io/showcase-sdk/sdk_tags_quiz_overlay.html)


#### common

- Reusable SDK Bundle components

#### core

- Matterport observable library

#### bundle

- Showcase SDK Bundle is created when running `yarn install-bundle` and used by the examples

### License

See the [MATTERPORT SAMPLE SDK CODE LICENSE AGREEMENT](LICENSE) file for license rights and limitations for this repository.
