import fs from 'fs';

if (process.argv.length < 4) {
  console.error('Usage: ts-node build-vimg.ts <json-meta> <output>');
  process.exit(1);
}

const metaPath = process.argv[2];
const output = process.argv[3];

const metas = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
const json = JSON.stringify(metas);
const header = Buffer.from('VIMG');
const body = Buffer.from(json);
fs.writeFileSync(output, Buffer.concat([header, body]));
console.log('Built', output);
