import {
	App,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

interface HttpLinkMakerSettings {
	httpLinkBase: string;
}

const DEFAULT_SETTINGS: HttpLinkMakerSettings = {
	httpLinkBase: "https://obsidian-links.kennethchristensen.me",
};

export default class HttpLinkMakerPlugin extends Plugin {
	settings: HttpLinkMakerSettings;

	async onload() {
		await this.loadSettings();

		// copy the obsidian URL for the current file to the clipboard
		this.addCommand({
			id: "copy-obsidian-url",
			name: "Copy Obsidian URL",
			callback: () => {
				// Get the current file
				const file = this.app.workspace.getActiveFile();
				if (file) {
					// Get the vault name
					const vaultName = this.app.vault.getName();
					// Create the URL
					const url = `${
						this.settings.httpLinkBase
					}/v/${encodeURIComponent(vaultName)}/r/${encodeURI(
						file.path
					)}`;
					// Copy the URL to the clipboard
					navigator.clipboard.writeText(url);
					// Optionally, show a success message (e.g., using `app.displayNotice`)
					new Notice(`Copied URL for ${file.name}!`);
				} else {
					new Notice("No active file to copy URL from.");
				}
			},
			hotkeys: [], // Add your desired hotkeys here if needed
		});
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, editor, view, leaf) => {
				console.log("It ran!!");
				menu.addItem((item) => {
					item.setTitle("Copy HTTP Obsidian URL")
						.setIcon("document")
						.onClick(async () => {
							// Commands does indeed exist.
							(this.app as any).commands.executeCommandById(
								"http-link-maker:copy-obsidian-url"
							);
						});
				});
			})
		);
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				console.log("It ran!!");
				menu.addItem((item) => {
					item.setTitle("Copy HTTP Obsidian URL")
						.setIcon("document")
						.onClick(async () => {
							// Commands does indeed exist.
							(this.app as any).commands.executeCommandById(
								"http-link-maker:copy-obsidian-url"
							);
							new Notice("Copied to clipboard!");
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
