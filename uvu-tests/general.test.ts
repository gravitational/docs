import { toCopyContent } from "../utils/general";
import { suite } from "uvu";
import { JSDOM } from "jsdom";
import * as assert from "uvu/assert";

const Suite = suite("utils/general");

Suite(
  "toCopyContent with a whole snippet: correctly copies the content of a `code` block",
  () => {
    const jsdom = new JSDOM(`
<!DOCTYPE html>
<body>
<div><pre class="Code_wrapper___RON_ Pre_code__8ki72"><div class="Snippet_scroll__PG5sN"><div class="Command_command__rqeSg"><button data-testid="copy-button" class="HeadlessButton_wrapper__L3jt_ Command_button__n9Wzu"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 13" class="Icon_wrapper__8ru25 Icon_sm__0u4Da"><path fill="currentColor" d="M5.257 13 0 7.708l2.286-2.186 2.971 2.991L13.714 0 16 2.301z"></path></svg></button><span class="Command_line__6ezKE" data-content="$ ">curl https://<span class="wrapper-input Var_wrapper__8nGH6"><input class="Var_field__3MvhW" type="text" size="11" name="example.com" placeholder="example.com" value=""><span class="Var_fake-field__eAs9B">example.com</span><svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="1em" height="1em" class="Icon_wrapper__8ru25 Icon_md__bLDVV Var_icon__emAzz"><path d="M36 5.01c-1.795 0-3.59.68-4.95 2.04L8.917 29.185c-.42.42-.728.942-.89 1.515L5.058 41.088a1.5 1.5 0 0 0 1.853 1.853l10.39-2.966a1.5 1.5 0 0 0 .003-.002 3.505 3.505 0 0 0 1.511-.889L40.95 16.949c2.721-2.72 2.721-7.177 0-9.898A6.976 6.976 0 0 0 36 5.01zm0 2.982c1.02 0 2.04.394 2.826 1.18a1.5 1.5 0 0 0 .002 0 3.976 3.976 0 0 1 0 5.656l-1.94 1.94-5.656-5.657 1.94-1.94A3.987 3.987 0 0 1 36 7.993zm-6.889 5.24 5.657 5.657-18.075 18.074a.506.506 0 0 1-.216.127l-7.793 2.226 2.226-7.795a1.5 1.5 0 0 0 0-.001.49.49 0 0 1 .127-.215l18.074-18.073z"></path></svg></span>/v1/webapi/saml/acs/azure-saml</span></div></div></pre></div></body>`);

    const element = jsdom.window.document.body.querySelector("div");

    const expected = "curl https://example.com/v1/webapi/saml/acs/azure-saml";
    assert.equal(toCopyContent(element, [".Command_line__6ezKE"]), expected);
  }
);

Suite.run();
