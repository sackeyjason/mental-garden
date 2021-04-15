const { HTML } = require("./components/main.js");
const fetch = require("node-fetch");
const sanitize = require('sanitize-filename')
const md = require("markdown-it")({
  linkify: true,
}).use(
  require("markdown-it-wikilinks")({
    baseURL: "/page/",
    uriSuffix: "",
    htmlAttributes: {
      class: "wiki"
    },
    makeAllLinksAbsolute: true,
    postProcessPageName: (pageName) => {
      pageName = pageName.trim()
      pageName = pageName.split('/').map(sanitize).join('/')
      pageName = pageName.replace(/\s+/g, '-')
      return pageName
    },
  })
);

exports.handler = async function http(req) {
  // remove '' and 'page' prefix
  const path = req.rawPath.split("/").splice(2);
  let title = path.pop();
  // remove empty '' after /
  if (!title) title = path.pop();
  path.push(title);
  const source = `http://${req.headers.host}/md/${title}.md`;
  const res = await fetch(source);

  if (res.status === 200) {
    console.log("res :", res);
    const content =
      md.render(await res.text()) + `<p>& <a href="${source}">source</a>`;

    return {
      statusCode: 200,
      headers: {
        "content-type": "text/html; charset=utf8",
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      },
      body: HTML({
        title,
        content,
      }),
    };
  } else {
    return {
      statusCode: res.status,
      headers: {
        "content-type": "text/html; charset=utf8",
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      },
      body: HTML({
        title,
        content: `
        <h1>${title}</h1>
        <p>Not found :(`,
      }),
    };
  }
};
