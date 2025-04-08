const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class ScriptScheduler {
    constructor() {
        this.activeProcesses = new Map();
        this.SCRIPTS_DIR = path.join(__dirname, 'public/js'); // Keeping original directory
        this.SCRIPT_TIMEOUT = 30 * 60 * 1000; // 30 minute timeout
    }

    async validateScript(scriptPath) {
        try {
            await fs.access(scriptPath);
            return true;
        } catch {
            console.error(`Script not found: ${scriptPath}`);
            return false;
        }
    }

    async runScript(scriptPath, scriptName) {
        if (!(await this.validateScript(scriptPath))) {
            return;
        }

        // Cleanup any existing process
        if (this.activeProcesses.has(scriptName)) {
            this.killProcess(scriptName);
        }

        console.log(`Starting ${scriptName}...`);
        const process = spawn('node', [scriptPath], {
            timeout: this.SCRIPT_TIMEOUT,
            stdio: 'pipe'
        });

        this.activeProcesses.set(scriptName, process);

        process.stdout.on('data', (data) => {
            console.log(`${scriptName} output: ${data}`);
        });

        process.stderr.on('data', (data) => {
            console.error(`${scriptName} error: ${data}`);
        });

        process.on('close', (code) => {
            console.log(`${scriptName} completed with code ${code}`);
            this.activeProcesses.delete(scriptName);
        });

        process.on('error', (err) => {
            console.error(`Failed to start ${scriptName}:`, err);
            this.activeProcesses.delete(scriptName);
        });

        // Handle script timeout
        setTimeout(() => {
            if (this.activeProcesses.has(scriptName)) {
                console.error(`${scriptName} timed out after ${this.SCRIPT_TIMEOUT}ms`);
                this.killProcess(scriptName);
            }
        }, this.SCRIPT_TIMEOUT);
    }

    killProcess(scriptName) {
        const process = this.activeProcesses.get(scriptName);
        if (process) {
            process.kill('SIGTERM');
            this.activeProcesses.delete(scriptName);
        }
    }

    scheduleRewards() {
        const rewardsPath = path.join(this.SCRIPTS_DIR, 'rewards.js');
        this.runScript(rewardsPath, 'Rewards Script');
        setInterval(() => {
            this.runScript(rewardsPath, 'Rewards Script');
        }, 4 * 60 * 60 * 1000);
    }

    scheduleAgent() {
        const agentPath = path.join(this.SCRIPTS_DIR, 'agent-data.js');
        this.runScript(agentPath, 'Agent Script');
        setInterval(() => {
            this.runScript(agentPath, 'Agent Script');
        }, 60 * 1000);
    }

    start() {
        this.scheduleRewards();
        this.scheduleAgent();
        console.log('Scheduler started');

        // Graceful shutdown handler
        process.on('SIGTERM', () => this.shutdown());
        process.on('SIGINT', () => this.shutdown());
    }

    shutdown() {
        console.log('Shutting down scheduler...');
        for (const [scriptName] of this.activeProcesses) {
            this.killProcess(scriptName);
        }
        process.exit(0);
    }
}

const scheduler = new ScriptScheduler();
scheduler.start();
