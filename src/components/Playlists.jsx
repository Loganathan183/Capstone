import axios from "axios";
import React, { useEffect } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function PlaylistDetails() {""
  const [{ token }, dispatch] = useStateProvider();
  const playlistId = "3cEYpjA9oz9GiPac4AsH4n"; 

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const playlistData = response.data;
        dispatch({ type: reducerCases.SET_PLAYLIST_DETAILS, playlistData });
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchPlaylist();
  }, [token, dispatch]);

  return <div></div>;
}
