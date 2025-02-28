/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
return knex.schema.createTable('transacoes', (table) => {
    table.bigIncrements('id');
    table.string('description');
    table.integer('value');
    table.date('date');
    table.string('type');
    table.bigint('categoria_id').unsigned().references('id').inTable('categorias');
    table.bigint('user_id').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTable('transacoes');
};
