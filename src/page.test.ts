import { MenuEntry, Page } from './page.js';
import { beforeEach, describe, expect, it } from '@jest/globals';
import template from './template.js';

describe('Page', () => {
	let page: Page;

	beforeEach(() => {
		page = new Page(template);
	});

	it('initializes with a template', () => {
		expect(page).toBeInstanceOf(Page);
		expect(page.render()).toContain('<!DOCTYPE html>');
	});

	it('clone returns a deep copy of the page', () => {
		page.setTitle('Cloned Title', 'Cloned Description');
		const cloned = page.clone();
		expect(cloned).not.toBe(page);
		expect(cloned.render()).toBe(page.render());
		cloned.setTitle('Changed Title', 'Changed Description');
		expect(cloned.render()).not.toBe(page.render());
	});

	it('render returns the HTML string', () => {
		const html = page.render();
		expect(typeof html).toBe('string');
		expect(html).toContain('<!DOCTYPE html>');
	});

	describe('setTitle', () => {
		it('setTitle sets the document title', () => {
			page.setTitle('New Title', 'New Description');
			const html = page.$('head').html();
			expect(html).toContain('<title>New Title</title>');
			expect(html).toContain('<meta property="og:title" content="New Title">');
			expect(html).toContain('<meta name="twitter:title" content="New Title">');
		});

		it('setTitle sets the document description', () => {
			page.setTitle('New Title', 'New Description');
			const html = page.$('head').html();
			expect(html).toContain('<meta name="description" content="New Description">');
			expect(html).toContain('<meta property="og:description" content="New Description">');
			expect(html).toContain('<meta name="twitter:description" content="New Description">');
		});

		it('setTitle throws if not a string', () => {
			// @ts-expect-error: Testing type error
			expect(() => page.setTitle(123)).toThrow(TypeError);
		});
	});

	describe('setContent', () => {
		it('setContent sets the main content', () => {
			page.setContent('<h1>Hello</h1>');
			const html = page.render();
			expect(html).toContain('<main><h1>Hello</h1></main>');
		});

		it('setContent throws if not a string', () => {
			// @ts-expect-error: Testing type error
			expect(() => page.setContent({})).toThrow(TypeError);
		});
	});

	describe('addHead', () => {
		it('addHead appends to the head', () => {
			page.addHead('<meta name="test" content="1">');
			const html = page.render();
			expect(html).toContain('<meta name="test" content="1">');
		});

		it('addHead throws if not a string', () => {
			// @ts-expect-error: Testing type error
			expect(() => page.addHead(42)).toThrow(TypeError);
		});
	});

	describe('setMenu', () => {
		it('setMenu replaces menu entries and adds github icon', () => {
			const entries: MenuEntry[] = [
				{ title: 'Home', url: '/' },
				{ title: 'Docs', url: '/docs' },
			];
			page.setMenu(entries, 'Home', 'https://github.com/example-org/');
			const html = page.$('nav ul').html();
			expect(html).toBe(
				[
					'<li class="selected"><a href="/">Home</a></li>',
					'<li><a href="/docs">Docs</a></li>',
					'<li class="github-icon"><a href="https://github.com/example-org/"></a></li>',
				].join(''),
			);
		});

		it('setMenu highlights the selected menu entry', () => {
			const entries: MenuEntry[] = [
				{ title: 'Home', url: '/' },
				{ title: 'Docs', url: '/docs' },
			];
			page.setMenu(entries, 'Docs', 'https://github.com/example-org/');
			const html = page.$('nav ul').html();
			expect(html).toBe(
				[
					'<li><a href="/">Home</a></li>',
					'<li class="selected"><a href="/docs">Docs</a></li>',
					'<li class="github-icon"><a href="https://github.com/example-org/"></a></li>',
				].join(''),
			);
		});
	});

	describe('setGithubLink', () => {
		it('setGithubLink adds a github link to the footer', () => {
			page.setGithubLink('https://github.com/test/repo');
			const html = page.render();
			expect(html).toContain(
				'<div id="github-link"><a target="_blank" href="https://github.com/test/repo">Improve this page on GitHub</a></div>',
			);
		});

		it('setGithubLink removes previous github link', () => {
			page.setGithubLink('https://github.com/first');
			page.setGithubLink('https://github.com/second');
			const html = page.render();
			expect(html).toContain('https://github.com/second');
			expect(html).not.toContain('https://github.com/first');
		});

		it('setGithubLink throws if not a string', () => {
			// @ts-expect-error: Testing type error
			expect(() => page.setGithubLink(null)).toThrow(TypeError);
		});
	});

	describe('setBaseUrl', () => {
		it('setBaseUrl upgrades href and src attributes to absolute URLs', () => {
			const html = new Page(template)
				.setContent(
					[
						'<a href="http://example.com/page">Link</a>',
						'<img src="https://example.com/image.png">',
						'<img src="./relative.png">',
						'<a href="/absolute">absolute</a>',
					].join('\n'),
				)
				.setBaseUrl('https://baseurl.com/path/')
				.render();
			expect(html).toContain('href="http://example.com/page"');
			expect(html).toContain('src="https://example.com/image.png"');
			expect(html).toContain('src="https://baseurl.com/path/relative.png"');
			expect(html).toContain('href="https://baseurl.com/absolute"');
		});

		it('setBaseUrl throws if baseUrl is not a string', () => {
			// @ts-expect-error: Testing type error
			expect(() => page.setBaseUrl(123)).toThrow(TypeError);
		});
	});

	describe('static from…', () => {
		it('fromTemplate creates a Page instance from HTML string', () => {
			const p = new Page('<html><body><main>Test</main></body></html>');
			expect(p).toBeInstanceOf(Page);
			expect(p.render()).toContain('Test');
		});

		it('fromURL creates a Page instance from a URL (mocked)', async () => {
			const page = await Page.fromURL('https://versatiles.org');
			expect(page).toBeInstanceOf(Page);
			expect(page.render()).toContain('VersaTiles');
		});

		it('fromURL throws if url is not a string', async () => {
			// @ts-expect-error: Testing type error
			await expect(Page.fromURL(null)).rejects.toThrow();
		});
	});

	describe('setSocialImage', () => {
		it('sets value', () => {
			const p = new Page(template);
			p.setSocialImage('new-image.png');
			const html = p.$('head').html();
			expect(html).toContain('meta property="og:image" content="new-image.png"');
			expect(html).toContain('meta name="twitter:image" content="new-image.png"');
			expect(html).toContain('meta name="image" content="new-image.png"');
		});

		it('setSocialImage throws if url is not a string', () => {
			// @ts-expect-error: Testing type error
			expect(() => page.setSocialImage(123)).toThrow(TypeError);
		});
	});
});
