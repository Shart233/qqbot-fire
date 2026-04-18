import type { ReactNode } from "react";
import { Modal } from "../ui";

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * SimpleModal：薄适配器，转发到新的 Modal 原子组件。
 * 保留旧 API，避免调用方改动。
 */
export default function SimpleModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: SimpleModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="md"
    >
      {children}
    </Modal>
  );
}
