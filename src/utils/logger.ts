import bunyan from "bunyan";
import bunyanPostgresStream from "bunyan-postgres-stream";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? process.env.PWD + "/.env" : process.env.PWD + "/.dev.env",
});

const pgStream = bunyanPostgresStream({
  connection: {
    host: process.env.LOGS_DB_HOST,
    user: process.env.LOGS_DB_USER,
    password: process.env.LOGS_DB_PASSWORD,
    database: process.env.LOGS_DB_NAME,
  },
  tableName: "logs",
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const color = (function (colors: any) {
  const fn = (code: number, str: string) => `\x1b[${code}m${str}\x1b[39m`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = { grey: fn.bind(null, 90) } as any;
  for (let i = 0; i < colors.length; i++) obj[colors[i]] = fn.bind(null, 30 + i);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return obj as { [K in typeof colors[any] | "grey"]: (str: string) => string };
})(["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"] as const);

// eslint-disable-next-line
function RawStream() {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
RawStream.prototype.write = function (rec: any) {
  rec = JSON.parse(rec);
  let logColor = color.cyan;
  switch (rec.level) {
    case 40:
      logColor = color.yellow;
      break;
    case 50:
      logColor = color.red;
      break;
    case 60:
      logColor = color.red;
      break;
    default:
      logColor = color.cyan;
      break;
  }
  if (rec.level === 50) {
    console.log(rec);
  }
  console.log(
    logColor(rec.time),
    bunyan.nameFromLevel[rec.level],
    typeof rec.err === "object" && Object.keys(rec?.err).length > 0 ? rec.err : rec.msg,
    typeof rec.payload === "object" && Object.keys(rec?.payload).length > 0 ? JSON.stringify(rec.payload) : "",
    rec.requestId ?? "",
    rec.customMessage ?? ""
  );
};

const logger = bunyan.createLogger({
  name: "API",
  src: true,
  // eslint-disable-next-line
  streams: [{ stream: pgStream, level: "error" }, { stream: pgStream, level: "info" }, { stream: new (RawStream as any)() }],
});

export default logger;
