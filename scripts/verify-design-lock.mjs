import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)

// These hashes represent the user-approved design plus invisible form and
// calendar wiring. Updating a protected file requires an intentional review
// and an explicit update to this manifest.
const approved = {
  'index.html':
    'f717c8b31a611dccb08d9634f29f8621aa21c19ccd82f8618136df540a018594',
  'public/assets/Leaf2.png':
    'dee20a27e897270416cc5ff258b6e80c64b03a52bd1e55403b13f4c3a48628b6',
  'public/assets/brand/palm-hero.png':
    'ee5e2656cba2f2e05a52802bccd956e87bcd0f00af9d613e93c096e096cda98b',
  'public/chime/chime-hitech-theme.css':
    '9f71c9852ba9eba03b5f3aebd8bbcdc4f4857298eedf92a8751db158a2d9d8bb',
  'public/chime/chime-widget.css':
    '67035b60f79500105c3903a7fe8f022cbfe7539223f4906bf686f3ea71e8cf19',
  'public/chime/chime-widget.js':
    '0771ca1be392abc534c2aa7c07a8b051616c35f230f7cd7c9e51f729202e4b98',
  'src/assets/texture-linen-paper-tile.png':
    'f47e27a4dab0696d185b5a7e4af87caf1a1ab261e72a15e55ec3ac2a79ed753c',
  'src/components/AdvancedAccordion.tsx':
    'a69fad7e788c5bdaec1462c5b3b7e507259c2e88c80f87eea1e5ce8c23d189ae',
  'src/components/App.tsx':
    '964c9720090c2a8932f39a6d9e42686d94ba354aff5789724eefc929a4cfc092',
  'src/components/BookingSection.tsx':
    'da1aaf6b9345e787ea637e26419ea8a05cdd78e4d4b5657e60ef3317474ac6f0',
  'src/components/BookingWidget.tsx':
    '52609ce9e7853f4483870947a3c6f3ef781e2bfb9a6044213cfa2228f33fe253',
  'src/components/ContactSection.tsx':
    'bc73c14bb44ea123ab8d4e5e024d73aee34efc871a4975e42bd1e4d12bdfcef0',
  'src/components/FAQSection.tsx':
    '5ea14cfce45dad7c8750bb64dbbe72d4e0cbee27b22d20acbe6b8595a98c216f',
  'src/components/Footer.tsx':
    '30543ebcc9a8aaef49fab591c26fa175b12209dbb43557d40d8752a1b640107f',
  'src/components/Hero.tsx':
    'e7f2bc946d3c1c81dc2fd73353755bbd3931cd939e952e44e723a6b347337d73',
  'src/components/ModalPricing.tsx':
    '0abda6457e706ff906f91e8f69c8e87b7a0af82901ce08c3b02944747bb63e35',
  'src/components/ModalService.tsx':
    '1aea33fb4af2dbc0dbca41458d061f25151c2e9e5aa6b8151d02cbe282b122fa',
  'src/components/NavBar.tsx':
    '3cb1205c8252be07317bbeab9e807e3bc2c4fc315fd31e075542013bd309cec0',
  'src/components/ServiceCard.tsx':
    '80f58d67f587fa36775888ae7ad35e99b67122143dc920612463a22a11f05313',
  'src/components/ServicesSection.tsx':
    'e7971d65ad868323e547bce0a88b1d3bac6e1ac167749fc700bb4f64d988746d',
  'src/components/TrustStrip.tsx':
    'cab0d1735d4c1c45cb3366e415fb9889a84a5e1a106ba3f90a724c7d387d24a1',
  'src/hooks/useUiChrome.ts':
    '134043e7a539b8e5477eb963d2a2bf7d17a14032fc1603be2377aadd9c2f37b4',
  'src/index.css':
    'cef49bf529e55119480a9f5062ca45092fc5ebbade8ab73a5749bb56d3481cbd',
  'src/index.tsx':
    'ccfc043d6d5f0550033aba4e3ab34138e779235fc5b0b97044c6fa9b671d9c4c',
  'tailwind.config.mjs':
    'e4122ef173f5fffadf1e28f9203a38305fb79076dc9511d9c1b36de9f7012c85'
}

const changed = []

for (const [path, expectedHash] of Object.entries(approved)) {
  const contents = await readFile(new URL(path, root))
  const actualHash = createHash('sha256').update(contents).digest('hex')
  if (actualHash !== expectedHash) changed.push(path)
}

if (changed.length) {
  throw new Error(
    `Protected design files changed without approval:\n${changed
      .map((path) => `- ${path}`)
      .join('\n')}`
  )
}

console.log(
  `Approved design verified across ${Object.keys(approved).length} files.`
)
