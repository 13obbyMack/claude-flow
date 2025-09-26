# Claude Code Hooks for claude-flow

## Purpose
Automatically coordinate, format, and learn from Claude Code operations using hooks with MCP tool integration.

## Available Hooks

### Pre-Operation Hooks
- **pre-edit**: Validate and assign agents before file modifications
- **pre-bash**: Check command safety and resource requirements  
- **pre-task**: Auto-spawn agents for complex tasks

### Post-Operation Hooks
- **post-edit**: Auto-format code, train neural patterns, update memory
- **post-bash**: Log execution and update metrics
- **post-search**: Cache results and improve search patterns

### MCP Integration Hooks
- **mcp-initialized**: Persist swarm configuration
- **agent-spawned**: Update agent roster and memory
- **task-orchestrated**: Monitor task progress through memory
- **neural-trained**: Save pattern improvements

### Memory Coordination Hooks
- **memory-write**: Triggered when agents write to coordination memory
- **memory-read**: Triggered when agents read from coordination memory
- **memory-sync**: Synchronize memory across swarm agents

### Session Hooks
- **notify**: Custom notifications with swarm status
- **session-end**: Generate summary and save state
- **session-restore**: Load previous session state

## Configuration
Hooks are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "^(Write|Edit|MultiEdit)$",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow hook pre-edit --file '${tool.params.file_path}'"
        }]
      }
    ]
  }
}
```

## Benefits
- 🤖 Automatic agent assignment based on file type
- 🎨 Consistent code formatting
- 🧠 Continuous neural pattern improvement
- 💾 Cross-session memory persistence
- 📊 Performance metrics tracking

## See Also
- [Pre-Edit Hook](./pre-edit.md)
- [Post-Edit Hook](./post-edit.md)
- [Session End Hook](./session-end.md)