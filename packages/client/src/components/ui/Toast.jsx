import useUiStore from '../../store/uiStore';

export default function Toast() {
  const toastMessage = useUiStore((s) => s.toastMessage);
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-3.5 z-50 text-[13px] shadow-lg">
      {toastMessage}
    </div>
  );
}

