exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable("video_progress");
  if (!exists) {
    await knex.schema.createTable("video_progress", (table) => {
      table.bigIncrements("id").primary();
      table.bigInteger("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.bigInteger("video_id").unsigned().notNullable().references("id").inTable("videos").onDelete("CASCADE");
      table.integer("last_position_seconds").notNullable().defaultTo(0);
      table.boolean("is_completed").notNullable().defaultTo(false);
      table.timestamp("completed_at").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.unique(["user_id", "video_id"]);
    });
  }
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("video_progress");
};
