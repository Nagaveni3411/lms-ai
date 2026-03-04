const db = require("../config/db");

async function run() {
  const trx = await db.transaction();
  try {
    const slug = "javascript-fundamentals";
    let subject = await trx("subjects").where({ slug }).first();

    if (!subject) {
      const [subjectId] = await trx("subjects").insert({
        title: "JavaScript Fundamentals",
        slug,
        description: "Core JS basics with a strict learning sequence.",
        is_published: true
      });
      subject = { id: subjectId };
    } else {
      await trx("subjects").where({ id: subject.id }).update({
        title: "JavaScript Fundamentals",
        description: "Core JS basics with a strict learning sequence.",
        is_published: true,
        updated_at: new Date()
      });
    }

    const existingSections = await trx("sections").where({ subject_id: subject.id });
    if (!existingSections.length) {
      const [sec1] = await trx("sections").insert({
        subject_id: subject.id,
        title: "Getting Started",
        order_index: 1
      });
      const [sec2] = await trx("sections").insert({
        subject_id: subject.id,
        title: "Control Flow",
        order_index: 2
      });

      await trx("videos").insert([
        {
          section_id: sec1,
          title: "What is JavaScript?",
          description: "Intro to JS and runtime basics.",
          youtube_url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
          order_index: 1,
          duration_seconds: 3600
        },
        {
          section_id: sec1,
          title: "Variables and Types",
          description: "Learn var, let, const and primitive types.",
          youtube_url: "https://www.youtube.com/watch?v=9M4XKi25I2M",
          order_index: 2,
          duration_seconds: 1200
        },
        {
          section_id: sec2,
          title: "If/Else Conditions",
          description: "Branching logic in JavaScript.",
          youtube_url: "https://www.youtube.com/watch?v=IsG4Xd6LlsM",
          order_index: 1,
          duration_seconds: 900
        },
        {
          section_id: sec2,
          title: "Loops",
          description: "for, while, and iteration patterns.",
          youtube_url: "https://www.youtube.com/watch?v=s9wW2PpJsmQ",
          order_index: 2,
          duration_seconds: 900
        }
      ]);
    }

    await trx.commit();
    console.log("Demo seed completed.");
  } catch (error) {
    await trx.rollback();
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await db.destroy();
  }
}

run();
