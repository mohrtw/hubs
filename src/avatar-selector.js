import ReactDOM from "react-dom";
import React from "react";
import queryString from "query-string";
import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";

import { lang, messages } from "./utils/i18n";

import { patchWebGLRenderingContext } from "./utils/webgl";
patchWebGLRenderingContext();

import "./assets/stylesheets/avatar-selector.scss";
import "./vendor/GLTFLoader";

import "./components/animation-mixer";
import "./components/audio-feedback";
import "./components/loop-animation";
import "./gltf-component-mappings";
import { avatars } from "./assets/avatars/avatars";

import registerTelemetry from "./telemetry";
import { App } from "./App";
import AvatarSelector from "./react-components/avatar-selector";

addLocaleData([...en]);

registerTelemetry();

window.APP = new App();
const hash = queryString.parse(location.hash);
const isMobile = AFRAME.utils.device.isMobile();
if (hash.quality) {
  window.APP.quality = hash.quality;
} else {
  window.APP.quality = isMobile ? "low" : "high";
}

function postAvatarIdToParent(newAvatarId) {
  window.parent.postMessage({ avatarId: newAvatarId }, location.origin);
}

function mountUI() {
  const hash = queryString.parse(location.hash);
  const avatarId = hash.avatar_id;
  ReactDOM.render(
    <IntlProvider locale={lang} messages={messages}>
      <AvatarSelector {...{ avatars, avatarId, onChange: postAvatarIdToParent }} />
    </IntlProvider>,
    document.getElementById("selector-root")
  );
}

window.addEventListener("hashchange", mountUI);
document.addEventListener("DOMContentLoaded", mountUI);
