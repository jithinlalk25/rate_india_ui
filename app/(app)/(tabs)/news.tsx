import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import axios from "axios";
import { Constant } from "../../../constants";
import { useSession } from "../../../ctx";
import { ActivityIndicator } from "react-native-paper";

const news = () => {
  const { session } = useSession();

  const [data, setData] = useState("");

  const getYoutubeVideos = async () => {
    try {
      const response = await axios.get(
        `${Constant.API_URL}news/getYoutubeVideos`,
        {
          headers: {
            token: session,
          },
        }
      );

      let tempData = "";
      response.data.forEach((item: any) => {
        tempData += `<div class="video-wrapper">
        <h3 class="video-title">
          ${item.title}
        </h3>
        <div class="video-container">
          <iframe
            src="${item.url}&enablejsapi=1"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>`;
      });

      setData(htmlStart + tempData + htmlEnd);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getYoutubeVideos();
  }, []);

  return data ? (
    <WebView
      originWhitelist={["*"]}
      source={{ html: data }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      style={styles.webview}
    />
  ) : (
    <ActivityIndicator style={{ marginVertical: 100 }} />
  );
};

export default news;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  webview: {
    flex: 1,
    width: "100%",
  },
});

const htmlStart = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      .video-wrapper {
        padding: 0px 10px 10px 10px;
        background-color: #0f0f0f;
        margin: 0px 5px 5px 5px;
      }

      .video-title {
        font-size: 18px;
        padding-top: 10px;
        color: #f1f1f1;
        margin-top: 0.1px;
      }

      .video-container {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
      }

      .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0">
    <div id="video-list">`;

const htmlEnd = `</div>

    <script>
      function onYouTubeIframeAPIReady() {
        var iframes = document.querySelectorAll("iframe");
        var players = [];

        iframes.forEach((iframe, index) => {
          var player = new YT.Player(iframe, {
            events: {
              onStateChange: onPlayerStateChange,
            },
          });
          players.push(player);
        });

        function onPlayerStateChange(event) {
          if (event.data === YT.PlayerState.PLAYING) {
            players.forEach((player) => {
              if (player !== event.target) {
                player.pauseVideo();
              }
            });
          }
        }
      }

      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    </script>
  </body>
</html>
`;
