// convertSvgAttrs.cjs
// CommonJS script to convert hyphenated SVG attribute names in JSX files to React-friendly camelCase
// Usage:
// 1) cd c:\1stProject\frontend
// 2) npm install --save-dev @babel/parser @babel/traverse @babel/generator @babel/types glob
// 3) node tools/convertSvgAttrs.cjs

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const root = path.resolve(__dirname, '..'); // frontend/
const patterns = [
  'src/**/*.jsx',
  'src/**/*.js',
  'src/**/*.tsx',
  'src/**/*.ts',
];

const attrMap = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'fill-opacity': 'fillOpacity',
  'xlink:href': 'xlinkHref',
  'xmlns:xlink': 'xmlnsXlink',
  'mask-type': 'maskType',
};

function transformFile(filePath) {
  const abs = path.join(root, filePath);
  const src = fs.readFileSync(abs, 'utf8');
  let ast;
  try {
    ast = parser.parse(src, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties', 'objectRestSpread'],
    });
  } catch (err) {
    console.error('Parse error:', filePath, err.message);
    return { filePath, changed: false, error: err.message };
  }

  let changed = false;

  traverse(ast, {
    JSXAttribute(pathAttr) {
      const nameNode = pathAttr.node.name;

      // 1) Convert hyphenated attribute names like 'stroke-width' -> 'strokeWidth'
      if (t.isJSXIdentifier(nameNode)) {
        const attrName = nameNode.name;
        if (Object.prototype.hasOwnProperty.call(attrMap, attrName)) {
          nameNode.name = attrMap[attrName];
          changed = true;
        }
      }

      // 1b) Handle namespaced attributes in JSX like <use xlink:href="..." />
      if (t.isJSXNamespacedName && pathAttr.node.name && pathAttr.node.name.type === 'JSXNamespacedName') {
        const ns = pathAttr.node.name.namespace && pathAttr.node.name.namespace.name;
        const local = pathAttr.node.name.name && pathAttr.node.name.name.name;
        if (ns && local) {
          const full = `${ns}:${local}`;
          if (Object.prototype.hasOwnProperty.call(attrMap, full)) {
            // replace with camelCase name e.g. xlinkHref
            pathAttr.node.name = t.jsxIdentifier(attrMap[full]);
            changed = true;
          } else {
            // fallback: rewrite into spread to preserve original attribute name in DOM
            const parent = pathAttr.parentPath.node;
            const obj = t.objectExpression([t.objectProperty(t.stringLiteral(full), t.stringLiteral(pathAttr.node.value && pathAttr.node.value.value || ''))]);
            parent.attributes.push(t.jsxSpreadAttribute(obj));
            pathAttr.remove();
            changed = true;
          }
        }
      }

      // 2) Handle style string containing mask-type:... e.g. style="mask-type:luminance"
      if (t.isJSXIdentifier(nameNode) && nameNode.name === 'style') {
        const val = pathAttr.node.value;
        if (val && t.isStringLiteral(val)) {
          const str = val.value;
          const m = str.match(/mask-type\s*:\s*([a-zA-Z0-9_-]+)/);
          if (m) {
            const maskVal = m[1];
            // If the entire style is just mask-type, replace style attr with maskType attr
            const cleaned = str.replace(/mask-type\s*:\s*[a-zA-Z0-9_-]+;?\s*/g, '').trim();
            const parent = pathAttr.parentPath.node; // JSXOpeningElement

            // add new maskType attribute
            const newAttr = t.jsxAttribute(t.jsxIdentifier('maskType'), t.stringLiteral(maskVal));
            parent.attributes.push(newAttr);
            changed = true;

            if (cleaned === '') {
              // remove the style attribute entirely
              pathAttr.remove();
            } else {
              // there are other style declarations; warn and keep cleaned string
              pathAttr.get('value').replaceWith(t.stringLiteral(cleaned));
              console.warn(`Note: kept cleaned style string in ${filePath}: "${cleaned}" — consider converting to style object`);
            }
          }
        }
      }
    },
  });

  if (changed) {
    const out = generate(ast, { jsescOption: { minimal: true } }, src).code;
    fs.writeFileSync(abs, out, 'utf8');
    return { filePath, changed: true };
  }
  return { filePath, changed: false };
}

function run() {
  console.log('Scanning files...');
  const files = patterns
    .map(p => glob.sync(p, { cwd: root, nodir: true }))
    .reduce((a, b) => a.concat(b), []);

  const results = [];
  for (const f of files) {
    const res = transformFile(f);
    results.push(res);
  }

  const changed = results.filter(r => r.changed);
  console.log(`Processed ${results.length} files, modified ${changed.length} files.`);
  if (changed.length > 0) {
    changed.forEach(c => console.log('Modified:', c.filePath));
  }
}

if (require.main === module) run();
