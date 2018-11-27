module.exports = {
  apps : [{
    name: 'API',
    script: 'bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '111.230.195.88',
      ref  : 'origin/master',
      repo : 'git@github.com:numbersi/numbersiMovies.git',
      path : '/var/www/html/wechat/production',
      'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
    },
    "NODE_ENV": "production"
  }
};
