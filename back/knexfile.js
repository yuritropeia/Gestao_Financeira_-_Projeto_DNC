// Update with your config settings.
import knexConfig from "./src/config/database.js"
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: knexConfig,
  };
