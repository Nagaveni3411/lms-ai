exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable("subjects");
  if (!exists) {
    await knex.schema.createTable("subjects", (table) => {
      table.bigIncrements("id").primary();
      table.string("title", 255).notNullable();
      table.string("slug", 255).notNullable().unique().index();
      table.text("description");
      table.boolean("is_published").notNullable().defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("subjects");
};
