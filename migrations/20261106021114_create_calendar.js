/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("calendar", function(table) {
    table.increments("eventid").primary();
    table.string("title").notNullable();
    table.bigInteger("timestamp").notNullable();
    table.string("location");
    table.text("description");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("calendar");
};