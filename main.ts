import {
  Plugin,
  MarkdownPostProcessorContext,
  MarkdownRenderer,
  PluginSettingTab,
  App,
  Setting,
} from "obsidian";

/** Settings */
interface DMRSettings {
  enabled: boolean;          // Master toggle
  renderSummary: boolean;    // Whether <summary> needs to be rendered as well
}

const DEFAULT_SETTINGS: DMRSettings = {
  enabled: true,
  renderSummary: false,
};

export default class DetailsMarkdownRendererPlugin extends Plugin {
  settings: DMRSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new DMRSettingTab(this.app, this));

    // Key idea: collect every target node and render it once
    this.registerMarkdownPostProcessor((rootEl: HTMLElement, ctx: MarkdownPostProcessorContext) => {
      if (!this.settings.enabled) return;

      const detailsList = rootEl.querySelectorAll("details");
      detailsList.forEach((detailsEl) => {
        if (detailsEl.classList.contains("dmr-processed")) return;
        detailsEl.classList.add("dmr-processed");

        // 1) Grab <summary> (if present)
        const summaries = detailsEl.getElementsByTagName("summary");
        const summaryEl = summaries.length ? summaries[0] : null;

        // 2) Collect nodes to render; skip <summary> unless explicitly allowed
        const nodesToRender: ChildNode[] = [];
        for (const node of Array.from(detailsEl.childNodes)) {
          if (!this.settings.renderSummary && node === summaryEl) continue;
          // Collect content after <summary> to avoid messing up the order
          if (summaryEl && node === summaryEl) continue;
          nodesToRender.push(node);
        }

        // Place <summary> at the top when it also needs rendering
        if (this.settings.renderSummary && summaryEl) {
          nodesToRender.unshift(summaryEl);
        }

        // 3) Merge the raw text of every node into a single markdown string
        //    Keeping it as one string preserves tables/paragraph layout
        const parts: string[] = [];
        for (const n of nodesToRender) {
          const t = n.textContent ?? "";
          parts.push(t);
        }


        const rawMarkdown = parts.join("\n").replace(/\u00A0/g, " "); // Replace non-breaking space to avoid odd wrapping
        const finalMarkdown = rawMarkdown.trimEnd(); // Remove trailing blank lines if any

        // 4) Clear the section after <summary>, leaving it untouched when necessary
        //    Practically it means removing all non-summary nodes
        for (const n of Array.from(detailsEl.childNodes)) {
          if (n !== summaryEl) detailsEl.removeChild(n);
        }

        // 5) Insert a new container for a single pass Markdown render
        const container = detailsEl.ownerDocument!.createElement("div");
        container.classList.add("dmr-content");
        detailsEl.appendChild(container);

        if (finalMarkdown.length > 0) {
          MarkdownRenderer.renderMarkdown(finalMarkdown, container, ctx.sourcePath, this);
        }
      });
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
}

/** Settings tab */
class DMRSettingTab extends PluginSettingTab {
  plugin: DetailsMarkdownRendererPlugin;

  constructor(app: App, plugin: DetailsMarkdownRendererPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Obsidian Folded Markdown Renderer" });

    new Setting(containerEl)
      .setName("Render Markdown")
      .setDesc("Render Markdown inside <details> blocks. Disable to leave default behavior.")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.enabled).onChange(async (v) => {
          this.plugin.settings.enabled = v;
          await this.plugin.saveSettings();
        }),
      );

    new Setting(containerEl)
      .setName("Render <summary>")
      .setDesc("Include <summary> text when rendering Markdown (off by default).")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.renderSummary).onChange(async (v) => {
          this.plugin.settings.renderSummary = v;
          await this.plugin.saveSettings();
        }),
      );
  }
}
