ClubLog v1.0.0 開発中  
部活動の欠席連絡、カレンダー、アンケート、お知らせができます

実行するときは、

npm install

をしてから、

npx knex migrate:latest

windowsであれば

node_modules\.bin\knex.cmd migrate:latest --knexfile knexfile.js

をしてから

node main.js

をするとlocalhost:1234でサーバーが立ち上がります

セッション用の秘密鍵は.envにSESSION_SECRETとして設定してください  
鍵は以下のコマンドで生成します

node -p "require('crypto').randomBytes(32).toString('hex')"