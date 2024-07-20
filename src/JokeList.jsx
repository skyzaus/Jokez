import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getJokes = async () => {
    try {
      const newJokes = [];
      const seenJokes = new Set();

      while (newJokes.length < numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" }
        });
        console.log(res.data);  // Log API response
        const { id, joke } = res.data;

        if (!seenJokes.has(id)) {
          seenJokes.add(id);
          newJokes.push({ id, joke, votes: 0 });
        } 
      }

      setJokes(newJokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);  
    }
  };

  useEffect(() => {
    getJokes();
  }, [numJokesToGet]);

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  };

  const vote = (id, data) => {
    setJokes(allJokes =>
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + data } : j))
    );
  };

  const sortedJokes = jokes.sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {isLoading ? (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      ) : (
        sortedJokes.map(j => (
          <Joke
            key={j.id}
            id={j.id}
            votes={j.votes}
            text={j.joke}
            vote={vote}
          />
        ))
      )}
    </div>
  );
};

export default JokeList;