# Easy Video Player

A simple modular playback framework inspired by the design discussion in `docs/自定义播放器框架设计_2025-07-26-02-59-11.md`.

## Features

- Core player engine (`CorePlayerEngine`) controlling playback state, timing and frame dispatch.
- Pluggable parser and renderer interfaces (`IPlaybackParser`, `IPlaybackRenderer`).
- Example image sequence plugin using canvas rendering.
- Node utility to pack frame metadata into a `.vimg` demo file.
- Written in TypeScript and tested with Jest.

## Usage

Install dependencies and build:

```bash
npm install
npm run build
```

Run tests:

```bash
npm test
```

Package image sequence metadata into `.vimg`:

```bash
npx ts-node tools/build-vimg.ts frames.json output.vimg
```

Import in browser (bundler required):

```ts
import { CorePlayerEngine, ImageSequencePlugin } from 'easy-video-player';
```

See documentation file in `docs/` for architecture details and further plans.
