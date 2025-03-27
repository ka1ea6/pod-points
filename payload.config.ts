// storage-adapter-import-placeholder
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { buildConfig } from "payload";
import { Activities } from "./collections/Activities";
import { ActivityComments } from "./collections/ActivityComments";
import { ActivityReactions } from "./collections/ActivityReactions";
import { Notifications } from "./collections/Notifications";
import { Sprints } from "./collections/Sprints";
import { Tasks } from "./collections/Tasks";
import { Users } from "./collections/Users";
import { Pods } from "./collections/Pods";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Activities,
    ActivityComments,
    ActivityReactions,
    Notifications,
    Sprints,
    Tasks,
    Pods,
    Users,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
});
