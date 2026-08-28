window.__ModuleLoader__.load({ id: `dsh-vditor`, factory: (e) => {
  const t = { exports: {} }
  const n = t.exports
  const React = e('react')

  const apply = (ctx) => {
    const slots = ctx.get('slots')
    if (slots === undefined) return

    const modelDirectories = ctx.get('modelDirectories')
    const sessions = ctx.get('sessions')

    const CDN = 'https://unpkg.com/vditor@3.11.3/dist'
    let libPromise = null

    const loadVditor = () => {
      if (libPromise) return libPromise
      libPromise = new Promise((resolve, reject) => {
        try {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = CDN + '/index.css'
          link.dataset.dynVditor = 'css'
          document.head.appendChild(link)
          const script = document.createElement('script')
          script.src = CDN + '/index.min.js'
          script.async = true
          script.dataset.dynVditor = 'js'
          script.onload = () => {
            if (typeof window.Vditor === 'function') resolve(true)
            else reject(new Error('Vditor 全局对象缺失'))
          }
          script.onerror = () => reject(new Error('Vditor 脚本加载失败（需要访问 unpkg.com）'))
          document.head.appendChild(script)
        } catch (err) {
          reject(err)
        }
      })
      return libPromise
    }

    const apiFetch = async (path, body) => {
      const res = await fetch('/plugins/vditor' + path, body === undefined ? undefined : {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    }

    const STYLE_TAG = 'dsh-vditor-style'
    const ensureStyles = () => {
      if (document.getElementById(STYLE_TAG)) return
      const styleEl = document.createElement('style')
      styleEl.id = STYLE_TAG
      styleEl.textContent = `
.dyn-vditor-wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 0 var(--dsh-composer-side-clearance, 16px) 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.dyn-vditor-attach-chips {
  width: 100%;
  max-width: var(--dsh-composer-card-max-width, 780px);
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 4px;
}
.dyn-vditor-attach-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 4px 0 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-specific-selector, var(--dsw-alias-bg-layer-2));
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  max-width: 360px;
}
.dyn-vditor-attach-chip-icon { flex: none; display: inline-flex; color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary)); }
.dyn-vditor-attach-chip-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 260px; }
.dyn-vditor-attach-chip-x {
  flex: none;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 14px;
  line-height: 1;
  padding: 0;
}
.dyn-vditor-attach-chip-x:hover { background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-3)); color: var(--dsw-alias-label-primary); }
.dyn-vditor-card {
  width: 100%;
  max-width: var(--dsh-composer-card-max-width, 780px);
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2-darkmode-thin, var(--dsw-alias-border-l1));
  background: var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1));
  box-shadow: var(--dsw-shadow-lv2, none);
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px 0;
  position: relative;
}
.dyn-vditor-box { min-height: 140px; }
.dyn-vditor-box {
  border: none;
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
}
.dyn-vditor-box .vditor-toolbar {
  background: transparent;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  padding: 2px 4px;
}
.dyn-vditor-box .vditor-content {
  background: transparent;
  max-height: 360px;
  overflow-y: auto;
}
.dyn-vditor-box .vditor-ir { background: transparent; }
.dyn-vditor-box .vditor-ir {
  color: var(--dsw-alias-label-primary);
  padding: 8px 4px;
}
.dyn-vditor-box .vditor-reset { color: var(--dsw-alias-label-primary); }
.dyn-vditor-box .vditor-ir .vditor-ir__node--expand { background: transparent; }
.dyn-vditor-box .vditor-content textarea::placeholder,
.dyn-vditor-box .vditor-ir textarea::placeholder {
  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));
  opacity: 1;
}
.dyn-vditor-box pre.vditor-ir__preview[data-dyn-lang]::after {
  content: attr(data-dyn-lang);
  position: absolute;
  bottom: 6px;
  right: 8px;
  z-index: 30;
  font-size: 11px;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 6px;
  background: rgba(20, 20, 26, 0.95);
  color: rgba(255, 255, 255, 0.95);
  font-family: var(--ds-font-family-code, monospace);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.12s;
}
.dyn-vditor-box pre.vditor-ir__preview[data-dyn-lang]:hover::after,
.dyn-vditor-box pre.vditor-ir__preview[data-dyn-lang].dyn-hover::after {
  opacity: 1;
}
.dyn-vditor-menu {
  position: absolute;
  top: 40px;
  left: 10px;
  z-index: 90;
  border: 1px solid var(--dsw-alias-border-inverted, var(--dsw-alias-border-l1));
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-overlay));
  border-radius: 12px;
  padding: 4px;
  min-width: 240px;
  min-height: 100px;
  max-width: min(420px, calc(100% - 20px));
  max-height: 280px;
  overflow-y: auto;
  box-shadow: var(--dsw-shadow-lv3, 0 8px 24px rgba(0, 0, 0, 0.18));
  color: var(--dsw-alias-label-primary);
  display: flex;
  flex-direction: column;
}
.dyn-vditor-menu-empty { padding: 8px 12px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.dyn-vditor-toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 2px 8px 6px;
}
.dyn-vditor-tools { display: flex; align-items: center; gap: 6px; min-width: 0; flex-wrap: wrap; }
.dyn-vditor-trailing { display: flex; align-items: center; gap: 10px; flex: none; min-width: 0; }
.dyn-vditor-trigger {
  background: transparent;
  border: none;
  color: var(--dsw-alias-label-secondary);
  border-radius: 999px;
  height: 28px;
  padding: 0 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 220px;
  min-width: 0;
  white-space: nowrap;
  transition: background 0.12s, color 0.12s;
}
.dyn-vditor-trigger:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2));
  color: var(--dsw-alias-label-primary);
}
.dyn-vditor-trigger:disabled { opacity: 0.5; cursor: not-allowed; }
.dyn-vditor-trigger.dyn-vditor-cmd-btn {
  background: var(--dsw-specific-selector);
  width: 28px;
  color: var(--dsw-alias-label-primary);
  border: none;
  border-radius: 999px;
  flex: none;
  place-items: center;
  display: grid;
  padding: 0;
}
.dyn-vditor-trigger.dyn-vditor-cmd-btn:hover:not(:disabled) {
  background: var(--dsw-specific-selector);
  color: var(--dsw-alias-label-primary);
}
.dyn-vditor-trigger-icon { flex: none; display: inline-flex; }
.dyn-vditor-trigger-icon svg { width: 14px; height: 14px; }
.dyn-vditor-btn-label { overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.dyn-vditor-effort { color: var(--dsw-alias-label-caption, var(--dsw-alias-label-secondary)); flex: none; }
.dyn-vditor-chevron { color: var(--dsw-alias-label-caption, var(--dsw-alias-label-secondary)); flex: none; display: inline-flex; transition: transform 0.12s; }
.dyn-vditor-chevron svg { width: 14px; height: 14px; }
.dyn-vditor-chevron.open { transform: rotate(180deg); }
.dyn-vditor-hint { font-size: 11px; color: var(--dsw-alias-label-secondary); margin-left: 4px; }
.dyn-vditor-file-tip { font-size: 11px; color: var(--dsw-alias-state-warn-primary); }
.dyn-vditor-meter {
  width: 28px;
  height: 28px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 999px;
  flex: none;
  place-items: center;
  display: grid;
  padding: 0;
}
.dyn-vditor-meter:hover { background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2)); }
.dyn-vditor-meter-track { fill: none; stroke: var(--dsw-alias-border-l3, var(--dsw-alias-border-l2)); stroke-width: 2px; }
.dyn-vditor-meter-fill { fill: none; stroke: var(--dsw-alias-label-tertiary); stroke-width: 2px; stroke-linecap: round; }
.dyn-vditor-send {
  background: var(--dsw-alias-button-info-fill, var(--dsw-alias-brand-primary));
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  flex: none;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  display: grid;
  transition: background-color 0.1s, opacity 0.1s;
}
.dyn-vditor-send:disabled { opacity: 0.5; cursor: not-allowed; }
.dyn-vditor-drop { position: relative; }
.dyn-vditor-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  z-index: 100;
  border: 1px solid var(--dsw-alias-border-inverted, var(--dsw-alias-border-l1));
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-overlay));
  border-radius: 12px;
  padding: 4px;
  min-width: 200px;
  min-height: 100px;
  max-width: min(340px, 100vw - 32px);
  max-height: min(360px, 100vh - 96px);
  overflow-y: auto;
  box-shadow: var(--dsw-shadow-lv3, 0 8px 24px rgba(0, 0, 0, 0.18));
  color: var(--dsw-alias-label-primary);
  display: flex;
  flex-direction: column;
}
.dyn-vditor-menu.right { left: auto; right: 0; }
.dyn-vditor-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  box-sizing: border-box;
}
.dyn-vditor-menu-item:hover { background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2)); }
.dyn-vditor-menu-item.active { color: var(--dsw-alias-brand-primary); font-weight: 600; }
.dyn-vditor-menu-item .dyn-vditor-menu-desc {
  flex: 1;
  min-width: 0;
  font-size: 11px;
  line-height: 16px;
  color: var(--dsw-alias-label-secondary);
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dyn-vditor-menu-item .dyn-vditor-menu-main { flex: 1; min-width: 0; }
.dyn-vditor-menu-item .dyn-vditor-menu-main .dyn-vditor-menu-desc { margin-top: 1px; }
.dyn-vditor-menu-value { flex: none; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-secondary); font-size: 12px; }
.dyn-vditor-menu-check { flex: none; color: var(--dsw-alias-brand-primary); display: inline-flex; }
.dyn-vditor-menu-group {
  font-size: 11px;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary);
  padding: 6px 10px 2px;
}
.dyn-vditor-menu-back {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  box-sizing: border-box;
}
.dyn-vditor-menu-back:hover { background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2)); }
.dyn-vditor-meter-panel {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 100;
  border: 1px solid var(--dsw-alias-border-inverted, var(--dsw-alias-border-l1));
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-overlay));
  border-radius: 12px;
  padding: 12px;
  width: 240px;
  box-shadow: var(--dsw-shadow-lv3, 0 8px 24px rgba(0, 0, 0, 0.18));
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 20px;
}
.dyn-vditor-meter-head { display: flex; align-items: center; gap: 6px; }
.dyn-vditor-meter-percent { color: var(--dsw-alias-label-primary); font-weight: 500; margin-left: auto; font-variant-numeric: tabular-nums; }
.dyn-vditor-meter-rows { margin-top: 10px; display: flex; flex-direction: column; gap: 2px; }
.dyn-vditor-meter-row { display: flex; align-items: center; gap: 8px; }
.dyn-vditor-meter-row dt { color: var(--dsw-alias-label-secondary); flex: 1; }
.dyn-vditor-meter-row dd { font-variant-numeric: tabular-nums; color: var(--dsw-alias-label-primary); }
.dyn-vditor-meter-swatch { width: 8px; height: 8px; border-radius: 2px; flex: none; }
.dyn-vditor-meter-swatch.system { background: var(--dsw-static-neutral-bluish-400, #9ca3af); }
.dyn-vditor-meter-swatch.tools { background: #a78bfa; }
.dyn-vditor-meter-swatch.messages { background: var(--dsw-static-blue-450, #60a5fa); }
.dyn-vditor-todo {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--dsh-composer-card-max-width, 780px);
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-specific-tip, var(--dsw-alias-bg-layer-2));
  border-radius: 12px;
  flex: none;
  margin: 0 auto;
  overflow: hidden;
}
.dyn-vditor-todo-body { flex-direction: column; gap: 8px; padding: 6px 12px; display: flex; }
.dyn-vditor-todo-header {
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 0;
  display: flex;
}
.dyn-vditor-todo-lead { color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary)); flex: none; place-items: center; display: grid; }
.dyn-vditor-todo-title { color: var(--dsw-alias-label-primary); flex: none; font-size: 13px; font-weight: 500; line-height: 24px; }
.dyn-vditor-todo-progress {
  min-width: 0;
  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: auto;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
}
.dyn-vditor-todo-chevron { color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary)); flex: none; place-items: center; display: grid; transition: transform 0.12s; }
.dyn-vditor-todo-chevron.open { transform: rotate(180deg); }
.dyn-vditor-todo-list { flex-direction: column; gap: 8px; max-height: 180px; margin: 0; padding: 0; list-style: none; display: flex; overflow-y: auto; }
.dyn-vditor-todo-item {
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  align-items: center;
  gap: 10px;
  font-size: 13px;
  line-height: 20px;
  display: flex;
}
.dyn-vditor-todo-glyph { flex: none; place-items: center; width: 16px; height: 16px; display: grid; }
.dyn-vditor-todo-glyph.completed { color: var(--dsw-alias-state-success-primary); }
.dyn-vditor-todo-glyph.pending { color: var(--dsw-alias-label-caption, var(--dsw-alias-label-secondary)); }
.dyn-vditor-todo-glyph.progress { color: var(--dsw-alias-state-business-primary, var(--dsw-alias-brand-primary)); }
.dyn-vditor-todo-glyph.progress svg { animation: 1s linear infinite dyn-vditor-todo-spin; }
@keyframes dyn-vditor-todo-spin { to { transform: rotate(360deg); } }
.dyn-vditor-todo-content { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dyn-vditor-stats {
  text-align: center;
  max-width: var(--dsh-chat-content-width, 748px);
  width: 100%;
  box-sizing: border-box;
  padding: 4px calc(var(--dsh-composer-side-clearance, 16px) + 16px) 0;
  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 auto;
  font-size: 12px;
  line-height: 20px;
  display: block;
  overflow: hidden;
}
.dyn-vditor-stats-sep { color: var(--dsw-alias-separator-primary, var(--dsw-alias-label-caption)); margin: 0 10px; }
.dyn-vditor-balance {
  box-sizing: border-box;
  display: block;
  width: 100%;
  max-width: var(--dsh-chat-content-width, 748px);
  margin: 0 auto;
  padding: 4px calc(var(--dsh-composer-side-clearance, 16px) + 16px) 0;
  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dyn-vditor-balance-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 999px;
  background: var(--dsw-alias-label-dimmed, var(--dsw-alias-label-caption));
  vertical-align: 1px;
}
.dyn-vditor-balance-dot.available { background: var(--dsw-alias-state-success-primary); }
.dyn-vditor-balance-dot.empty,
.dyn-vditor-balance-dot.error { background: var(--dsw-alias-state-error-primary); }
.dyn-vditor-balance-sep { margin: 0 10px; }
.dyn-vditor-user-row {
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-width: 0;
  display: flex;
}
.dyn-vditor-user-images {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  max-width: min(525px, 82%);
  display: flex;
}
.dyn-vditor-user-img {
  max-width: 240px;
  max-height: 240px;
  border-radius: 12px;
  object-fit: contain;
  background: var(--dsw-alias-bg-layer-2, transparent);
}
.dyn-vditor-user-bubble {
  background: var(--dsw-specific-bubble);
  max-width: min(525px, 82%);
  min-width: 0;
  color: var(--dsw-alias-label-primary);
  border-radius: 22px;
  padding: 10px 16px;
  font-size: 16px;
  line-height: 24px;
}
.dyn-vditor-user-bubble .vditor-reset {
  color: inherit;
  background: transparent;
  font-size: inherit;
  line-height: inherit;
  overflow-wrap: anywhere;
}
.dyn-vditor-user-bubble .vditor-reset > :first-child { margin-top: 0; }
.dyn-vditor-user-bubble .vditor-reset > :last-child { margin-bottom: 0; }
.dyn-vditor-user-bubble .vditor-reset a { color: var(--dsw-alias-state-business-primary); }
.dyn-vditor-user-bubble .vditor-reset :not(pre) > code {
  border-radius: 6px;
  background: var(--dsw-alias-markdown-inline-code);
  padding: 0 5px;
  font-family: var(--ds-font-family-code, monospace);
  font-size: 0.875em;
  color: inherit;
}
.dyn-vditor-user-bubble .vditor-reset img {
  max-width: 100%;
  border-radius: 8px;
}
.dyn-vditor-user-bubble .vditor-reset pre { position: relative; }
.dyn-vditor-user-bubble .vditor-reset pre > div.vditor-math,
.dyn-vditor-user-bubble .vditor-reset svg[id^='mermaid'] { max-width: 100%; }
.dyn-vditor-user-bubble .vditor-reset pre[data-dyn-lang]::after {
  content: attr(data-dyn-lang);
  position: absolute;
  bottom: 6px;
  right: 8px;
  z-index: 5;
  font-size: 11px;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 6px;
  background: rgba(20, 20, 26, 0.95);
  color: rgba(255, 255, 255, 0.95);
  font-family: var(--ds-font-family-code, monospace);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.12s;
}
.dyn-vditor-user-bubble .vditor-reset pre[data-dyn-lang]:hover::after {
  opacity: 1;
}
.dyn-vditor-md-code-copy {
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 5;
  border: none;
  border-radius: 6px;
  padding: 1px 8px;
  background: rgba(20, 20, 26, 0.95);
  color: rgba(255, 255, 255, 0.95);
  font-size: 11px;
  line-height: 18px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.12s;
  pointer-events: none;
}
.dyn-vditor-user-bubble .vditor-reset pre:hover .dyn-vditor-md-code-copy {
  opacity: 1;
  pointer-events: auto;
}
.dyn-vditor-md-code-copy:hover { background: rgba(60, 60, 68, 0.95); }
.dyn-vditor-md-image-alt {
  color: var(--dsw-alias-label-tertiary);
  font-style: italic;
}
.dyn-vditor-user-fallback { white-space: pre-wrap; word-break: break-word; }
.dyn-vditor-user-actions {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.12s;
  display: flex;
}
.dyn-vditor-user-row:hover .dyn-vditor-user-actions { opacity: 1; }
.dyn-vditor-user-copy {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 2px 6px;
  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
}
.dyn-vditor-user-copy:hover { background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2)); color: var(--dsw-alias-label-primary); }
.dyn-vditor-user-time {
  color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary));
  font-size: 12px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
}
`
      document.head.appendChild(styleEl)
    }
    ensureStyles()
    ctx.effect(() => () => {
      const el = document.getElementById(STYLE_TAG)
      if (el) el.remove()
    })
    ctx.effect(() => () => {
      document.querySelectorAll('[data-dyn-vditor]').forEach((el) => el.remove())
    })

    const P = {
      plus: 'M8.64453 1.5V7.34961H14.5V8.65039H8.64453V14.5H7.34473V8.65039H1.5V7.34961H7.34473V1.5H8.64453Z',
      chevron: 'M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z',
      chevronRight: 'M5.5 2.15137L5.92383 2.57617L8.65137 5.30273C8.90706 5.55843 9.13382 5.78438 9.29785 5.98828C9.46883 6.20088 9.61756 6.44405 9.66602 6.75C9.69222 6.91565 9.69222 7.08435 9.66602 7.25C9.61756 7.55595 9.46883 7.79912 9.29785 8.01172C9.13382 8.21562 8.90706 8.44157 8.65137 8.69727L5.92383 11.4238L5.5 11.8486L4.65137 11L5.07617 10.5762L7.80273 7.84863C8.07732 7.57405 8.24849 7.40124 8.3623 7.25977C8.46904 7.12709 8.47813 7.07728 8.48047 7.0625C8.48703 7.02105 8.48703 6.97895 8.48047 6.9375C8.47813 6.92272 8.46904 6.87291 8.3623 6.74023C8.24849 6.59876 8.07732 6.42595 7.80273 6.15137L5.07617 3.42383L4.65137 3L5.5 2.15137Z',
      paperclip: 'M5.5498 9.75V5H6.9502V9.75C6.9502 10.3299 7.4201 10.7998 8 10.7998C8.5799 10.7998 9.0498 10.3299 9.0498 9.75V4.5C9.0498 2.9536 7.7964 1.7002 6.25 1.7002C4.7036 1.7002 3.4502 2.9536 3.4502 4.5V9.75C3.4502 12.2629 5.4871 14.2998 8 14.2998C10.5129 14.2998 12.5498 12.2629 12.5498 9.75V4H13.9502V9.75C13.9502 13.0361 11.2861 15.7002 8 15.7002C4.71391 15.7002 2.0498 13.0361 2.0498 9.75V4.5C2.04981 2.1804 3.9304 0.299806 6.25 0.299805C8.5696 0.299805 10.4502 2.1804 10.4502 4.5V9.75C10.4502 11.1031 9.3531 12.2002 8 12.2002C6.6469 12.2002 5.5498 11.1031 5.5498 9.75Z',
      send: 'M8.3125 0.981587C8.66767 1.0545 8.97902 1.20558 9.2627 1.43374C9.48724 1.61438 9.73029 1.85933 9.97949 2.10854L14.707 6.83608L13.293 8.25014L9 3.95717V15.0431H7V3.95717L2.70703 8.25014L1.29297 6.83608L6.02051 2.10854C6.26971 1.85933 6.51277 1.61438 6.7373 1.43374C6.97662 1.24126 7.28445 1.04542 7.6875 0.981587C7.8973 0.94841 8.1031 0.95056 8.3125 0.981587Z',
      shield: 'M8.20554 0.899994L14.7901 3.36857V7.01026C14.7901 12 11.0466 14.2103 8.20554 15.3C5.36446 14.2103 1.62012 12 1.62012 7.01026V3.36857L8.20554 0.899994Z',
      permCheck: 'M12.1654 5.7552L8.9447 9.41475C8.73044 9.65816 8.53628 9.8804 8.35774 10.0423C8.1713 10.2114 7.94235 10.3717 7.64016 10.4254C7.48207 10.4535 7.32 10.4552 7.16151 10.4294C6.85843 10.3801 6.62728 10.2223 6.43836 10.0559C6.25752 9.89653 6.06037 9.67732 5.84264 9.43705L4.72925 8.20897L5.63557 7.38707L6.74897 8.61594C6.98603 8.87755 7.12974 9.03533 7.24673 9.13839C7.31033 9.19443 7.34485 9.21476 7.35823 9.22122C7.38068 9.22484 7.40352 9.22515 7.42593 9.22122C7.40522 9.22502 7.42893 9.23294 7.53583 9.136C7.65132 9.03126 7.79316 8.87139 8.02643 8.60638L11.2479 4.94763L12.1654 5.7552Z',
      permPencil: 'M8.14852 14.1308L7.33925 15.4976C7.22458 15.6912 7.42245 15.9194 7.63037 15.8333L9.09785 15.2254L15.0399 10.0719L14.0905 8.97733L8.14852 14.1308Z',
      permBang1: 'M9.10094 4.5V8.75939H7.59888V4.5H9.10094Z',
      permBang2: 'M9.10094 9.8114V11.5H7.59888V9.8114H9.10094Z',
      todoLead1: 'M13.3277 9.69629V10.976H7.28086V9.69629H13.3277Z',
      todoLead2: 'M13.3277 2.97256V4.25225H7.28086V2.97256H13.3277Z',
      todoLead3: 'M4.64512 10.336C4.64505 9.62755 4.07081 9.05322 3.3623 9.05322C2.65386 9.05329 2.07956 9.62759 2.07949 10.336C2.07949 11.0445 2.65382 11.6188 3.3623 11.6188C4.07085 11.6188 4.64512 11.0446 4.64512 10.336ZM5.92559 10.336C5.92559 11.7515 4.77777 12.8993 3.3623 12.8993C1.94689 12.8993 0.799805 11.7515 0.799805 10.336C0.799871 8.92066 1.94693 7.7736 3.3623 7.77354C4.77773 7.77354 5.92552 8.92062 5.92559 10.336Z',
      todoLead4: 'M4.64531 3.6123C4.6453 2.90382 4.07098 2.32949 3.3625 2.32949C2.65403 2.32951 2.0797 2.90383 2.07969 3.6123C2.07969 4.32079 2.65402 4.8951 3.3625 4.89512C4.07099 4.89512 4.64531 4.3208 4.64531 3.6123ZM5.925 3.6123C5.925 5.02772 4.77792 6.1748 3.3625 6.1748C1.9471 6.17479 0.8 5.02771 0.8 3.6123C0.800013 2.19691 1.9471 1.04982 3.3625 1.0498C4.77791 1.0498 5.92499 2.1969 5.925 3.6123Z',
      todoCheck: 'M10.9631 5.71411L7.70154 8.97571C7.48011 9.19714 7.27736 9.40099 7.09229 9.54993C6.89742 9.70669 6.66314 9.85279 6.3634 9.90027C6.2049 9.92534 6.04339 9.92534 5.88489 9.90027C5.58515 9.85279 5.35087 9.70669 5.15601 9.54993C4.97093 9.40099 4.76818 9.19714 4.54675 8.97571L3.03516 7.46411L3.96313 6.53613L5.47473 8.04773C5.7169 8.28989 5.86196 8.43389 5.97888 8.52795C6.08597 8.61409 6.10875 8.60701 6.08997 8.604C6.11259 8.60758 6.13571 8.60758 6.15833 8.604C6.13954 8.60701 6.16232 8.61409 6.26941 8.52795C6.38633 8.43389 6.53139 8.28989 6.77356 8.04773L10.0352 4.78613L10.9631 5.71411Z',
      fileGlyph: 'M4.75 1.75C4.19772 1.75 3.75 2.19772 3.75 2.75V13.25C3.75 13.8023 4.19772 14.25 4.75 14.25H11.25C11.8023 14.25 12.25 13.8023 12.25 13.25V5.75L8.25 1.75H4.75ZM7.25 2.75V6.5H11V13.25C11 13.3881 10.8881 13.5 10.75 13.5H5.25C5.11193 13.5 5 13.3881 5 13.25V2.75C5 2.61193 5.11193 2.5 5.25 2.5H7.25Z',
      folderGlyph: 'M2.75 3.25C2.19772 3.25 1.75 3.69772 1.75 4.25V11.75C1.75 12.3023 2.19772 12.75 2.75 12.75H13.25C13.8023 12.75 14.25 12.3023 14.25 11.75V5.75C14.25 5.19772 13.8023 4.75 13.25 4.75H8.75L7.75 3.25H2.75Z',
    }
    const iconPath = (d, size, vb) => React.createElement('svg', {
      width: size,
      height: size,
      viewBox: '0 0 ' + (vb === undefined ? size : vb) + ' ' + (vb === undefined ? size : vb),
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      'aria-hidden': true,
    },
      React.createElement('path', { d, fill: 'currentColor' }))
    const iconShieldStroke = (size) => React.createElement('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true },
      React.createElement('path', { d: P.shield, stroke: 'currentColor', strokeWidth: 1.31831, strokeLinejoin: 'round' }))
    const iconStop = (size) => React.createElement('svg', { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true },
      React.createElement('rect', { x: 3, y: 3, width: 10, height: 10, rx: 3, fill: 'currentColor' }))
    const iconCheckLine = (size) => React.createElement('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
      React.createElement('path', { d: 'M4.5 8.5L7 11L11.5 5.5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }))
    const todoLeadIcon = () => React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true },
      React.createElement('path', { d: P.todoLead1, fill: 'currentColor' }),
      React.createElement('path', { d: P.todoLead2, fill: 'currentColor' }),
      React.createElement('path', { d: P.todoLead3, fill: 'currentColor' }),
      React.createElement('path', { d: P.todoLead4, fill: 'currentColor' }))
    const todoGlyph = (status, gid) => {
      if (status === 'completed') {
        return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', 'aria-hidden': true },
          React.createElement('circle', { cx: 7, cy: 7, r: 6.4, stroke: 'currentColor', strokeWidth: 1.2 }),
          React.createElement('path', { d: P.todoCheck, fill: 'currentColor' }))
      }
      if (status === 'in_progress') {
        return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', 'aria-hidden': true },
          React.createElement('defs', null,
            React.createElement('linearGradient', { id: gid, x1: '2.5', y1: '12', x2: '10.5', y2: '3.5', gradientUnits: 'userSpaceOnUse' },
              React.createElement('stop', { stopColor: 'currentColor' }),
              React.createElement('stop', { offset: '1', stopColor: 'currentColor', stopOpacity: '0' }))),
          React.createElement('circle', { cx: 7, cy: 7, r: 6.4, stroke: 'url(#' + gid + ')', strokeWidth: 1.2 }))
      }
      return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', 'aria-hidden': true },
        React.createElement('circle', { cx: 7, cy: 7, r: 6.4, stroke: 'currentColor', strokeWidth: 1.2, strokeDasharray: '2.4 2.4' }))
    }
    const permGlyph = (value, size) => {
      if (value === 'danger-full-access') {
        return React.createElement('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
          React.createElement('path', { d: P.shield, stroke: 'currentColor', strokeWidth: 1.31831, strokeLinejoin: 'round' }),
          React.createElement('path', { d: P.permBang1, fill: 'currentColor' }),
          React.createElement('path', { d: P.permBang2, fill: 'currentColor' }))
      }
      if (value === 'workspace-write') {
        return React.createElement('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
          React.createElement('path', { d: P.shield, stroke: 'currentColor', strokeWidth: 1.31831, strokeLinejoin: 'round' }),
          React.createElement('path', { d: P.permPencil, fill: 'currentColor' }))
      }
      return React.createElement('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        React.createElement('path', { d: P.shield, stroke: 'currentColor', strokeWidth: 1.31831, strokeLinejoin: 'round' }),
        React.createElement('path', { d: P.permCheck, fill: 'currentColor' }))
    }

    const FULL_ACCESS = 'danger-full-access'
    const displayName = (value) => String(value || '').split('-').filter(Boolean).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
    const COMMANDS = [
      { name: 'goal', desc: '设置或查看长期任务目标', arg: '[<目标>|clear|edit <目标>|pause|resume]' },
      { name: 'compact', desc: '压缩较早的对话历史', arg: '' },
      { name: 'permission', desc: '切换权限预设（沙箱模式 + 审批策略）', arg: '<preset>' },
      { name: 'plan', desc: '进入或退出计划模式', arg: '[off|message]' },
      { name: 'export', desc: '将会话日志下载为 ZIP 压缩包', arg: '' },
      { name: 'feedback', desc: '记录对本会话的反馈', arg: '<text>' },
      { name: 'model', desc: '切换模型与推理等级', model: true },
    ]
    const RING_C = 2 * Math.PI * 5.5
    const fmtDuration = (ms) => {
      if (!isFinite(ms) || ms <= 0) return '0s'
      const s = ms / 1000
      if (s < 60) return s.toFixed(1) + 's'
      return Math.floor(s / 60) + 'm' + Math.round(s % 60) + 's'
    }
    const fmtTokens = (n) => {
      n = Number(n) || 0
      if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M'
      if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
      return String(Math.round(n))
    }
    const fmtTps = (tps) => (tps >= 100 ? String(Math.round(tps)) : tps >= 10 ? tps.toFixed(1) : tps.toFixed(2))

    const SPECIAL_LANGS = ['mermaid', 'echarts', 'mindmap', 'math', 'graphviz', 'abc', 'plantuml', 'wavedrom', 'markmap', 'flowchart', 'smiles']

    const detectDark = () => {
      try {
        const value = getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim()
        if (value !== '') {
          const m = /(?:rgba?\(\s*)?(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(value)
          if (m !== null) {
            return 0.2126 * Number(m[1]) + 0.7152 * Number(m[2]) + 0.0722 * Number(m[3]) < 140
          }
        }
      } catch (err) { /* 忽略 */ }
      try { if (document.body.hasAttribute('data-ds-dark-theme')) return true } catch (err) { /* 忽略 */ }
      try { return window.matchMedia('(prefers-color-scheme: dark)').matches } catch (err) { return false }
    }
    const useDshIsDark = () => {
      const [dark, setDark] = React.useState(detectDark)
      React.useEffect(() => {
        let dispose = null
        const schedule = () => {
          if (dispose !== null) return
          dispose = ctx.timeout(() => {
            dispose = null
            setDark(detectDark())
          }, 80)
        }
        try {
          const observer = new MutationObserver(schedule)
          observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ds-dark-theme', 'style'] })
          observer.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme', 'style'] })
          return () => {
            if (dispose !== null) { dispose(); dispose = null }
            observer.disconnect()
          }
        } catch (err) {
          return undefined
        }
      }, [])
      return dark
    }

    const sanitizeAndEnhance = (root) => {
      if (!root) return
      try {
        root.querySelectorAll('a').forEach((a) => {
          const href = a.getAttribute('href') || ''
          let safe = null
          try {
            const p = new URL(href).protocol
            if (p === 'http:' || p === 'https:' || p === 'mailto:') safe = href
          } catch (err) { /* 忽略 */ }
          if (safe === null) a.removeAttribute('href')
          else {
            a.setAttribute('target', '_blank')
            a.setAttribute('rel', 'noopener noreferrer')
          }
        })
      } catch (err) { /* 忽略 */ }
      try {
        root.querySelectorAll('img').forEach((img) => {
          const src = img.getAttribute('src') || ''
          let ok = false
          try {
            const p = new URL(src).protocol
            ok = p === 'http:' || p === 'https:'
          } catch (err) { /* 忽略 */ }
          if (!ok) {
            const span = document.createElement('span')
            span.className = 'dyn-vditor-md-image-alt'
            span.textContent = img.getAttribute('alt') || '图片'
            img.replaceWith(span)
          } else {
            img.setAttribute('referrerPolicy', 'no-referrer')
            img.setAttribute('loading', 'lazy')
          }
        })
      } catch (err) { /* 忽略 */ }
      try {
        root.querySelectorAll('pre > code').forEach((code) => {
          const pre = code.parentElement
          if (pre === null || pre.dataset.dynMdCode === '1') return
          const m = /language-([\w+-]+)/.exec(code.className || '')
          if (m !== null && SPECIAL_LANGS.includes(m[1])) return
          pre.dataset.dynMdCode = '1'
          pre.style.position = 'relative'
          if (m !== null) {
            pre.setAttribute('data-dyn-lang', m[1])
          }
          const btn = document.createElement('button')
          btn.type = 'button'
          btn.className = 'dyn-vditor-md-code-copy'
          btn.textContent = '复制'
          btn.addEventListener('click', () => {
            const text = code.textContent || ''
            try {
              if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                navigator.clipboard.writeText(text).then(() => {
                  btn.textContent = '已复制'
                  ctx.timeout(() => { btn.textContent = '复制' }, 1500)
                }).catch(() => {})
              }
            } catch (err) { /* 忽略 */ }
          })
          pre.appendChild(btn)
        })
      } catch (err) { /* 忽略 */ }
    }

    const UserMarkdownNodeView = (props) => {
      const { node, loadImage } = props
      const data = node && node.data ? node.data : null
      const content = data && Array.isArray(data.content) ? data.content : []
      const texts = []
      const images = []
      content.forEach((block) => {
        if (block && block.type === 'text' && typeof block.text === 'string') texts.push(block.text)
        else if (block && block.type === 'image' && block.attachment !== undefined) images.push({ attachment: block.attachment })
      })
      const text = texts.join('')
      const elRef = React.useRef(null)
      const isDark = useDshIsDark()
      const [renderState, setRenderState] = React.useState('pending')
      const [imageUrls, setImageUrls] = React.useState([])
      const [copied, setCopied] = React.useState(false)

      React.useEffect(() => {
        let cancelled = false
        if (images.length > 0 && typeof loadImage === 'function') {
          images.forEach((img, i) => {
            loadImage(img.attachment).then((url) => {
              if (cancelled || typeof url !== 'string') return
              setImageUrls((prev) => {
                const next = prev.slice()
                next[i] = url
                return next
              })
            }).catch(() => {})
          })
        }
        return () => { cancelled = true }
      }, [node, loadImage])

      React.useEffect(() => {
        if (elRef.current === null || text === '') { setRenderState(text === '' ? 'ready' : 'pending'); return }
        let cancelled = false
        setRenderState('pending')
        const options = {
          mode: isDark ? 'dark' : 'light',
          hljs: { enable: true, style: 'monokai' },
          markdown: { codeBlockPreview: true, mathBlockPreview: true },
          math: { engine: 'KaTeX', inlineDigit: false, macros: {} },
          after: () => {
            if (cancelled || elRef.current === null) return
            sanitizeAndEnhance(elRef.current)
            setRenderState('ready')
          },
        }
        loadVditor().then(() => {
          if (cancelled || elRef.current === null) return
          try {
            window.Vditor.preview(elRef.current, text, options)
          } catch (err) {
            console.error('[dsh-vditor]', err)
            setRenderState('failed')
          }
        }).catch(() => {
          if (!cancelled) setRenderState('failed')
        })
        return () => { cancelled = true }
      }, [text, isDark])

      React.useEffect(() => {
        if (renderState !== 'ready') return
        const el = elRef.current
        if (el === null) return
        return ctx.timeout(() => {
          sanitizeAndEnhance(el)
        }, 900)
      }, [renderState, text])

      React.useEffect(() => {
        if (!copied) return
        return ctx.timeout(() => setCopied(false), 1500)
      }, [copied])

      const copyText = () => {
        try {
          if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text).then(() => setCopied(true)).catch(() => {})
          } else {
            setCopied(true)
          }
        } catch (err) { /* 忽略 */ }
      }

      let time = ''
      try {
        if (data && data.time) time = new Date(data.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      } catch (err) { /* 忽略 */ }

      return React.createElement('div', { className: 'dyn-vditor-user-row', 'data-time-hover-root': true },
        images.length > 0 && React.createElement('div', { className: 'dyn-vditor-user-images' },
          images.map((img, i) => React.createElement('img', {
            key: 'img-' + i,
            className: 'dyn-vditor-user-img',
            src: imageUrls[i],
            alt: '',
            loading: 'lazy',
          })),
        ),
        text !== '' && React.createElement('div', { className: 'dyn-vditor-user-bubble' },
          React.createElement('div', { className: 'dyn-vditor-user-md', ref: elRef },
            renderState === 'failed' && React.createElement('span', { className: 'dyn-vditor-user-fallback' }, text),
          ),
        ),
        text !== '' && React.createElement('div', { className: 'dyn-vditor-user-actions' },
          React.createElement('button', { type: 'button', className: 'dyn-vditor-user-copy', title: '复制消息', onClick: copyText }, copied ? '已复制' : '复制'),
          time !== '' && React.createElement('span', { className: 'dyn-vditor-user-time' }, time),
        ),
      )
    }

    const VditorComposer = (props) => {
      const { useSession, useSessions, useWorkspaces, useInput, inputActions, useProjection, sessionId, rightItems, leftItems, overlay, footer, placeholder: ownerPlaceholder } = props

      const [status, setStatus] = React.useState('loading')
      const [permOpen, setPermOpen] = React.useState(false)
      const [permBusy, setPermBusy] = React.useState(false)
      const [modelOpen, setModelOpen] = React.useState(false)
      const [modelView, setModelView] = React.useState(null)
      const [modelBusy, setModelBusy] = React.useState(false)
      const [modelState, setModelState] = React.useState(null)
      const [cmdOpen, setCmdOpen] = React.useState(false)
      const [meterOpen, setMeterOpen] = React.useState(false)
      const [fileTip, setFileTip] = React.useState(null)
      const [atLoading, setAtLoading] = React.useState(false)
      const [atItems, setAtItems] = React.useState([])
      const [atDismissed, setAtDismissed] = React.useState(false)
      const [attachments, setAttachments] = React.useState([])
      const [dbStatus, setDbStatus] = React.useState(null)

      const containerRef = React.useRef(null)
      const vditorRef = React.useRef(null)
      const directoryRef = React.useRef(null)
      const inputActionsRef = React.useRef(null)
      const atSeqRef = React.useRef(0)
      const langObserverRef = React.useRef(null)
      const langTimerRef = React.useRef(null)
      const hoverPreRef = React.useRef(null)
      const cwdRef = React.useRef('')
      const draftRef = React.useRef('')
      const attachmentsRef = React.useRef([])
      const placeholderRef = React.useRef('')

      inputActionsRef.current = inputActions

      const draft = useInput ? useInput((s) => s.draft) || '' : ''
      const sending = useInput ? useInput((s) => s.phase === 'submitting') : false
      const running = useSession ? useSession((s) => s.running) ?? false : false
      const removed = useSession ? useSession((s) => s.removed) ?? false : false
      const blank = useSession ? useSession((s) => s.blank) ?? false : false
      const sessionsSnap = useSessions((s) => s)
      const sessionCwd = sessionId === undefined ? undefined : sessionsSnap.byId[sessionId]?.cwd
      const agentPreset = sessionId === undefined ? undefined : sessionsSnap.byId[sessionId]?.agentPreset
      const workspaceList = useWorkspaces((s) => s)
      const permissions = useProjection('permissions')
      const contextPressure = useProjection('contextPressure')
      const contextBreakdown = useProjection('contextBreakdown')
      const plan = useProjection('plan')

      const noActions = !inputActions
      const planActive = plan !== undefined && (plan.pending ? !plan.active : plan.active)
      const wsItems = workspaceList && Array.isArray(workspaceList.items) ? workspaceList.items : []
      const sessionWorkspace = sessionId === undefined ? undefined : wsItems.find((w) => Array.isArray(w.sessionIds) && w.sessionIds.includes(sessionId))
      const cwd = sessionCwd || (sessionWorkspace && sessionWorkspace.path) || (wsItems.length > 0 && wsItems[0].path) || ''
      cwdRef.current = cwd
      draftRef.current = draft
      attachmentsRef.current = attachments

      const disabled = removed || running || noActions
      const empty = draft.trim() === ''

      const directory = modelDirectories && sessionId !== undefined ? modelDirectories.directoryFor(sessionId) : null
      directoryRef.current = directory

      const placeholder = (() => {
        if (agentPreset === 'database-helper') {
          if (dbStatus === null) return '数据库未连接，请点击输入框右上角的配置按钮'
          if (dbStatus.connected) return '数据库连接成功，请描述分析内容'
          if (dbStatus.reconnectRequired) return '数据库需要重新认证，请点击输入框右上角的配置按钮'
          return '数据库未连接，请点击输入框右上角的配置按钮'
        }
        if (ownerPlaceholder) return ownerPlaceholder
        if (removed) return '会话不可用'
        if (planActive) return '描述你的任务以生成计划'
        return '给智能体发消息'
      })()
      placeholderRef.current = placeholder

      React.useEffect(() => {
        if (agentPreset !== 'database-helper') { setDbStatus(null); return }
        let cancelled = false
        const poll = () => {
          fetch('/plugins/database-helper/status?sessionId=' + encodeURIComponent(sessionId)).then((r) => r.json()).then((body) => {
            if (cancelled) return
            setDbStatus({ connected: body.connected === true, reconnectRequired: body.reconnectRequired === true })
          }).catch(() => {})
        }
        poll()
        const timer = setInterval(poll, 1500)
        return () => { cancelled = true; clearInterval(timer) }
      }, [agentPreset, sessionId])

      React.useEffect(() => {
        const dir = directoryRef.current
        if (!dir || !dir.store) return
        const store = dir.store
        const sync = () => setModelState(store.getSnapshot())
        sync()
        const unsub = store.subscribe(sync)
        try { dir.load().catch((err) => console.error('[dsh-vditor]', err)) } catch (err) { console.error('[dsh-vditor]', err) }
        return unsub
      }, [sessionId, modelDirectories])

      React.useEffect(() => {
        let cancelled = false
        loadVditor().then(() => {
          if (cancelled || containerRef.current === null) return
          const el = containerRef.current
          const injectCodeLangs = () => {
            try {
              const els = el.querySelectorAll("pre.vditor-ir__preview code[class*='language-']")
              els.forEach((code) => {
                const pre = code.parentElement
                if (pre === null) return
                const m = /language-([\w+-]+)/.exec(code.className || '')
                if (m === null || SPECIAL_LANGS.includes(m[1])) return
                if (pre.getAttribute('data-dyn-lang') === m[1]) return
                try {
                  const pos = getComputedStyle(pre).position
                  if (pos !== 'relative' && pos !== 'absolute' && pos !== 'fixed') pre.style.position = 'relative'
                } catch (err) { /* 忽略 */ }
                pre.setAttribute('data-dyn-lang', m[1])
              })
            } catch (err) { /* 忽略 */ }
          }
          const scheduleLangInject = () => {
            if (langTimerRef.current !== null) return
            langTimerRef.current = ctx.timeout(() => {
              langTimerRef.current = null
              injectCodeLangs()
            }, 80)
          }
          const onMouseMove = (e) => {
            let found = null
            try {
              const els = document.elementsFromPoint(e.clientX, e.clientY)
              for (const item of els) {
                if (item.classList && item.classList.contains('vditor-ir__preview')) {
                  found = item
                  break
                }
              }
            } catch (err) { /* 忽略 */ }
            if (hoverPreRef.current === found) return
            if (hoverPreRef.current !== null) {
              try { hoverPreRef.current.classList.remove('dyn-hover') } catch (err) {}
            }
            hoverPreRef.current = found
            if (found !== null) {
              try { found.classList.add('dyn-hover') } catch (err) {}
            }
          }
          const onMouseLeave = () => {
            if (hoverPreRef.current !== null) {
              try { hoverPreRef.current.classList.remove('dyn-hover') } catch (err) {}
              hoverPreRef.current = null
            }
          }
          const vditor = new window.Vditor(el, {
            mode: 'ir',
            cache: { enable: false },
            placeholder: placeholderRef.current,
            preview: {
              hljs: { enable: true, style: 'monokai' },
              markdown: { codeBlockPreview: true },
              math: { engine: 'KaTeX', inlineDigit: false, macros: {} },
            },
            upload: {
              handler: (files) => {
                uploadFiles(Array.prototype.slice.call(files || []))
              },
            },
            input: (value) => {
              setAtDismissed(false)
              if (inputActionsRef.current) inputActionsRef.current.setDraft(value)
              scheduleLangInject()
            },
            after: () => {
              if (cancelled) return
              vditor.setValue(draftRef.current || '')
              const ta = el.querySelector('.vditor-ir pre.vditor-reset')
              if (ta) ta.setAttribute('placeholder', placeholderRef.current)
              setStatus('ready')
              scheduleLangInject()
            },
          })
          vditorRef.current = vditor
          try {
            langObserverRef.current = new MutationObserver(injectCodeLangs)
            langObserverRef.current.observe(el, { childList: true, subtree: true })
            injectCodeLangs()
          } catch (err) { /* 忽略 */ }
          el.addEventListener('mousemove', onMouseMove)
          el.addEventListener('mouseleave', onMouseLeave)
        }).catch((err) => {
          console.error('[dsh-vditor]', err)
          if (!cancelled) setStatus('error')
        })
        return () => {
          cancelled = true
          if (langTimerRef.current !== null) {
            langTimerRef.current()
            langTimerRef.current = null
          }
          if (langObserverRef.current) {
            try { langObserverRef.current.disconnect() } catch (err) {}
            langObserverRef.current = null
          }
          if (vditorRef.current) {
            try { vditorRef.current.destroy() } catch (err) {}
            vditorRef.current = null
          }
        }
      }, [])

      React.useEffect(() => {
        const v = vditorRef.current
        if (v === null || status !== 'ready') return
        const cur = String(v.getValue ? v.getValue() : '').replace(/\n+$/, '')
        const next = String(draft || '').replace(/\n+$/, '')
        if (cur !== next) v.setValue(draft || '')
      }, [draft, status])

      React.useEffect(() => {
        if (status !== 'ready') return
        const ta = containerRef.current ? containerRef.current.querySelector('.vditor-ir pre.vditor-reset') : null
        if (ta) ta.setAttribute('placeholder', placeholder)
      }, [placeholder, status])

      const trimmedDraft = String(draft || '').replace(/\n+$/, '')
      const draftLines = trimmedDraft.split('\n')
      const lastLine = draftLines.length > 0 ? draftLines[draftLines.length - 1] : ''
      const slashMatch = /^\/([^\s/]*)(?:\s+(\S*))?$/.exec(lastLine)
      const slashActive = slashMatch !== null
      const slashName = slashMatch ? slashMatch[1] : ''
      const slashArg = slashMatch && slashMatch[2] ? slashMatch[2] : ''
      const slashCandidates = slashActive
        ? (slashName === '' ? COMMANDS : COMMANDS.filter((c) => c.name.toLowerCase().startsWith(slashName.toLowerCase())))
        : []
      const atMatch = /@([^\s@]*)$/.exec(lastLine)
      const atActive = !slashActive && atMatch !== null && !atDismissed
      const atQuery = atMatch ? atMatch[1] : ''

      React.useEffect(() => {
        if (!atActive) { setAtItems([]); return }
        const seq = ++atSeqRef.current
        setAtLoading(true)
        const dispose = ctx.timeout(async () => {
          try {
            const res = await apiFetch('/atfile-search?query=' + encodeURIComponent(atQuery) + '&workspace=' + encodeURIComponent(cwd))
            if (seq !== atSeqRef.current) return
            setAtItems(res && res.ok === true && Array.isArray(res.items) ? res.items : [])
          } catch (err) {
            console.error('[dsh-vditor]', err)
            if (seq !== atSeqRef.current) return
            setAtItems([])
            setFileTip('@ 文件搜索失败：' + (err && err.message ? err.message : String(err)))
          } finally {
            if (seq === atSeqRef.current) setAtLoading(false)
          }
        }, 250)
        return dispose
      }, [atActive, atQuery, cwd])

      React.useEffect(() => {
        if (fileTip === null) return
        return ctx.timeout(() => setFileTip(null), 6000)
      }, [fileTip])

      const readAsDataURL = (file) => new Promise((resolve, reject) => {
        try {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new Error('读取文件失败'))
          reader.readAsDataURL(file)
        } catch (err) {
          reject(err)
        }
      })

      const uploadFiles = async (files) => {
        if (!Array.isArray(files) || files.length === 0) return
        const ws = cwdRef.current
        if (!ws) { setFileTip('无法保存粘贴图片：未找到工作区路径'); return }
        setFileTip('正在保存粘贴图片…')
        let okCount = 0
        const failures = []
        const added = []
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          try {
            const dataUrl = await readAsDataURL(file)
            const m = /^data:([^;]*);base64,(.*)$/.exec(String(dataUrl || ''))
            if (!m) throw new Error('无法读取文件内容')
            const dot = file.name.lastIndexOf('.')
            const extRaw = dot > 0 ? file.name.slice(dot + 1) : ''
            const ext = /^[a-z0-9]{1,8}$/i.test(extRaw) ? extRaw.toLowerCase() : 'png'
            const finalName = 'img-' + Date.now() + '-' + i + '.' + ext
            const res = await apiFetch('/save-upload', { workspace: ws, name: finalName, base64: m[2] })
            if (!res || res.ok !== true) throw new Error(res && res.error ? res.error : '保存失败')
            added.push(res.absolute || (ws.replace(/[\\/]+$/, '') + '\\' + String(res.relative || finalName).replace(/\//g, '\\')))
            okCount++
          } catch (err) {
            console.error('[dsh-vditor]', err)
            failures.push((file && file.name ? file.name : '图片') + '：' + (err && err.message ? err.message : String(err)))
          }
        }
        if (added.length > 0) {
          setAttachments((prev) => {
            const seen = new Set(prev.map((a) => a.path))
            const next = prev.slice()
            added.forEach((p) => {
              if (!seen.has(p)) {
                seen.add(p)
                next.push({ path: p, name: p.replace(/\\/g, '/').split('/').pop() || p })
              }
            })
            return next
          })
        }
        if (failures.length > 0) setFileTip('保存失败 ' + failures.length + ' 个：' + failures[0] + (failures.length > 1 ? ' …' : ''))
        else setFileTip('已保存 ' + okCount + ' 张图片到工作区 .dsh-assets/，将随消息附上路径')
      }

      const pickFiles = async () => {
        setFileTip('正在打开文件选择器…')
        try {
          const res = await apiFetch('/pick-files', { workspace: cwdRef.current })
          if (!res || res.ok !== true) throw new Error(res && res.error ? res.error : '文件选择器失败')
          const files = Array.isArray(res.files) ? res.files.filter((p) => typeof p === 'string' && p !== '') : []
          if (files.length === 0) { setFileTip(null); return }
          setAttachments((prev) => {
            const seen = new Set(prev.map((a) => a.path))
            const next = prev.slice()
            files.forEach((p) => {
              if (seen.has(p)) return
              seen.add(p)
              next.push({ path: p, name: p.replace(/\\/g, '/').split('/').pop() || p })
            })
            return next
          })
          setFileTip('已添加文件引用，发送时将路径附入消息')
        } catch (err) {
          console.error('[dsh-vditor]', err)
          setFileTip('选择文件失败：' + (err && err.message ? err.message : String(err)))
        }
      }

      const removeAttachment = (path) => {
        setAttachments((prev) => prev.filter((a) => a.path !== path))
      }

      const submitWithAttachments = () => {
        if (!inputActionsRef.current) return
        const list = attachmentsRef.current
        const paths = Array.isArray(list) ? list.map((a) => a.path) : []
        let base = String(draftRef.current || '').replace(/\n+$/, '')
        if (paths.length > 0) {
          const block = '附件路径：\n' + paths.map((p) => '`' + p + '`').join('\n')
          base = base ? base + '\n\n' + block : block
          setAttachments([])
        }
        inputActionsRef.current.setDraft(base)
        inputActionsRef.current.submit()
      }

      const runCommand = async (line) => {
        if (sessionId === undefined) return
        try {
          const svc = sessions !== undefined ? sessions : ctx.get('sessions')
          const binding = svc ? svc.binding(sessionId) : undefined
          const session = binding ? binding.session : undefined
          if (session && typeof session.command === 'function') {
            await session.command(line)
          } else {
            inputActionsRef.current.setDraft(line)
            inputActionsRef.current.submit()
          }
        } catch (err) { console.error('[dsh-vditor]', err) }
      }

      const stopTurn = () => {
        if (sessionId === undefined) return
        try {
          const svc = sessions !== undefined ? sessions : ctx.get('sessions')
          const binding = svc ? svc.binding(sessionId) : undefined
          const session = binding ? binding.session : undefined
          if (session && typeof session.cancel === 'function') session.cancel().catch(() => {})
        } catch (err) { /* 忽略 */ }
      }

      const choosePerm = async (value) => {
        setPermOpen(false)
        if (value === permCurrent) return
        if (value === FULL_ACCESS && typeof window.confirm === 'function') {
          const ok = window.confirm('切换到 Full access（完全访问）会允许 Agent 执行任意操作，确定吗？')
          if (!ok) return
        }
        setPermBusy(true)
        await runCommand('/permission ' + value)
        setPermBusy(false)
      }

      const runSlash = (name, arg) => {
        setCmdOpen(false)
        let line = '/' + name
        if (arg) line += ' ' + arg
        runCommand(line)
      }

      const onPickCommand = (cmd) => {
        if (cmd.model) {
          setCmdOpen(false)
          setModelOpen(true)
          setModelView(null)
          return
        }
        if (cmd.arg) {
          const input = window.prompt(cmd.desc + '\n参数：' + cmd.arg)
          if (input === null) return
          const val = input.trim()
          if (val !== '') runSlash(cmd.name, val)
          else runSlash(cmd.name, null)
        } else {
          runSlash(cmd.name, null)
        }
      }

      const pickRealtimeSlash = (cmd) => {
        const rest = draftLines.slice(0, -1).join('\n')
        inputActionsRef.current.setDraft(rest)
        if (cmd.model) {
          setModelOpen(true)
          setModelView(null)
          return
        }
        if (slashArg) {
          runCommand('/' + cmd.name + ' ' + slashArg)
          return
        }
        if (cmd.arg) {
          const input = window.prompt(cmd.desc + '\n参数：' + cmd.arg)
          if (input === null) return
          const val = input.trim()
          if (val !== '') runCommand('/' + cmd.name + ' ' + val)
          else runCommand('/' + cmd.name)
        } else {
          runCommand('/' + cmd.name)
        }
      }

      const pickAtItem = (item) => {
        const abs = String(item.path).replace(/\x5C/g, '\x5C\x5C')
        const replaced = lastLine.replace(/@([^\s@]*)$/, '@' + abs)
        const lines = draftLines.slice()
        lines[lines.length - 1] = replaced
        inputActionsRef.current.setDraft(lines.join('\n'))
        setAtDismissed(true)
        setAtItems([])
      }

      const chooseModel = async (group, model, effort) => {
        setModelOpen(false)
        setModelView(null)
        const directory = directoryRef.current
        if (!directory) return
        const sel = { provider: group.id, model: model.id }
        if (effort) sel.reasoningEffort = effort.id
        if (current && current.provider === group.id && current.model === model.id && (current.reasoningEffort ?? null) === (effort ? effort.id : null)) return
        setModelBusy(true)
        try {
          await directory.select(sel)
        } catch (err) {
          console.error('[dsh-vditor]', err)
        }
        setModelBusy(false)
      }

      const pressure = contextPressure
      const projected = pressure && typeof pressure.projectedTokens === 'number' ? pressure.projectedTokens : (pressure && typeof pressure.pressureTokens === 'number' ? pressure.pressureTokens : 0)
      const windowTokens = pressure && typeof pressure.contextWindow === 'number' ? pressure.contextWindow : 0
      const usagePercent = windowTokens > 0 ? Math.min(100, Math.round(projected / windowTokens * 100)) : null
      const breakdown = contextBreakdown
      const meterRows = [
        { key: 'system', label: '系统', value: (breakdown && breakdown.systemTokens) || 0, cls: 'system' },
        { key: 'tools', label: '工具', value: (breakdown && breakdown.toolsTokens) || 0, cls: 'tools' },
        { key: 'messages', label: '消息', value: (breakdown && breakdown.messageTokens) || 0, cls: 'messages' },
      ]

      const permOptions = permissions && Array.isArray(permissions.options) ? permissions.options : []
      const permCurrent = permissions ? permissions.currentValue : ''
      const optionLabel = (o) => (o && o.label) || displayName(o && o.value)
      const permLabel = (() => {
        const cur = permOptions.find((o) => o.value === permCurrent)
        return cur ? optionLabel(cur) : (permCurrent ? displayName(permCurrent) : '权限')
      })()

      const groups = modelState && Array.isArray(modelState.groups) ? modelState.groups : []
      const current = modelState ? modelState.current : null
      const modelStatus = modelState ? modelState.status : 'idle'
      const currentGroup = current && groups.find((g) => g.id === current.provider)
      const currentModel = currentGroup && currentGroup.models.find((m) => m.id === current.model)
      const currentEfforts = currentModel && currentModel.reasoning ? currentModel.reasoning.efforts : []
      const currentEffort = current && currentModel && currentModel.reasoning
        ? currentModel.reasoning.efforts.find((e) => e.id === current.reasoningEffort)
        : null
      const modelLabel = currentModel ? currentModel.name : current ? (current.provider + ' · ' + current.model) : '模型'
      const effortLabel = currentEffort ? currentEffort.name : ''

      return React.createElement('div', { className: 'dyn-vditor-wrap' },
        attachments.length > 0 && React.createElement('div', { className: 'dyn-vditor-attach-chips', 'aria-label': '已添加的文件引用' },
          attachments.map((a) => React.createElement('span', { className: 'dyn-vditor-attach-chip', key: a.path, title: a.path },
            React.createElement('span', { className: 'dyn-vditor-attach-chip-icon' }, iconPath(P.fileGlyph, 12, 16)),
            React.createElement('span', { className: 'dyn-vditor-attach-chip-name' }, a.name),
            React.createElement('button', {
              type: 'button',
              className: 'dyn-vditor-attach-chip-x',
              'aria-label': '移除 ' + a.name,
              title: '移除',
              onClick: () => removeAttachment(a.path),
            }, '×'),
          )),
        ),
        React.createElement('div', { className: 'dyn-vditor-card', 'data-composer-card': '' },
          overlay,
          leftItems,
          React.createElement('div', {
            ref: containerRef,
            className: 'dyn-vditor-box',
            onKeyDown: (e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                submitWithAttachments()
              }
            },
          }),
          slashActive && React.createElement('div', { className: 'dyn-vditor-menu' },
            slashCandidates.length === 0
              ? React.createElement('div', { className: 'dyn-vditor-menu-empty' }, '没有匹配的命令')
              : slashCandidates.map((c) => React.createElement('button', {
                type: 'button',
                key: c.name,
                className: 'dyn-vditor-menu-item',
                onClick: () => pickRealtimeSlash(c),
              },
                React.createElement('span', { style: { flex: 'none', fontFamily: 'var(--ds-font-family-code, monospace)' } }, '/' + c.name),
                React.createElement('span', { className: 'dyn-vditor-menu-desc' }, c.desc + (c.arg ? ' · ' + c.arg : '')),
              )),
          ),
          atActive && React.createElement('div', { className: 'dyn-vditor-menu' },
            !cwd
              ? React.createElement('div', { className: 'dyn-vditor-menu-empty' }, '未找到工作区路径')
              : atLoading
                ? React.createElement('div', { className: 'dyn-vditor-menu-empty' }, '正在搜索工作区文件…')
                : atItems.length === 0
                  ? React.createElement('div', { className: 'dyn-vditor-menu-empty' }, '未找到匹配文件')
                  : atItems.map((item, i) => React.createElement('button', {
                    type: 'button',
                    key: item.path + '-' + i,
                    className: 'dyn-vditor-menu-item',
                    onClick: () => pickAtItem(item),
                  },
                    React.createElement('span', { className: 'dyn-vditor-trigger-icon' }, iconPath(item.kind === 'dir' ? P.folderGlyph : P.fileGlyph, 14, 16)),
                    React.createElement('span', { className: 'dyn-vditor-menu-main' },
                      item.name,
                      React.createElement('span', { className: 'dyn-vditor-menu-desc' }, item.relative || item.path),
                    ),
                  )),
          ),
          React.createElement('div', { className: 'dyn-vditor-toolbar-row' },
            React.createElement('div', { className: 'dyn-vditor-tools' },
              React.createElement('div', { className: 'dyn-vditor-drop' },
                React.createElement('button', {
                  type: 'button',
                  className: 'dyn-vditor-trigger dyn-vditor-cmd-btn',
                  title: '命令目录',
                  'aria-label': '命令目录',
                  disabled: disabled,
                  onClick: () => { setCmdOpen(!cmdOpen); setPermOpen(false); setModelOpen(false); setMeterOpen(false) },
                },
                  iconPath(P.plus, 16),
                ),
                cmdOpen && React.createElement('div', { className: 'dyn-vditor-menu' },
                  COMMANDS.map((c) => React.createElement('button', {
                    type: 'button',
                    key: c.name,
                    className: 'dyn-vditor-menu-item',
                    onClick: () => onPickCommand(c),
                  },
                    React.createElement('span', { style: { flex: 'none', fontFamily: 'var(--ds-font-family-code, monospace)' } }, '/' + c.name),
                    React.createElement('span', { className: 'dyn-vditor-menu-desc', title: c.desc + (c.arg ? ' · ' + c.arg : '') }, c.desc + (c.arg ? ' · ' + c.arg : '')),
                  )),
                ),
              ),
              permissions && React.createElement('div', { className: 'dyn-vditor-drop' },
                React.createElement('button', {
                  type: 'button',
                  className: 'dyn-vditor-trigger dyn-vditor-perm-btn',
                  title: '切换审批 / 访问模式',
                  disabled: disabled || permBusy || permOptions.length === 0,
                  onClick: () => { setPermOpen(!permOpen); setCmdOpen(false); setModelOpen(false); setMeterOpen(false) },
                },
                  React.createElement('span', { className: 'dyn-vditor-trigger-icon' }, iconShieldStroke(14)),
                  React.createElement('span', { className: 'dyn-vditor-btn-label' }, permLabel),
                  React.createElement('span', { className: 'dyn-vditor-chevron' + (permOpen ? ' open' : '') }, iconPath(P.chevron, 14)),
                ),
                permOpen && React.createElement('div', { className: 'dyn-vditor-menu' },
                  permOptions.map((o) => React.createElement('button', {
                    type: 'button',
                    key: o.value,
                    className: 'dyn-vditor-menu-item' + (o.value === permCurrent ? ' active' : ''),
                    onClick: () => choosePerm(o.value),
                  },
                    React.createElement('span', { className: 'dyn-vditor-trigger-icon' }, permGlyph(o.value, 16)),
                    React.createElement('span', { className: 'dyn-vditor-menu-main' },
                      optionLabel(o),
                      o.description && React.createElement('span', { className: 'dyn-vditor-menu-desc' }, o.description),
                    ),
                    o.value === permCurrent && React.createElement('span', { className: 'dyn-vditor-menu-check' }, iconCheckLine(14)),
                  )),
                ),
              ),
              React.createElement('button', {
                type: 'button',
                className: 'dyn-vditor-trigger dyn-vditor-attach-btn',
                title: '选择文件引用（不拷贝文件，发送时附上路径）',
                disabled: disabled,
                onClick: () => pickFiles(),
              },
                React.createElement('span', { className: 'dyn-vditor-trigger-icon' }, iconPath(P.paperclip, 14, 16)),
                React.createElement('span', { className: 'dyn-vditor-btn-label' }, '附件'),
              ),
              (status === 'loading' || status === 'error' || fileTip !== null) && React.createElement('span', {
                className: fileTip ? 'dyn-vditor-file-tip' : 'dyn-vditor-hint',
              },
                fileTip !== null ? fileTip
                  : status === 'loading' ? '正在加载 Vditor…'
                  : 'Vditor 加载失败：请检查网络；可停用插件恢复原输入框'),
            ),
            React.createElement('div', { className: 'dyn-vditor-trailing' },
              usagePercent !== null && React.createElement('div', { className: 'dyn-vditor-drop' },
                React.createElement('button', {
                  type: 'button',
                  className: 'dyn-vditor-meter',
                  title: '上下文已用 ' + usagePercent + '%',
                  'aria-label': '上下文已用 ' + usagePercent + '%',
                  onClick: () => { setMeterOpen(!meterOpen); setPermOpen(false); setCmdOpen(false); setModelOpen(false) },
                },
                  React.createElement('svg', { viewBox: '0 0 14 14', width: 14, height: 14, 'aria-hidden': true },
                    React.createElement('circle', { className: 'dyn-vditor-meter-track', cx: 7, cy: 7, r: 5.5 }),
                    React.createElement('circle', {
                      className: 'dyn-vditor-meter-fill',
                      cx: 7,
                      cy: 7,
                      r: 5.5,
                      strokeDasharray: (RING_C * usagePercent / 100) + ' ' + RING_C,
                      transform: 'rotate(-90 7 7)',
                    }),
                  ),
                ),
                meterOpen && React.createElement('div', { className: 'dyn-vditor-meter-panel' },
                  React.createElement('div', { className: 'dyn-vditor-meter-head' },
                    React.createElement('span', null, '上下文用量'),
                    React.createElement('span', { className: 'dyn-vditor-meter-percent' }, usagePercent + '%'),
                  ),
                  React.createElement('dl', { className: 'dyn-vditor-meter-rows' },
                    meterRows.map((row) => React.createElement('div', { className: 'dyn-vditor-meter-row', key: row.key },
                      React.createElement('span', { className: 'dyn-vditor-meter-swatch ' + row.cls }),
                      React.createElement('dt', null, row.label),
                      React.createElement('dd', null, row.value + ' tok'),
                    )),
                  ),
                ),
              ),
              modelDirectories && React.createElement('div', { className: 'dyn-vditor-drop' },
                React.createElement('button', {
                  type: 'button',
                  className: 'dyn-vditor-trigger dyn-vditor-model-btn',
                  title: '切换模型',
                  disabled: disabled || modelBusy || groups.length === 0,
                  onClick: () => { setModelOpen(!modelOpen); setModelView(null); setCmdOpen(false); setPermOpen(false); setMeterOpen(false) },
                },
                  React.createElement('span', { className: 'dyn-vditor-btn-label' }, modelStatus === 'loading' ? '加载模型…' : modelLabel),
                  effortLabel && React.createElement('span', { className: 'dyn-vditor-effort' }, effortLabel),
                  React.createElement('span', { className: 'dyn-vditor-chevron' + (modelOpen ? ' open' : '') }, iconPath(P.chevron, 14)),
                ),
                modelOpen && React.createElement('div', { className: 'dyn-vditor-menu right' },
                  modelStatus === 'error' && modelState && modelState.error
                    ? React.createElement('div', { className: 'dyn-vditor-menu-desc', style: { padding: '6px 10px' } }, '加载失败：' + modelState.error)
                    : modelView === 'models'
                      ? React.createElement('div', {},
                        React.createElement('button', { type: 'button', className: 'dyn-vditor-menu-back', onClick: () => setModelView(null) },
                          iconPath(P.chevronRight, 14),
                          '返回'),
                        groups.map((g) => React.createElement('div', { key: g.id },
                          React.createElement('div', { className: 'dyn-vditor-menu-group' }, g.name),
                          g.models.map((m) => React.createElement('button', {
                            type: 'button',
                            key: g.id + '/' + m.id,
                            className: 'dyn-vditor-menu-item' + (current && current.provider === g.id && current.model === m.id ? ' active' : ''),
                            onClick: () => chooseModel(g, m, null),
                          },
                            React.createElement('span', { className: 'dyn-vditor-menu-main' },
                              m.name,
                              m.description && React.createElement('span', { className: 'dyn-vditor-menu-desc' }, m.description),
                            ),
                            current && current.provider === g.id && current.model === m.id
                              && React.createElement('span', { className: 'dyn-vditor-menu-check' }, iconCheckLine(14)),
                          )),
                        )),
                      )
                      : modelView === 'efforts'
                        ? React.createElement('div', {},
                          React.createElement('button', { type: 'button', className: 'dyn-vditor-menu-back', onClick: () => setModelView(null) },
                            iconPath(P.chevronRight, 14),
                            '返回 · ' + modelLabel),
                          currentEfforts.length === 0
                            ? React.createElement('div', { className: 'dyn-vditor-menu-desc', style: { padding: '6px 10px' } }, '当前模型无可用推理等级')
                            : currentEfforts.map((e) => React.createElement('button', {
                              type: 'button',
                              key: e.id,
                              className: 'dyn-vditor-menu-item' + (current && current.reasoningEffort === e.id ? ' active' : ''),
                              onClick: () => chooseModel(currentGroup, currentModel, e),
                            },
                              React.createElement('span', { className: 'dyn-vditor-menu-main' },
                                e.name,
                                e.description && React.createElement('span', { className: 'dyn-vditor-menu-desc' }, e.description),
                              ),
                              current && current.reasoningEffort === e.id
                                && React.createElement('span', { className: 'dyn-vditor-menu-check' }, iconCheckLine(14)),
                            )),
                        )
                        : React.createElement('div', {},
                          React.createElement('button', {
                            type: 'button',
                            className: 'dyn-vditor-menu-item',
                            onClick: () => setModelView('models'),
                          },
                            React.createElement('span', { className: 'dyn-vditor-menu-main' }, '模型选择'),
                            React.createElement('span', { className: 'dyn-vditor-menu-value' }, modelLabel),
                            React.createElement('span', { className: 'dyn-vditor-chevron' }, iconPath(P.chevronRight, 14)),
                          ),
                          React.createElement('button', {
                            type: 'button',
                            className: 'dyn-vditor-menu-item',
                            onClick: () => setModelView('efforts'),
                          },
                            React.createElement('span', { className: 'dyn-vditor-menu-main' }, '推理等级'),
                            React.createElement('span', { className: 'dyn-vditor-menu-value' }, effortLabel || '—'),
                            React.createElement('span', { className: 'dyn-vditor-chevron' }, iconPath(P.chevronRight, 14)),
                          ),
                        ),
                ),
              ),
              running && !sending
                ? React.createElement('button', {
                  type: 'button',
                  className: 'dyn-vditor-send',
                  title: '停止当前回合',
                  'aria-label': '停止',
                  onClick: stopTurn,
                },
                  iconStop(16))
                : React.createElement('button', {
                  type: 'button',
                  className: 'dyn-vditor-send',
                  title: '发送（Ctrl+Enter）',
                  'aria-label': '发送',
                  disabled: (empty && attachments.length === 0) || sending || status !== 'ready' || removed || noActions,
                  onClick: () => submitWithAttachments(),
                },
                  iconPath(P.send, 16)),
            ),
          ),
          rightItems,
        ),
        footer,
      )
    }

    slots.register({
      name: 'conversation.composer.bar',
      priority: -10,
    }, VditorComposer)

    slots.register({
      name: 'conversation.chat.node',
      key: 'user',
      priority: -10,
    }, UserMarkdownNodeView)

    slots.register({
      name: 'conversation.chat.node',
      key: 'steering',
      priority: -10,
    }, UserMarkdownNodeView)
  }

  n.apply = apply
  n.inject = ['timer', 'slots']
  return t.exports
} });
