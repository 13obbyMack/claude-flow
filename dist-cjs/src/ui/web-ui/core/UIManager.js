import { EventBus } from './EventBus.js';
import { MCPIntegrationLayer } from './MCPIntegrationLayer.js';
import { ViewManager } from './ViewManager.js';
import { StateManager } from './StateManager.js';
import { ComponentLibrary } from '../components/ComponentLibrary.js';
export const VIEW_CATEGORIES = {
    OVERVIEW: 'overview',
    PROCESSES: 'processes',
    NEURAL: 'neural',
    MEMORY: 'memory',
    MONITORING: 'monitoring',
    WORKFLOW: 'workflow',
    GITHUB: 'github',
    DAA: 'daa',
    SYSTEM: 'system',
    CLI: 'cli',
    HELP: 'help'
};
export const MCP_TOOL_CATEGORIES = {
    NEURAL: [
        'neural_train',
        'neural_predict',
        'neural_status',
        'neural_patterns',
        'model_load',
        'model_save',
        'pattern_recognize',
        'cognitive_analyze',
        'learning_adapt',
        'neural_compress',
        'ensemble_create',
        'transfer_learn',
        'neural_explain',
        'wasm_optimize',
        'inference_run'
    ],
    MEMORY: [
        'memory_usage',
        'memory_backup',
        'memory_restore',
        'memory_compress',
        'memory_sync',
        'cache_manage',
        'state_snapshot',
        'context_restore',
        'memory_analytics',
        'memory_persist',
        'memory_namespace'
    ],
    MONITORING: [
        'performance_report',
        'bottleneck_analyze',
        'token_usage',
        'benchmark_run',
        'metrics_collect',
        'trend_analysis',
        'cost_analysis',
        'quality_assess',
        'error_analysis',
        'usage_stats',
        'health_check',
        'swarm_monitor',
        'agent_metrics'
    ],
    WORKFLOW: [
        'workflow_create',
        'workflow_execute',
        'automation_setup',
        'pipeline_create',
        'scheduler_manage',
        'trigger_setup',
        'workflow_template',
        'batch_process',
        'parallel_execute',
        'sparc_mode',
        'task_orchestrate'
    ],
    GITHUB: [
        'github_repo_analyze',
        'github_pr_manage',
        'github_issue_track',
        'github_release_coord',
        'github_workflow_auto',
        'github_code_review',
        'github_sync_coord',
        'github_metrics'
    ],
    DAA: [
        'daa_agent_create',
        'daa_capability_match',
        'daa_resource_alloc',
        'daa_lifecycle_manage',
        'daa_communication',
        'daa_consensus',
        'daa_fault_tolerance',
        'daa_optimization'
    ],
    SYSTEM: [
        'security_scan',
        'backup_create',
        'restore_system',
        'log_analysis',
        'diagnostic_run',
        'config_manage',
        'features_detect',
        'terminal_execute'
    ]
};
export class UIManager {
    constructor(){
        this.eventBus = new EventBus();
        this.mcpIntegration = new MCPIntegrationLayer(this.eventBus);
        this.viewManager = new ViewManager(this.eventBus);
        this.stateManager = new StateManager(this.eventBus);
        this.componentLibrary = new ComponentLibrary();
        this.currentView = VIEW_CATEGORIES.OVERVIEW;
        this.viewHistory = [];
        this.shortcuts = new Map();
        this.theme = 'dark';
        this.isResponsive = true;
        this.initializeEventHandlers();
        this.setupKeyboardShortcuts();
    }
    async initialize() {
        try {
            await this.stateManager.initialize();
            await this.mcpIntegration.initialize();
            await this.viewManager.initialize();
            await this.loadUserPreferences();
            await this.registerAllViews();
            this.setupRealTimeUpdates();
            this.componentLibrary.initialize();
            this.eventBus.emit('ui:initialized');
            console.log('🎨 UI Manager initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize UI Manager:', error);
            throw error;
        }
    }
    async registerAllViews() {
        const viewConfigs = [
            {
                id: VIEW_CATEGORIES.OVERVIEW,
                name: 'Overview',
                icon: '🏠',
                description: 'System overview and quick actions',
                component: 'OverviewView',
                shortcut: '1'
            },
            {
                id: VIEW_CATEGORIES.PROCESSES,
                name: 'Processes',
                icon: '⚙️',
                description: 'Process management and monitoring',
                component: 'ProcessView',
                shortcut: '2'
            },
            {
                id: VIEW_CATEGORIES.NEURAL,
                name: 'Neural Network',
                icon: '🧠',
                description: 'AI model training and neural operations',
                component: 'NeuralNetworkView',
                shortcut: '3',
                toolCount: MCP_TOOL_CATEGORIES.NEURAL.length
            },
            {
                id: VIEW_CATEGORIES.MEMORY,
                name: 'Memory Bank',
                icon: '💾',
                description: 'Memory management and persistence',
                component: 'MemoryManagementView',
                shortcut: '4',
                toolCount: MCP_TOOL_CATEGORIES.MEMORY.length
            },
            {
                id: VIEW_CATEGORIES.MONITORING,
                name: 'Monitoring',
                icon: '📊',
                description: 'Performance monitoring and analysis',
                component: 'MonitoringView',
                shortcut: '5',
                toolCount: MCP_TOOL_CATEGORIES.MONITORING.length
            },
            {
                id: VIEW_CATEGORIES.WORKFLOW,
                name: 'Workflows',
                icon: '🔄',
                description: 'Automation and workflow management',
                component: 'WorkflowAutomationView',
                shortcut: '6',
                toolCount: MCP_TOOL_CATEGORIES.WORKFLOW.length
            },
            {
                id: VIEW_CATEGORIES.GITHUB,
                name: 'GitHub',
                icon: '🐙',
                description: 'GitHub integration and operations',
                component: 'GitHubIntegrationView',
                shortcut: '7',
                toolCount: MCP_TOOL_CATEGORIES.GITHUB.length
            },
            {
                id: VIEW_CATEGORIES.DAA,
                name: 'Dynamic Agents',
                icon: '🤖',
                description: 'Dynamic agent architecture',
                component: 'DAAView',
                shortcut: '8',
                toolCount: MCP_TOOL_CATEGORIES.DAA.length
            },
            {
                id: VIEW_CATEGORIES.SYSTEM,
                name: 'System',
                icon: '🛠️',
                description: 'System utilities and diagnostics',
                component: 'SystemUtilitiesView',
                shortcut: '9',
                toolCount: MCP_TOOL_CATEGORIES.SYSTEM.length
            },
            {
                id: VIEW_CATEGORIES.CLI,
                name: 'CLI Bridge',
                icon: '⌨️',
                description: 'Command-line interface bridge',
                component: 'CLICommandView',
                shortcut: '0'
            },
            {
                id: VIEW_CATEGORIES.HELP,
                name: 'Help',
                icon: '❓',
                description: 'Documentation and help',
                component: 'HelpView',
                shortcut: '?'
            }
        ];
        for (const config of viewConfigs){
            await this.viewManager.registerView(config);
        }
    }
    async navigateToView(viewId, params = {}) {
        if (!this.viewManager.hasView(viewId)) {
            throw new Error(`View not found: ${viewId}`);
        }
        if (this.currentView && this.currentView !== viewId) {
            this.viewHistory.push({
                viewId: this.currentView,
                timestamp: Date.now(),
                params: this.stateManager.getViewState(this.currentView)
            });
        }
        this.currentView = viewId;
        await this.viewManager.loadView(viewId, params);
        if (typeof window !== 'undefined' && window.history) {
            window.history.pushState({
                viewId,
                params
            }, '', `#${viewId}`);
        }
        await this.stateManager.setViewState(viewId, params);
        this.eventBus.emit('ui:navigation', {
            viewId,
            params
        });
    }
    async goBack() {
        if (this.viewHistory.length === 0) return;
        const previousView = this.viewHistory.pop();
        await this.navigateToView(previousView.viewId, previousView.params);
    }
    async executeMCPTool(toolName, params = {}) {
        try {
            this.eventBus.emit('ui:loading', {
                tool: toolName,
                params
            });
            const result = await this.mcpIntegration.executeTool(toolName, params);
            await this.handleToolResult(toolName, result, params);
            this.eventBus.emit('ui:loading:complete', {
                tool: toolName,
                result
            });
            return result;
        } catch (error) {
            this.eventBus.emit('ui:error', {
                tool: toolName,
                error,
                params
            });
            throw error;
        }
    }
    async handleToolResult(toolName, result, originalParams) {
        const category = this.getToolCategory(toolName);
        if (category) {
            this.eventBus.emit(`view:${category}:update`, {
                tool: toolName,
                result,
                params: originalParams
            });
        }
        await this.stateManager.setToolResult(toolName, result);
        this.eventBus.emit('ui:log', {
            level: 'info',
            message: `Executed ${toolName}`,
            data: {
                result,
                params: originalParams
            }
        });
    }
    getToolCategory(toolName) {
        for (const [category, tools] of Object.entries(MCP_TOOL_CATEGORIES)){
            if (tools.includes(toolName)) {
                return category.toLowerCase();
            }
        }
        return null;
    }
    setupKeyboardShortcuts() {
        Object.values(VIEW_CATEGORIES).forEach((viewId, index)=>{
            const key = (index + 1).toString();
            this.shortcuts.set(key, ()=>this.navigateToView(viewId));
        });
        this.shortcuts.set('ctrl+k', ()=>this.showCommandPalette());
        this.shortcuts.set('ctrl+/', ()=>this.navigateToView(VIEW_CATEGORIES.HELP));
        this.shortcuts.set('ctrl+1', ()=>this.navigateToView(VIEW_CATEGORIES.OVERVIEW));
        this.shortcuts.set('escape', ()=>this.hideAllOverlays());
        this.shortcuts.set('ctrl+shift+p', ()=>this.showCommandPalette());
        this.shortcuts.set('ctrl+b', ()=>this.goBack());
        this.shortcuts.set('ctrl+r', ()=>this.refreshCurrentView());
        this.shortcuts.set('ctrl+t', ()=>this.toggleTheme());
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', (event)=>{
                const key = this.getKeyString(event);
                const handler = this.shortcuts.get(key);
                if (handler) {
                    event.preventDefault();
                    handler();
                }
            });
        }
    }
    getKeyString(event) {
        const parts = [];
        if (event.ctrlKey) parts.push('ctrl');
        if (event.shiftKey) parts.push('shift');
        if (event.altKey) parts.push('alt');
        if (event.metaKey) parts.push('meta');
        if (event.key.length === 1) {
            parts.push(event.key.toLowerCase());
        } else {
            parts.push(event.key.toLowerCase());
        }
        return parts.join('+');
    }
    showCommandPalette() {
        this.eventBus.emit('ui:command-palette:show');
    }
    hideAllOverlays() {
        this.eventBus.emit('ui:overlays:hide');
    }
    async refreshCurrentView() {
        await this.viewManager.refreshView(this.currentView);
    }
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.eventBus.emit('ui:theme:changed', this.theme);
    }
    setupRealTimeUpdates() {
        setInterval(()=>{
            this.eventBus.emit('ui:real-time:update');
        }, 5000);
        this.mcpIntegration.on('tool:result', (result)=>{
            this.eventBus.emit('ui:real-time:tool-result', result);
        });
    }
    initializeEventHandlers() {
        this.eventBus.on('tool:execute', async (data)=>{
            await this.executeMCPTool(data.tool, data.params);
        });
        this.eventBus.on('view:navigate', async (data)=>{
            await this.navigateToView(data.viewId, data.params);
        });
        this.eventBus.on('state:persist', async (data)=>{
            await this.stateManager.persistState(data);
        });
        this.eventBus.on('ui:error', (error)=>{
            console.error('UI Error:', error);
        });
    }
    async loadUserPreferences() {
        const preferences = await this.stateManager.getUserPreferences();
        if (preferences) {
            this.theme = preferences.theme || 'dark';
            this.isResponsive = preferences.responsive !== false;
        }
    }
    async getSystemStatus() {
        const status = {
            uptime: await this.mcpIntegration.getSystemUptime(),
            activeTools: await this.mcpIntegration.getActiveTools(),
            memoryUsage: await this.mcpIntegration.getMemoryUsage(),
            swarmStatus: await this.mcpIntegration.getSwarmStatus(),
            toolsAvailable: Object.values(MCP_TOOL_CATEGORIES).flat().length,
            viewsRegistered: this.viewManager.getViewCount()
        };
        return status;
    }
    async shutdown() {
        await this.stateManager.persistAllState();
        await this.mcpIntegration.shutdown();
        this.eventBus.emit('ui:shutdown');
    }
}
export default UIManager;

//# sourceMappingURL=UIManager.js.map