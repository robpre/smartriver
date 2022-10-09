import {
  Transform,
  pipeline,
  TransformOptions,
  TransformCallback,
} from "stream";

type StripperFn = (s: string) => string;

class RemoveSecrets extends Transform {
  line = "";
  inSecretLines = false;

  startMarker: RegExp;
  stripperFn: StripperFn;
  endMarker: RegExp;

  constructor(
    startMarker: RegExp,
    stripperFn: StripperFn,
    endMarker: RegExp,
    opts?: TransformOptions
  ) {
    super({ ...opts, decodeStrings: true });

    this.startMarker = startMarker;
    this.stripperFn = stripperFn;
    this.endMarker = endMarker;
  }

  processLine(line: string) {
    if (this.inSecretLines) {
      if (line.match(this.endMarker)) {
        this.inSecretLines = false;
      } else {
        line = this.stripperFn(line);
      }
    } else if (line.match(this.startMarker)) {
      this.inSecretLines = true;
    }

    this.push(line);
  }

  _transform(
    chunk: string,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    this.line += chunk;

    const lines = this.line.split("\n");
    const lastLine = lines.pop();

    if (lastLine !== undefined) {
      this.line = lastLine;
    }

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      this.processLine(line + "\n");
    }

    callback();
  }

  _flush(callback: TransformCallback): void {
    this.processLine(this.line);
    callback();
  }
}

const removeAfterEquals = (s: string) => {
  if (!s.includes("=")) {
    return s;
  }

  const [start] = s.split("=");

  return `${start} = *******${s.endsWith("\n") ? "\n" : ""}`;
};

process.stdin
  .pipe(new RemoveSecrets(/Outputs:/, removeAfterEquals, /Stack ARN:/))
  .pipe(process.stdout);
