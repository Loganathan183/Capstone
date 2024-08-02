import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function CurrentTrack() {
  const [{ token, currentPlaying }, dispatch] = useStateProvider();

  const [loading, setLoading] = React.useState(true);




  useEffect(() => {
    const getCurrentTrack = async () => {
      setLoading(true);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.item) {
          const trackData = {
            id: response.data.item.id,
            name: response.data.item.name,
            artists: response.data.item.artists.map((artist) => artist.name),
            image: response.data.item.album.images[2]?.url,
          };
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: trackData });
        } else {
          console.log("No track is currently playing.");
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
        }
      } catch (error) {
        console.error("Error fetching current track:", error.response?.data || error.message);
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
      } finally {
        setLoading(false);
      }
    };

    getCurrentTrack();
  }, [token, dispatch]);

  return (
    <Container>
      {loading ? (
        <p>Loading...</p>
      ) : (
        currentPlaying && (
          <div className="track">
            <div className="track__image">
              <img src={currentPlaying.image} alt={currentPlaying.name} />
            </div>
            <div className="track__info">
              <h4 className="track__info__track__name">{currentPlaying.name}</h4>
              <h6 className="track__info__track__artists">
                {currentPlaying.artists.join(", ")}
              </h6>
            </div>
          </div>
        )
      )}
    </Container>
  );
}

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  &__image {
    /* Add any additional styles for the image here */
  }
  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    &__track__name {
      color: white;
    }
    &__track__artists {
      color: #b3b3b3;
    }
  }
`;
