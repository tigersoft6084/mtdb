import { jsx } from "react/jsx-runtime";
import { useContext, useRef, useState, useCallback, useEffect } from "react";
import { bG as PlayerStoreContext, bH as usePlayerStore, bI as useHtmlMediaInternalState, bJ as useHtmlMediaEvents, bK as useHtmlMediaApi } from "./user-profile-link-f8ce1543.mjs";
import Hls from "hls.js";
import "../server-entry.mjs";
import "react-dom/server";
import "process";
import "http";
import "@tanstack/react-query";
import "axios";
import "react-router-dom/server.mjs";
import "framer-motion";
import "slugify";
import "deepmerge";
import "clsx";
import "@internationalized/date";
import "nano-memoize";
import "zustand";
import "zustand/middleware/immer";
import "nanoid";
import "react-router-dom";
import "@internationalized/number";
import "react-hook-form";
import "@react-aria/utils";
import "@react-stately/utils";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "@react-aria/focus";
import "react-dom";
import "@react-aria/ssr";
import "immer";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "react-use-clipboard";
import "./OpenInNew-3487d289.mjs";
import "fscreen";
import "zustand/middleware";
import "zustand/traditional";
import "@react-aria/interactions";
function HlsProvider() {
  const store = useContext(PlayerStoreContext);
  const cuedMedia = usePlayerStore((s) => s.cuedMedia);
  const videoRef = useRef(null);
  const htmlMediaState = useHtmlMediaInternalState(videoRef);
  const htmlMediaEvents = useHtmlMediaEvents(htmlMediaState);
  const htmlMediaApi = useHtmlMediaApi(htmlMediaState);
  const hls = useRef();
  const [hlsReady, setHlsReady] = useState(false);
  const destroyHls = useCallback(() => {
    var _a;
    if (hls) {
      (_a = hls.current) == null ? void 0 : _a.destroy();
      hls.current = void 0;
      setHlsReady(false);
    }
  }, []);
  const setupHls = useCallback(() => {
    if (!Hls.isSupported()) {
      store.getState().emit("error", { fatal: true });
      return;
    }
    const hlsInstance = new Hls({
      startLevel: -1
    });
    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hlsInstance.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hlsInstance.recoverMediaError();
            break;
          default:
            destroyHls();
            break;
        }
      }
      store.getState().emit("error", { sourceEvent: data, fatal: data.fatal });
    });
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      var _a;
      if (!((_a = hlsInstance.levels) == null ? void 0 : _a.length))
        return;
      store.getState().emit("playbackQualities", {
        qualities: ["auto", ...hlsInstance.levels.map(levelToPlaybackQuality)]
      });
      store.getState().emit("playbackQualityChange", { quality: "auto" });
    });
    hlsInstance.on(Hls.Events.AUDIO_TRACK_SWITCHED, (eventType, data) => {
      const track = store.getState().audioTracks.find((t) => t.id === data.id);
      if (track) {
        store.getState().emit("currentAudioTrackChange", { trackId: track.id });
      }
    });
    hlsInstance.on(
      Hls.Events.LEVEL_LOADED,
      (eventType, data) => {
        var _a;
        if (!store.getState().providerReady) {
          const { type, live, totalduration: duration } = data.details;
          const inferredStreamType = live ? type === "EVENT" && Number.isFinite(duration) ? "live:dvr" : "live" : "on-demand";
          store.getState().emit("streamTypeChange", {
            streamType: ((_a = store.getState().cuedMedia) == null ? void 0 : _a.streamType) || inferredStreamType
          });
          store.getState().emit("durationChange", { duration });
          const audioTracks = hlsInstance.audioTracks.map(
            (track) => ({
              id: track.id,
              label: track.name,
              language: track.lang || "",
              kind: "main"
            })
          );
          store.getState().emit("audioTracks", { tracks: audioTracks });
        }
      }
    );
    hlsInstance.attachMedia(videoRef.current);
    hls.current = hlsInstance;
    setHlsReady(true);
  }, [destroyHls, store]);
  useEffect(() => {
    setupHls();
    return () => {
      destroyHls();
    };
  }, [setupHls, destroyHls]);
  useEffect(() => {
    if (hls.current && (cuedMedia == null ? void 0 : cuedMedia.src) && hls.current.url !== (cuedMedia == null ? void 0 : cuedMedia.src)) {
      hls.current.loadSource(cuedMedia.src);
    }
  }, [cuedMedia == null ? void 0 : cuedMedia.src, hlsReady]);
  useEffect(() => {
    if (!hlsReady)
      return;
    store.setState({
      providerApi: {
        ...htmlMediaApi,
        setCurrentAudioTrack: (trackId) => {
          if (!hls.current)
            return;
          hls.current.audioTrack = trackId;
        },
        setPlaybackQuality: (quality) => {
          if (!hls.current)
            return;
          hls.current.currentLevel = hls.current.levels.findIndex(
            (level) => levelToPlaybackQuality(level) === quality
          );
          store.getState().emit("playbackQualityChange", { quality });
        }
      }
    });
  }, [htmlMediaApi, store, hlsReady]);
  return /* @__PURE__ */ jsx(
    "video",
    {
      className: "h-full w-full",
      ref: videoRef,
      playsInline: true,
      poster: cuedMedia == null ? void 0 : cuedMedia.poster,
      ...htmlMediaEvents
    }
  );
}
const levelToPlaybackQuality = (level) => {
  return level === -1 ? "auto" : `${level.height}p`;
};
export {
  HlsProvider as default
};
//# sourceMappingURL=hls-provider-49be570e.mjs.map
