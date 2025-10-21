#!/usr/bin/env node
// convertStyleStrings.js
// Usage: node tools/convertStyleStrings.js
// Requires dev deps: @babel/parser @babel/traverse @babel/generator @babel/types

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

function kebabToCamel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseValueToNode(raw) {
  if (raw === '') return t.stringLiteral('');
  const v = raw.trim();
  // px values -> numeric literal
  const px = v.match(/^(-?\d+(?:\.\d+)?)px$/);
  if (px) return t.numericLiteral(parseFloat(px[1]));
  // plain numbers -> numeric literal
  if (/^-?\d+(?:\.\d+)?$/.test(v)) return t.numericLiteral(parseFloat(v));
  // booleans
  if (v === 'true' || v === 'false') return t.booleanLiteral(v === 'true');
  // otherwise keep string
  return t.stringLiteral(v);
}

function parseStyleString(styleText) {
  const props = styleText.split(';').map(s => s.trim()).filter(Boolean);
  const properties = props.map(p => {
    const idx = p.indexOf(':');
    if (idx === -1) return null;
    const key = p.slice(0, idx).trim();
    const rawVal = p.slice(idx + 1).trim();
    const name = kebabToCamel(key);
    return t.objectProperty(t.identifier(name), parseValueToNode(rawVal));
  }).filter(Boolean);
  return t.objectExpression(properties);
}

function isInsideSvg(path) {
  // climb ancestors to see if any JSXOpeningElement has name 'svg'
  let p = path.parentPath;
  while (p) {
    if (p.node && p.node.type === 'JSXOpeningElement' && p.node.name) {
      const n = p.node.name;
      if (n.type === 'JSXIdentifier' && n.name === 'svg') return true;
      if (n.type === 'JSXMemberExpression' && n.object && n.object.name === 'svg') return true;
    }
    p = p.parentPath;
  }
  return false;
}

function processFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'classProperties', 'optionalChaining'] });
  } catch (err) {
    console.error(`Parse error ${filePath}:`, err.message);
    return false;
  }

  let changed = false;
  traverse(ast, {
    JSXAttribute(path) {
      try {
        const name = path.node.name && path.node.name.name;
        if (name !== 'style') return;
        // value could be StringLiteral (type: StringLiteral) or JSXExpressionContainer
        const val = path.node.value;
        if (!val) return;
        if (val.type === 'StringLiteral') {
          // skip if inside svg
          if (isInsideSvg(path)) return;
          const text = val.value;
          const objExpr = parseStyleString(text);
          path.node.value = t.jsxExpressionContainer(objExpr);
          changed = true;
        }
        // skip other cases
      } catch (e) {
        console.error('Error processing attribute in', filePath, e);
      }
    }
  });

  if (changed) {
    const out = generate(ast, { jsescOption: { minimal: true } }).code;
    fs.writeFileSync(filePath, out, 'utf8');
    console.log('Converted style strings in', filePath);
    return true;
  }
  return false;
}

function walkDir(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkDir(full, cb);
    else cb(full);
  }
}

const srcDir = path.join(__dirname, '..', 'src');
const exts = ['.js', '.jsx', '.ts', '.tsx'];
const files = [];
walkDir(srcDir, f => {
  if (exts.includes(path.extname(f))) files.push(f);
});

let total = 0;
for (const f of files) {
  try {
    const ok = processFile(f);
    if (ok) total++;
  } catch (e) {
    console.error('Failed', f, e);
  }
}
console.log(`Done. Converted ${total} file(s).`);
