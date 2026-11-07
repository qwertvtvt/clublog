/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("members", function(table) {
    table.integer("userid").notNullable();
    table.integer("groupid").notNullable();
    table.bigInteger("joined_at").notNullable();

    table.primary(["userid", "groupid"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("members");
};
