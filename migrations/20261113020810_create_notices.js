/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("notices", function(table) {
    table.increments("noticeid").primary();
    table.integer("groupid").notNullable();
    table.string("title").notNullable();
    table.text("content");
    table.bigInteger("created_at").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("notices");
};
