import { useVoiceRecorder } from "@/libs/hooks/useVoiceRecorder";
import { useState } from "react";

export default function AudioRecorder() {
  const [record, setRecord] = useState<string>();
  const { isRecording, recorder, error, start, stop } = useVoiceRecorder(
    (data: Blob) => {
      setRecord(window.URL.createObjectURL(data));
    }
  );

  return (
    <button
      className="audio-input__button"
      onClick={isRecording ? stop : start}
    >
      {isRecording ? "Stop" : "Start"}
    </button>
  );
}
