import { parse } from "https://deno.land/std@0.106.0/flags/mod.ts";

try {
  const parsedArgs = parse(Deno.args);
  if (!parsedArgs.q) {
    throw new Error("-q is not specified!");
  }

  const appId = Deno.env.get("ALGOLIA_APP_ID");
  if (!appId) {
    throw new Error("environment variable ALGOLIA_APP_ID is not specified!");
  }

  const targetIndex = Deno.env.get("ALGOLIA_TARGET_INDEX");
  if (!appId) {
    throw new Error("environment variable ALGOLIA_APP_ID is not specified!");
  }

  const apiKey = Deno.env.get("ALGOLIA_API_KEY");
  if (!apiKey) {
    throw new Error("environment variable ALGOLIA_API_KEY is not specified!");
  }

  const url =
    `https://${appId}-dsn.algolia.net/1/indexes/${targetIndex}?query=${parsedArgs.q}`;
  const res = await fetch(url, {
    headers: {
      "X-Algolia-API-Key": apiKey,
      "X-Algolia-Application-Id": appId,
    },
  });

  const json = await res.json();
  console.log(json);

  const outputForAlfred = json.hits.map((h: any) => {
    return {
      arg:
        `https://sortable-md-storage.web.app//board/${h.boardId}/card/${h.objectID}`,
      title: h.title,
      subtitle: h.mdStr,
    };
  });

  console.log(JSON.stringify(outputForAlfred));
} catch (e) {
  if (e instanceof Error) {
    const outputForAlfred = {
      items: [{ title: "Error", subtitle: String(e) }],
    };
    console.log(JSON.stringify(outputForAlfred));
  } else {
    const outputForAlfred = {
      items: [{ title: "Error", subtitle: "unexpected error" }],
    };
    console.log(JSON.stringify(outputForAlfred));
  }
  Deno.exit(1);
}
