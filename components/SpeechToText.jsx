import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import stringSimilarity  from "string-similarity";

const SpeechToText = () => {
  const speechRecognitionSupported =
    SpeechRecognition.browserSupportsSpeechRecognition();

  const [isSupported, setIsSupported] = useState(null);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("id");
  const [response, setResponse] = useState({
    loading: false,
    message: "",
    error: false,
    success: false
  });
  const textBodyRef = useRef(null);
  const textAnswerRef = useRef(null);

  const startListening = () => {
    setListening(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: language
    });
  };

  const stopListening = () => {
    setListening(false);
    SpeechRecognition.stopListening();
  };

  const resetText = () => {
    stopListening();
    resetTranscript();
    textBodyRef.current.innerText = "";
  };

  const [answer, setAnswer] = useState("Aku Sehat");

  const handleConversion = async () => {
    if (typeof window !== "undefined") {
      const userText = textBodyRef.current.innerText;
    

      if (!userText) {
        alert("Anda belum berbicara, mohon klik tombol mulai untuk berbicara.");
        return;
      }

      try {
        setResponse({
          ...response,
          loading: true,
          message: "",
          error: false,
          success: false,
        });

        const matchingPercentage = stringSimilarity.compareTwoStrings(answer.toLowerCase(), transcript.toLowerCase());

        setResponse({
          ...response,
          loading: false,
          error: false,
          message:
            "Persentase kemiripan yaitu " + Math.round(matchingPercentage * 100) + "%",
          success: true,
        });

       
      } catch (error) {
        setResponse({
          ...response,
          loading: false,
          error: true,
          message:
            "Terjadi Kesalahan. Mohon Coba kembali",
          success: false,
        });
      }
    }
  };

  const changeLanguage = (val) => {
    stopListening();
    resetTranscript();
    setLanguage(val);
    textBodyRef.current.innerText = "";
  }

  useEffect(() => {
    setIsSupported(speechRecognitionSupported);
  }, []);

  if (!isSupported) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  return (
    <>
      <section>
        <div className="container"> 
        <div>
            Pilih Bahasa : 
            <select
              value={language}
              onChange={(e) => {
                  changeLanguage(e.target.value);
                }}>
              <option value="en">English</option>
              <option value="id">Indonesia</option>
            </select>
          </div>
          <p>Microphone: {listening ? 'on' : 'off'}</p>
        </div>
        <div className="button-container">
          { listening ?
              (<button
                type="button"
                onClick={stopListening}
                style={{ "--bgColor": "red" }}
                disabled={listening === false}
              >
                Berhenti
              </button>) : (<button
                type="button"
                onClick={startListening}
                style={{ "--bgColor": "blue" }}
                disabled={listening}
              >
                Mulai
              </button>)
            }
          
        </div>
        <h2>User Voice Input :</h2>
        <div
          className="words"
          ref={textBodyRef}
        >
          {transcript}
        </div>
        <div>
        <h2>Jawaban (Text yang ingin dicocokan)</h2>
        <input
          type="text"
          className="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        </div>
        <div>
          {response.success && <i className="success">{response.message}</i>}
          {response.error && <i className="error">{response.message}</i>}
        </div>
        <div className="button-container">
          <button
            type="button"
            onClick={resetText}
            style={{ "--bgColor": "red" }}
          >
            Reset
          </button>
          <button
            type="button"
            style={{ "--bgColor": "green" }}
            onClick={handleConversion}
          >
            {response.loading ? "Sedang diproses..." : "Cek"}
          </button>
        </div>
      </section>
    </>
  );
};

export default SpeechToText;
