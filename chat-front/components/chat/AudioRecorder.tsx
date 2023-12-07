import { useVoiceRecorder } from "@/libs/hooks/useVoiceRecorder";

export default function AudioRecorder({
  record,
  setRecord,
}: {
  record?: Blob;
  setRecord: (record?: Blob) => void;
}) {
  const { isRecording, start, stop } = useVoiceRecorder((data: Blob) => {
    setRecord(data);
  });

  const onDeleted = () => {
    setRecord(undefined);
  };

  return (
    <button
      type="button"
      className={`flex items-center justify-center border-2 border-indigo-500 rounded-full h-8 w-8 ${
        isRecording && "border-indigo-800 bg-gray-300"
      } ${record && "border-red-500 bg-red-100 text-red-500"}`}
      onMouseDown={() => !record && start()}
      onMouseUp={() => !record && stop()}
      onClick={() => record && onDeleted()}
    >
      {record ? "X" : isRecording ? "🎙️" : "🎙️"}
    </button>
  );
}
