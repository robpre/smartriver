import { createHash } from "crypto";
import { BRANCH_NAME, NODE_ENV, SLUG_BRANCH_NAME } from "../config";

const sha256 = (s: string) => {
  const h = createHash("sha256");

  h.update(s);

  return h.digest().toString("base64");
};

const projectName = "smartriver";
const prefix = "git";
const scope = "robpre";

export const stageSlug = () => {
  // https://vercel.com/docs/concepts/deployments/generated-urls#url-with-git-branch
  // <project-name>-git-<branch-name>-<scope-slug>.vercel.app
  let slug = [projectName, prefix, SLUG_BRANCH_NAME, scope].join("-");

  // https://vercel.com/docs/concepts/deployments/generated-urls#truncation
  if (slug.length > 63) {
    // example truncated url
    // my-project-git-this-is-really-an-extremely-long-bra-ar63fm-acme.vercel.app
    const hash = sha256(prefix + BRANCH_NAME + projectName).slice(0, 6);
    const hlen = hash.length + 1;
    // make subdomain + the hash and the hash sep "-" less than 64
    const longByLength = slug.length + hlen - 63;

    slug = [
      projectName,
      prefix,
      SLUG_BRANCH_NAME.slice(0, -longByLength),
      hash,
      scope,
    ].join("-");
  }

  return slug;
};

export const getBuildURL = () => {
  if (NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  if (!BRANCH_NAME || BRANCH_NAME === "main") {
    return "https://smartriver.robpm.co.uk";
  }

  const subdomain = stageSlug();

  return `https://${subdomain}.vercel.app`;
};
