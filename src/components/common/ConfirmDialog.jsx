import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="sm"
    >
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          {message}
        </p>
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          loading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}