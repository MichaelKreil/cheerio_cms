# Cheerio CMS

It's just a simple wrapper around [Cheerio](https://cheerio.js.org/) for server-side HTML manipulation and content management.

## Installation

```bash
npm install cheerio_cms
```

## Usage

```js
import { template, Page } from 'cheerio_cms';

const html = new Page(template)
	.setContent('<h1>Hello World!</h1>')
	.setTitle('hello world', 'simple hello world page')
	.render();
```

## Dependency Graph

<!--- This chapter is generated automatically --->

```mermaid
---
config:
  layout: elk
---
flowchart TB

subgraph 0["src"]
1["index.ts"]
2["page.ts"]
3["template.ts"]
end
1-->2
1-->3

class 0 subgraphs;
classDef subgraphs fill-opacity:0.1, fill:#888, color:#888, stroke:#888;
```

## License

Unlicensed
