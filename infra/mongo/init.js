// Runs once on first startup — creates collections and indexes
db = db.getSiblingDB('portfolio');

db.createCollection('users');
db.createCollection('projects');
db.createCollection('blogposts');
db.createCollection('discussions');
db.createCollection('replies');
db.createCollection('supportrequests');

// Indexes for performance
db.users.createIndex({ clerkId: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 });

db.projects.createIndex({ status: 1, createdAt: -1 });
db.projects.createIndex({ tags: 1 });
db.projects.createIndex({ author: 1 });
db.projects.createIndex({ '$**': 'text' }); // full-text search

db.blogposts.createIndex({ slug: 1 }, { unique: true });
db.blogposts.createIndex({ status: 1, createdAt: -1 });
db.blogposts.createIndex({ tags: 1 });

db.discussions.createIndex({ status: 1, createdAt: -1 });
db.discussions.createIndex({ projectId: 1 });
db.discussions.createIndex({ author: 1 });

print('Portfolio DB initialized.');
