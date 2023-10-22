import axios from "axios";
import "./App.css";
import { useState, useRef } from "react";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

const url = "http://127.0.0.1:8000/api/getTopicId/";
async function getApiPromise(param) {
  const response = await axios.get(url, {
    params: {
      productName: param,
    },
  });
  return response;
}

function getVoices() {
  let voices = speechSynthesis.getVoices();
  if (!voices.length) {
    let utterance = new SpeechSynthesisUtterance("");
    speechSynthesis.speak(utterance);
    voices = speechSynthesis.getVoices();
  }
  return voices;
}

function App() {
  const [receivedData, setReceivedData] = useState(null);
  const ref = useRef(null);

  const handleSearch = () => {
    getApiPromise(ref.current?.value).then((data) =>
      setReceivedData(data.data)
    );
  };

  const handleTextToSpeech = () => {
    if ("speechSynthesis" in window) {
      let textToSpeak = `The price of ${
        receivedData.name
      } is rupees ${receivedData.price.replace("₹", "").replace(",", "")}`;
      let speakData = new SpeechSynthesisUtterance();
      speakData.volume = 1; 
      speakData.rate = 1; 
      speakData.pitch = 2; 
      speakData.text = textToSpeak;
      speakData.lang = "en";
      speakData.voice = getVoices()[0];

      speechSynthesis.speak(speakData);
    } else {
      alert("Text to speech is not available");
    }
  };
  return (
    <div className="App">
      <div className="main_box">
        <h2>Product Search</h2>
        <div className="input_div">
          <label className="above_input_text">Write the Product name</label>
          <input
            placeholder="Product Name"
            type="text"
            className="input_field"
            ref={ref}
          />
        </div>
        <button className="button" onClick={handleSearch}>
          Search
        </button>
        <p className="received_data">{receivedData?.name}</p>
        <p className="received_data">{receivedData?.price}</p>
        {receivedData && <HiOutlineSpeakerWave onClick={handleTextToSpeech} />}
      </div>
    </div>
  );
}

export default App;
