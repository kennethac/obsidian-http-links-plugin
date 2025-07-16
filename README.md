# Obsidian HTTP Link Plugin

Obsidian offers a command `Copy Obsidian URL`, which will generate a link with the `obsidian://` scheme. It could look something like this: `obsidian://open?vault=MyVault&file=DailyNotes/2025-12-25.md`.

On some platforms, this link will "just work." On others, (e.g. Android), it will not. In some cases, even if the link _should_ work, the app it is rendered in will not show it as a link so that you can actually click it, which is almost just as useless.

Enter the Obsidian HTTP Link Plugin. It creates a link that uses the `https://` scheme which will be recognized and functional on almost any device.

## How does it work?

The HTTP link must point _somewhere_ and by default it points to a publicly accessible version of the [Obsidian HTTP Links](https://github.com/kennethac/obsidian-http-links) project at https://obsidian-links.kennethchristensen.me.

That site is hosted on Cloudflare and has no external analytics, tracking, or dependencies. The link itself conveys no information about your file (except the title, of course) and the file itself can only be opened if one is in possession of your Obsidian vault. Your information is safe and private.

In case you still don't want to share that though, you can easily deploy your own (free) version of the site by following the instructions [here](https://github.com/kennethac/obsidian-http-links?tab=readme-ov-file#setting-up-your-own-deployment) and updating your base URL in the HTTP Link Plugin settings in your Obsidian Vault.
