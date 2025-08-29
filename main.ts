import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";

const defaultLinkBase = "https://obsidian-links.kennethchristensen.me";

interface HttpLinkMakerSettings {
	httpLinkBase: string;
}

const DEFAULT_SETTINGS: HttpLinkMakerSettings = {
	httpLinkBase: defaultLinkBase,
};

export default class HttpLinkMakerPlugin extends Plugin {
	settings: HttpLinkMakerSettings;
	vaultName: string;

	copyLinkToClipboard(filePath: string): void {
		try {
			let linkBase = this.settings.httpLinkBase ?? defaultLinkBase;

			if (linkBase.endsWith("/")) {
				linkBase = linkBase.slice(0, -1);
			}

			if (
				!linkBase.startsWith("http://") &&
				!linkBase.startsWith("https://")
			) {
				linkBase = `https://${linkBase}`;
			}

			const link = `${this.settings.httpLinkBase}/v/${encodeURIComponent(
				this.vaultName
			)}/r/${encodeURI(filePath)}`;
			navigator.clipboard.writeText(link);
			new Notice(`Copied URL for ${filePath}!`);
		} catch (error) {
			console.error("Failed to copy link to clipboard:", error);
			new Notice("Failed to copy link to clipboard.");
			return;
		}
	}

	async onload() {
		await this.loadSettings();
		this.vaultName = this.app.vault.getName();

		this.addCommand({
			id: "copy-http-link",
			name: "Copy HTTP link",
			callback: () => {
				// Gets the currently active file, not just the active Markdown view,
				// because it can be to any file type.
				const file = this.app.workspace.getActiveFile();
				if (file) {
					this.copyLinkToClipboard(file.path);
				} else {
					new Notice("No active file to copy URL from.");
				}
			}
		});
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, editor) => {
				menu.addItem((item) => {
					item.setTitle("Copy HTTP link")
						.setIcon("link")
						.onClick(async () => {
							this.copyLinkToClipboard(editor.path);
						});
				});
			})
		);
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, _, view) => {
				menu.addItem((item) => {
					item.setTitle("Copy HTTP link")
						.setIcon("link")
						.onClick(async () => {
							const file = view.file;

							if (file) {
								this.copyLinkToClipboard(file.path);
							} else {
								new Notice("No active file to copy URL from.");
								return;
							}
						});
				});
			})
		);

		this.addSettingTab(new HttpLinkSettingsTab(this.app, this));
	}

	onunload() {
		// Do nothing.
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class HttpLinkSettingsTab extends PluginSettingTab {
	plugin: HttpLinkMakerPlugin;

	constructor(app: App, plugin: HttpLinkMakerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Obsidian link base URL")
			.setDesc("The base URL for your Obsidian links")
			.addText((text) =>
				text
					.setPlaceholder(defaultLinkBase)
					.setValue(this.plugin.settings.httpLinkBase)
					.onChange(async (value) => {
						this.plugin.settings.httpLinkBase = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
