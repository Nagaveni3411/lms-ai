const db = require("../config/db");

const catalog = [
  {
    title: "React Basics",
    slug: "react-basics",
    description: "Learn components, props, state, and hooks.",
    sections: [
      {
        title: "Foundations",
        videos: [
          {
            title: "React in 100 Seconds",
            description: "Quick React overview.",
            youtube_url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
            duration_seconds: 120
          },
          {
            title: "Components and JSX",
            description: "Create and compose components.",
            youtube_url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
            duration_seconds: 3600
          }
        ]
      },
      {
        title: "State and Effects",
        videos: [
          {
            title: "useState Hook",
            description: "Manage local component state.",
            youtube_url: "https://www.youtube.com/watch?v=O6P86uwfdR0",
            duration_seconds: 900
          },
          {
            title: "useEffect Hook",
            description: "Run side effects safely.",
            youtube_url: "https://www.youtube.com/watch?v=0ZJgIjIuY7U",
            duration_seconds: 1000
          }
        ]
      }
    ]
  },
  {
    title: "Node.js and Express",
    slug: "nodejs-express",
    description: "Build APIs with Node, Express, and middleware.",
    sections: [
      {
        title: "Backend Basics",
        videos: [
          {
            title: "Node.js Crash Course",
            description: "Node runtime and modules.",
            youtube_url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
            duration_seconds: 2500
          },
          {
            title: "Express Crash Course",
            description: "Routing and controllers with Express.",
            youtube_url: "https://www.youtube.com/watch?v=L72fhGm1tfE",
            duration_seconds: 2900
          }
        ]
      },
      {
        title: "API Design",
        videos: [
          {
            title: "REST API Concepts",
            description: "Endpoints, methods, and status codes.",
            youtube_url: "https://www.youtube.com/watch?v=Q-BpqyOT3a8",
            duration_seconds: 1400
          },
          {
            title: "Express Error Handling",
            description: "Robust error middleware patterns.",
            youtube_url: "https://www.youtube.com/watch?v=DyqVqaf1KnA",
            duration_seconds: 700
          }
        ]
      }
    ]
  },
  {
    title: "MySQL for Developers",
    slug: "mysql-for-developers",
    description: "SQL essentials, joins, indexing, and schema design.",
    sections: [
      {
        title: "SQL Essentials",
        videos: [
          {
            title: "SQL Tutorial for Beginners",
            description: "Core SQL syntax and queries.",
            youtube_url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
            duration_seconds: 1800
          },
          {
            title: "Joins Explained",
            description: "Inner, left, right joins.",
            youtube_url: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
            duration_seconds: 600
          }
        ]
      },
      {
        title: "Performance",
        videos: [
          {
            title: "Indexes in SQL",
            description: "How indexing speeds up queries.",
            youtube_url: "https://www.youtube.com/watch?v=0jZwQvHj9iE",
            duration_seconds: 700
          },
          {
            title: "Database Normalization",
            description: "Reduce duplication with normal forms.",
            youtube_url: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
            duration_seconds: 900
          }
        ]
      }
    ]
  },
  {
    title: "Git and GitHub Essentials",
    slug: "git-github-essentials",
    description: "Version control workflow for real projects.",
    sections: [
      {
        title: "Git Basics",
        videos: [
          {
            title: "Git and GitHub for Beginners",
            description: "Commits, branches, and remotes.",
            youtube_url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
            duration_seconds: 4200
          },
          {
            title: "Branching Strategy",
            description: "Feature branches and pull requests.",
            youtube_url: "https://www.youtube.com/watch?v=e2IbNHi4uCI",
            duration_seconds: 1200
          }
        ]
      },
      {
        title: "Collaboration",
        videos: [
          {
            title: "Resolving Merge Conflicts",
            description: "Handle conflicts cleanly.",
            youtube_url: "https://www.youtube.com/watch?v=JtIX3HJKwfo",
            duration_seconds: 700
          },
          {
            title: "GitHub Pull Requests",
            description: "Review and merge workflow.",
            youtube_url: "https://www.youtube.com/watch?v=8lGpZkjnkt4",
            duration_seconds: 800
          }
        ]
      }
    ]
  }
];

async function upsertCourse(trx, course) {
  let subject = await trx("subjects").where({ slug: course.slug }).first();
  if (!subject) {
    const [id] = await trx("subjects").insert({
      title: course.title,
      slug: course.slug,
      description: course.description,
      is_published: true
    });
    subject = { id };
  } else {
    await trx("subjects").where({ id: subject.id }).update({
      title: course.title,
      description: course.description,
      is_published: true,
      updated_at: new Date()
    });
  }

  const oldSections = await trx("sections").where({ subject_id: subject.id });
  if (oldSections.length) {
    await trx("sections").where({ subject_id: subject.id }).del();
  }

  for (let si = 0; si < course.sections.length; si += 1) {
    const section = course.sections[si];
    const [sectionId] = await trx("sections").insert({
      subject_id: subject.id,
      title: section.title,
      order_index: si + 1
    });

    for (let vi = 0; vi < section.videos.length; vi += 1) {
      const video = section.videos[vi];
      await trx("videos").insert({
        section_id: sectionId,
        title: video.title,
        description: video.description,
        youtube_url: video.youtube_url,
        order_index: vi + 1,
        duration_seconds: video.duration_seconds
      });
    }
  }
}

async function run() {
  const trx = await db.transaction();
  try {
    for (const course of catalog) {
      await upsertCourse(trx, course);
    }
    await trx.commit();
    console.log(`Added/updated ${catalog.length} courses.`);
  } catch (error) {
    await trx.rollback();
    console.error("Seeding more courses failed:", error.message);
    process.exitCode = 1;
  } finally {
    await db.destroy();
  }
}

run();
