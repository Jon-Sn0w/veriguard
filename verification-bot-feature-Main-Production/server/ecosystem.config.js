module.exports = {
 apps: [{
   name: 'veriguard-server',
   script: '/home/jlandry/server/server.js',
   watch: false,
   max_memory_restart: '200M',
   exp_backoff_restart_delay: 100,
   max_restarts: 5,
   min_uptime: '30s',
   kill_timeout: 5000,
   wait_ready: true,
   listen_timeout: 10000,
   env: {
     NODE_ENV: 'production',
     NODE_OPTIONS: '--max-old-space-size=150'
   },
   error_file: '/home/jlandry/server/logs/server-error.log',
   out_file: '/home/jlandry/server/logs/server-out.log',
   merge_logs: true,
   log_date_format: 'YYYY-MM-DD HH:mm Z'
 },
 {
   name: 'veriguard-scheduler',
   script: '/home/jlandry/server/scheduler.js',
   autorestart: true,
   max_memory_restart: '100M',
   exp_backoff_restart_delay: 100,
   max_restarts: 5,
   min_uptime: '30s',
   merge_logs: true,
   out_file: '/home/jlandry/server/logs/scheduler.log',
   error_file: '/home/jlandry/server/logs/scheduler-error.log',
   env: {
     NODE_ENV: 'production',
     NODE_OPTIONS: '--max-old-space-size=75'
   }
 },
 {
   name: 'bot-server',
   script: '/home/jlandry/primeUpdated.js',
   autorestart: true,
   max_memory_restart: '150M',
   exp_backoff_restart_delay: 100,
   max_restarts: 5,
   min_uptime: '30s',
   merge_logs: true,
   out_file: '/home/jlandry/server/logs/bot.log',
   error_file: '/home/jlandry/server/logs/bot-error.log',
   env: {
     NODE_ENV: 'production',
     NODE_OPTIONS: '--max-old-space-size=100'
   }
 }]
};
