import { createHash } from 'node:crypto'
import { access, readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

const [html, headers, manifestText] = await Promise.all([
  read('index.html'),
  read('public/_headers'),
  read('public/site.webmanifest')
])

const structuredDataBlocks = [
  ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
]

if (structuredDataBlocks.length === 0) {
  throw new Error('No JSON-LD structured data block was found in index.html.')
}

for (const block of structuredDataBlocks) {
  JSON.parse(block[1])
}

const structuredDataHash = createHash('sha256')
  .update(structuredDataBlocks[0][1])
  .digest('base64')

if (!headers.includes(`'sha256-${structuredDataHash}'`)) {
  throw new Error('The Content Security Policy JSON-LD hash is out of date.')
}

const manifest = JSON.parse(manifestText)
if (
  !Array.isArray(manifest.icons) ||
  manifest.icons.length === 0 ||
  manifest.icons.some((icon) => icon.type !== 'image/png')
) {
  throw new Error('The web manifest must contain PNG icons only.')
}

await Promise.all(
  [
    'public/404.html',
    'public/privacy/index.html',
    'public/terms/index.html',
    'public/.well-known/security.txt',
    'public/og-image.png'
  ].map((path) => access(new URL(path, root)))
)

console.log(
  'Static metadata, CSP hash, legal pages, and PNG manifest icons verified.'
)
