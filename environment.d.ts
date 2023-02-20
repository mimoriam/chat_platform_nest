declare namespace NodeJS {
  export interface ProcessEnv {
    PG_DB_HOST?: string;
    PG_DB_NAME?: string;
    PG_DB_PORT?: string;
    PG_DB_PASSWORD?: string;
    PG_DB_USERNAME?: string;
  }
}
