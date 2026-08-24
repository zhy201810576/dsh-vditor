// dsh-vditor Host 半边
// 通过 webServer 注册 /plugins/vditor 前缀路由：
//   POST /save-upload   {workspace,name,base64} → 工作区 .dsh-assets 落盘（subprocess + PowerShell stdin base64）
//   POST /pick-files    {workspace}            → 系统文件选择器（PowerShell OpenFileDialog），返回绝对路径列表
//   GET  /atfile-search ?query=&workspace=     → 工作区文件递归搜索（fs 服务）
const name = "dsh-vditor";

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (raw.trim() === "") return {};
  return JSON.parse(raw);
}

function relPath(base, abs) {
  const b = String(base || "").replace(/[\\/]+$/, "");
  if (abs === b) return ".";
  const prefix = b + "\\";
  if (abs.startsWith(prefix)) return abs.slice(prefix.length);
  return abs;
}

async function writeUpload(scope, args) {
  const subprocess = scope.subprocess;
  const ws = String(args.workspace || "");
  if (!ws) return { ok: false, error: "缺少工作区路径" };
  const nm = String(args.name || "");
  if (!nm || nm.startsWith(".") || /[\\/]/.test(nm)) return { ok: false, error: "文件名非法" };
  const filePath = ws.replace(/[\\/]+$/, "") + "\\.dsh-assets\\" + nm;
  const script = "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $ErrorActionPreference='Stop'; $p = '" + filePath.replace(/'/g, "''") + "'; New-Item -ItemType Directory -Force -Path (Split-Path $p) | Out-Null; [IO.File]::WriteAllBytes($p, [Convert]::FromBase64String([Console]::In.ReadToEnd()))";
  const handle = subprocess.spawn({
    argv: ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script],
    cwd: ws,
    stdio: {
      stdin: { data: String(args.base64 || "") },
      stdout: { maxBytes: 4096 },
      stderr: { maxBytes: 8192 },
    },
    graceMs: 15000,
  });
  const outcome = await handle.done;
  if (outcome.exitCode !== 0) {
    const errReader = handle.collected.stderr;
    const errText = errReader ? errReader.readFrom(0).text : "写入失败";
    return { ok: false, error: String(errText || "写入失败").slice(0, 500) };
  }
  return { ok: true, relative: ".dsh-assets\\" + nm, name: nm, absolute: filePath };
}

async function pickFiles(scope, args) {
  const subprocess = scope.subprocess;
  const ws = String(args.workspace || "");
  const cwd = ws || "C:\\";
  const script = "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Add-Type -AssemblyName System.Windows.Forms; $d = New-Object System.Windows.Forms.OpenFileDialog; $d.Multiselect = $true; $d.Title = '选择要引用的文件'; $d.Filter = 'All files (*.*)|*.*'; if ($d.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { exit 0 }; $d.FileNames";
  const handle = subprocess.spawn({
    argv: ["powershell.exe", "-STA", "-NoProfile", "-Command", script],
    cwd,
    stdio: {
      stdin: "ignore",
      stdout: { maxBytes: 65536 },
      stderr: { maxBytes: 8192 },
    },
    graceMs: 600000,
  });
  const outcome = await handle.done;
  if (outcome.exitCode !== 0) {
    const errReader = handle.collected.stderr;
    const errText = errReader ? errReader.readFrom(0).text : "选择器失败";
    return { ok: false, files: [], error: String(errText || "选择器失败").slice(0, 500) };
  }
  const outReader = handle.collected.stdout;
  const outText = outReader ? outReader.readFrom(0).text : "";
  const files = outText.split(/\r?\n/).map((s) => s.trim()).filter((s) => s !== "");
  return { ok: true, files };
}

async function atfileSearch(scope, args) {
  const fsSvc = scope.fs;
  const ws = String(args.workspace || "");
  if (!ws) return { ok: false, items: [] };
  const q = String(args.query || "").toLowerCase();
  let rootAbs;
  try {
    rootAbs = fsSvc.processPath(await fsSvc.resolve(ws));
  } catch (err) {
    return { ok: false, items: [] };
  }
  const items = [];
  const visited = new Set();
  const walk = async (dirAbs, depth) => {
    if (items.length >= 30 || depth > 5 || visited.has(dirAbs)) return;
    visited.add(dirAbs);
    let entries;
    try {
      entries = await fsSvc.listDir(await fsSvc.resolve(dirAbs));
    } catch (err) {
      return;
    }
    for (const entry of entries) {
      if (items.length >= 30) return;
      const entryName = String(entry.name || "");
      if (!entryName || entryName === "node_modules" || entryName.startsWith(".git") || entryName.startsWith(".dsh-")) continue;
      const isDir = entry.type === "directory";
      if (isDir) {
        if (q === "" || entryName.toLowerCase().includes(q)) {
          items.push({ path: dirAbs + "\\" + entryName, relative: relPath(rootAbs, dirAbs + "\\" + entryName).replace(/\\/g, "/"), name: entryName, kind: "dir" });
        }
        let childAbs = dirAbs + "\\" + entryName;
        try { childAbs = fsSvc.processPath(entry.target); } catch (err) {}
        await walk(childAbs, depth + 1);
      } else if (q === "" || entryName.toLowerCase().includes(q)) {
        items.push({ path: dirAbs + "\\" + entryName, relative: relPath(rootAbs, dirAbs + "\\" + entryName).replace(/\\/g, "/"), name: entryName, kind: "file" });
      }
    }
  };
  try {
    await walk(rootAbs, 0);
  } catch (err) {}
  return { ok: true, items };
}

const PREFIX = "/plugins/vditor";

function apply(ctx) {
  ctx.inject(["webServer", "subprocess", "fs"], (scope) => {
    scope.effect(() => {
      const dispose = scope.webServer.register({
        kind: "prefix",
        path: PREFIX,
        handler: async (req, res) => {
          const writeJson = (status, body) => {
            res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
            res.end(JSON.stringify(body));
          };
          try {
            const url = new URL(req.url ?? "/", "http://dsh.internal");
            const segments = url.pathname.slice(PREFIX.length).split("/").filter(Boolean);
            const seg = segments.length > 0 ? segments[0] : "";
            if (req.method === "POST" && seg === "save-upload") {
              try {
                const body = await readJson(req);
                writeJson(200, await writeUpload(scope, body));
              } catch (error) {
                writeJson(200, { ok: false, error: error instanceof Error ? error.message : String(error) });
              }
              return;
            }
            if (req.method === "POST" && seg === "pick-files") {
              try {
                const body = await readJson(req);
                writeJson(200, await pickFiles(scope, body));
              } catch (error) {
                writeJson(200, { ok: false, files: [], error: error instanceof Error ? error.message : String(error) });
              }
              return;
            }
            if (req.method === "GET" && seg === "atfile-search") {
              try {
                const body = {
                  query: url.searchParams.get("query") || "",
                  workspace: url.searchParams.get("workspace") || "",
                };
                writeJson(200, await atfileSearch(scope, body));
              } catch (error) {
                writeJson(200, { ok: false, items: [], error: error instanceof Error ? error.message : String(error) });
              }
              return;
            }
            writeJson(404, { ok: false, error: "not found" });
          } catch (error) {
            writeJson(500, { ok: false, error: error instanceof Error ? error.message : String(error) });
          }
        },
      });
      return () => dispose();
    });
  });
}

export { apply, name };
