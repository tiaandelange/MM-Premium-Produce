const html = await (await fetch("http://localhost:3007/en/products/baby-spinach")).text();
const idx = html.indexOf('name="productId"');
console.log(html.slice(Math.max(0, idx - 900), idx + 500));
console.log("---ACTIONS---");
for (const match of html.matchAll(/\$ACTION[A-Z0-9_:-]*/g)) {
  console.log(match[0]);
}
