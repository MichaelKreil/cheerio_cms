import { type CheerioAPI, load } from 'cheerio';

export interface MenuEntry {
	title: string;
	url: string;
}

export class Page {
	public $: CheerioAPI;

	constructor(template: string) {
		if (typeof template !== 'string') throw new TypeError('template must be a string');
		this.$ = load(template);
	}

	static async fromURL(url: string): Promise<Page> {
		if (typeof url !== 'string') throw new TypeError('url must be a string');
		const content = await fetch(url).then((r) => r.text());
		return new Page(content);
	}

	public clone(): Page {
		return new Page(this.render());
	}

	public setMenu(entries: MenuEntry[], selectedMenuItem: string, githubRepoLink: string): Page {
		const menuList = this.$('nav ul');
		menuList.empty();
		entries.forEach((entry) => {
			const className = entry.title === selectedMenuItem ? ' class="selected"' : '';
			menuList.append(`<li${className}><a href="${entry.url}">${entry.title}</a></li>`);
		});
		menuList.append(`<li class="github-icon"><a href="${githubRepoLink}"></a></li>`);
		return this;
	}

	public setTitle(title: string, description: string): Page {
		if (typeof title !== 'string') throw new TypeError('title must be a string');
		if (typeof description !== 'string') throw new TypeError('description must be a string');

		this.$('title').text(title);
		this.$('meta[property="og:title"]').attr('content', title);
		this.$('meta[name="twitter:title"]').attr('content', title);

		this.$('meta[name="description"]').attr('content', description);
		this.$('meta[property="og:description"]').attr('content', description);
		this.$('meta[name="twitter:description"]').attr('content', description);

		return this;
	}

	public setSocialImage(url: string): Page {
		if (typeof url !== 'string') throw new TypeError('url must be a string');
		this.$('meta[property="og:image"]').attr('content', url);
		this.$('meta[name="twitter:image"]').attr('content', url);
		this.$('meta[name="image"]').attr('content', url);
		return this;
	}

	public setContent(content: string): Page {
		if (typeof content !== 'string') throw new TypeError('content must be a string');
		this.$('main').html(content);
		return this;
	}

	public addHead(head: string): Page {
		if (typeof head !== 'string') throw new TypeError('head must be a string');
		this.$('head').append(head);
		return this;
	}

	public setGithubLink(url: string): Page {
		if (typeof url !== 'string') throw new TypeError('url must be a string');
		this.$('#github-link').remove();
		this.$('footer').append(
			`<div id="github-link"><a target="_blank" href="${url}">Improve this page on GitHub</a></div>`,
		);
		return this;
	}

	public setBaseUrl(baseUrl: string): Page {
		if (typeof baseUrl !== 'string') throw new TypeError('baseUrl must be a string');

		const updateUrls = (selector: string, attribute: string) => {
			this.$(selector).each((_, element) => {
				const url = this.$(element).attr(attribute);
				if (!url) return;
				if (url.startsWith('http')) return;
				this.$(element).attr(attribute, new URL(url, baseUrl).href);
			});
		};

		updateUrls('[href]', 'href');
		updateUrls('[src]', 'src');
		updateUrls('meta[property="og:image"]', 'content');
		updateUrls('meta[name="twitter:image"]', 'content');
		updateUrls('meta[name="image"]', 'content');

		return this;
	}

	public render(): string {
		this.$('[class=""]').each((_, element) => {
			this.$(element).removeAttr('class');
		});
		this.$('[style=""]').each((_, element) => {
			this.$(element).removeAttr('style');
		});
		return this.$.html();
	}
}
