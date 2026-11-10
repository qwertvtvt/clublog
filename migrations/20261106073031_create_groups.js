/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("groups", function(table) {
    table.increments("groupid").primary();
    table.string("groupname").notNullable().unique();
    table.integer("authorid").notNullable();
    table.string("description");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("groups");
};
