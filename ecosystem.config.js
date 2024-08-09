module.exports = {
  apps: [
    {
      script: 'npm start',
    },
  ],

  deploy: {
    production: {
      key: 'ec2-chat-bot.pem',
      user: 'ubuntu',
      host: '54.198.105.1',
      ref: 'origin/main',
      repo: 'git@github.com/MhaamadAli/chatbot.git',
      path: '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      ssh_options: 'ForwardAgent=yes',
    },
  },
};
