import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`InnoPulse 360 API running on port ${env.PORT}`);
});
