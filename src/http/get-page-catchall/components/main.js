function HTML(state = {}) {
  let { title, content } = state;
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
   h1 {
     font-size: 3em;
   }
   html {
     font-size: 1.125em;
   }
   .wiki {
    //  vertical-align: middle;
   }
   .wiki:before {
    content: "[[";
  }
  .wiki:after {
    content: "]]";
  }
  .wiki:after, .wiki:before {
    transform: scale(0.75);
     opacity: .45;
     display: inline-block;
   }
  </style>
</head>
 <body>
  ${content}
 </body>
</html>
  `;
}
module.exports.HTML = HTML;