import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";

interface HttpLinkMakerSettings {
	httpLinkBase: string;
}

const DEFAULT_SETTINGS: HttpLinkMakerSettings = {
	httpLinkBase: "https://obsidian-links.kennethchristensen.me",
};

export default class HttpLinkMakerPlugin extends Plugin {
	settings: HttpLinkMakerSettings;
	vaultName: string;

	copyLinkToClipboard(filePath: string): void {
		try {
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

		// copy the obsidian URL for the current file to the clipboard
		this.addCommand({
			id: "copy-obsidian-url",
			name: "Copy Obsidian URL",
			callback: () => {
				// Get the current file
				const file = this.app.workspace.getActiveFile();
				if (file) {
					this.copyLinkToClipboard(file.path);
				} else {
					new Notice("No active file to copy URL from.");
				}
			},
			hotkeys: [], // Add your desired hotkeys here if needed
		});
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, editor, view, leaf) => {
				menu.addItem((item) => {
					item.setTitle("Copy HTTP Obsidian URL")
						.setIcon("link")
						.onClick(async () => {
							this.copyLinkToClipboard(editor.path);
						});
				});
			})
		);
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				menu.addItem((item) => {
					item.setTitle("Copy HTTP Obsidian URL")
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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

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

class SampleSettingTab extends PluginSettingTab {
	plugin: HttpLinkMakerPlugin;

	constructor(app: App, plugin: HttpLinkMakerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Obsidian Link Base")
			.setDesc("The base URL for your Obsidian links")
			.addText((text) =>
				text
					.setPlaceholder("Enter your Obsidian link base URL")
					.setValue(this.plugin.settings.httpLinkBase)
					.onChange(async (value) => {
						this.plugin.settings.httpLinkBase = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
