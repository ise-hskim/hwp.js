# Docling MCP (PDF Reader)

This repository includes a project-level MCP configuration to enable PDF reading via the Docling MCP server.

## What you get
- Convert and read PDFs (and other docs) through your IDE’s MCP client
- Structured content (text, layout, tables, images) exposed as MCP tools

## Prerequisites
- `uv` (recommended) or `pipx` installed
  - Install `uv`: https://docs.astral.sh/uv/
  - Or install `pipx`: https://pipx.pypa.io/

## Install & run Docling MCP
- With `uv` (no global install required):
  - Test run: `uvx docling-mcp --help`
- Or install globally with `pipx`:
  - `pipx install docling-mcp`
  - Run: `docling-mcp --help`

## Project MCP config
`mcp.json` at the repo root declares a Docling server entry:

```
{
  "mcpServers": {
    "docling": {
      "command": "uvx",
      "args": ["docling-mcp"],
      "env": { "TOKENIZERS_PARALLELISM": "false" }
    }
  }
}
```

Most MCP-aware IDEs/agents will auto-detect `mcp.json` in the project root and launch the server on demand. If your client does not auto-detect, see the client-specific instructions below.

## Client setup

### Claude Desktop
- Open Claude Desktop settings and add an MCP server entry pointing to this repo’s `mcp.json`, or copy the Docling block into your `claude_desktop_config.json` under `mcpServers`.
- Example manual entry if not using `mcp.json` auto-detect:
  - Command: `uvx`
  - Args: `docling-mcp`
  - Env: `TOKENIZERS_PARALLELISM=false`

### VS Code MCP extensions (e.g., Continue, MCP Inspector)
- Point the extension at the project `mcp.json` or add the server entry directly in the extension settings with the same `command/args/env`.

## Usage tips
- Ask your IDE agent to “read” or “extract text/tables” from a PDF by providing a path, e.g., `Temp/sample.pdf`.
- Large PDFs may take time; Docling will stream tool output when supported.

## Notes
- This integration is optional and separate from the TypeScript HWP/HWPX parser. It’s provided to augment workflows that also need to read PDFs.
- No repo build/test steps depend on Docling or Python; this is purely for your IDE/agent via MCP.

