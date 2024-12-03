import { registerAs } from "@nestjs/config";

export default registerAs('config',()=> ({
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD,

    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_secret_key: process.env.GITHUB_SECRET_KEY,

    
    jwt_secret: process.env.JWT_SECRET,

    database_host: process.env.DATABASE_HOST,
    database_name: process.env.DATABASE_NAME,
    database_port: parseInt(process.env.DATABASE_PORT,10),
    database_password: process.env.DATABASE_PASSWORD,
    database_username: process.env.DATABASE_USERNAME,
    cors_origin: process.env.CORS_ORIGIN,

  })
);
  