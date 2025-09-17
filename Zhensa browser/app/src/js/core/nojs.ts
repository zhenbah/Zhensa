// SPDX-License-Identifier: MIT

import { ready } from "./toolkit.ts";

ready(() => {
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");
});
