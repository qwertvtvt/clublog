/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("invites", function(table) {
    table.integer("code").primary();
    table.integer("groupid").notNullable();
    table.bigInteger("age").defaultTo(null);
    table.boolean("revoked").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("invites");
};
