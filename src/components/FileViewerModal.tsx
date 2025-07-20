import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ExternalLink } from "lucide-react";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
}

const FileViewerModal = ({ isOpen, onClose, fileUrl, fileName, fileType }: FileViewerModalProps) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  const renderFileContent = () => {
    if (fileType.includes('pdf')) {
      return (
        <div className="w-full h-[70vh] border rounded-lg overflow-hidden">
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            width="100%"
            height="100%"
            title={fileName}
            className="border-0"
          />
        </div>
      );
    }

    if (fileType.includes('image')) {
      return (
        <div className="flex justify-center items-center max-h-[70vh] overflow-auto">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      );
    }

    // For unsupported file types
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Preview Not Available</h3>
        <p className="text-muted-foreground mb-6">
          This file type cannot be previewed in the browser.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
          <Button variant="outline" onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] p-0" aria-describedby="file-viewer-description">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold truncate pr-4">
              {fileName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="hidden sm:flex"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="hidden sm:flex"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div id="file-viewer-description" className="sr-only">
          File viewer modal for {fileName}. Use ESC key or click the X button to close.
        </div>
        
        <div className="p-6 pt-4">
          {renderFileContent()}
        </div>

        {/* Mobile action buttons */}
        <div className="flex sm:hidden gap-2 p-4 border-t">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handleOpenInNewTab} className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewerModal;