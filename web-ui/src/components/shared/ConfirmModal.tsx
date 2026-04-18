import { Button } from "../ui";
import SimpleModal from "./SimpleModal";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
}: Props) {
  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            确定
          </Button>
        </div>
      }
    >
      <p className="text-sm text-text-primary">{message}</p>
    </SimpleModal>
  );
}
