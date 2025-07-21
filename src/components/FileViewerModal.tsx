import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ExternalLink, MessageCircle } from "lucide-react";
import ChatInterface from "./chat/ChatInterface";
import { useChat } from "@/hooks/useChat";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
}

const FileViewerModal = ({ isOpen, onClose, fileUrl, fileName, fileType }: FileViewerModalProps) => {
  const [isChatOpen, setIsChatOpen] = useState(true); // Start with chat open by default
  const { sendMessage, bellaState } = useChat();

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
        <div className="w-full h-full bg-white overflow-hidden">
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            width="100%"
            height="100%"
            title={fileName}
            className="border-0 w-full h-full"
            style={{ minHeight: '100%' }}
          />
        </div>
      );
    }

    if (fileType.includes('image')) {
      return (
        <div className="w-full h-full flex justify-center items-center bg-gray-50 overflow-auto">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    // For unsupported file types
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center bg-gray-50">
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
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] p-0" aria-describedby="file-viewer-description">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold truncate pr-4">
              {fileName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`${isChatOpen 
                  ? 'bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white border-0' 
                  : 'border-pink-400 text-pink-600 hover:bg-pink-50'
                }`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Bella
              </Button>
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
        
        {/* Main Content - Responsive Flexbox Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* PDF Viewer Container - Responsive width with smooth transitions */}
          <div 
            className={`
              flex-1 
              ${isChatOpen ? 'flex-[0_0_70%]' : 'flex-[1_1_100%]'} 
              transition-all 
              duration-300 
              ease-in-out 
              overflow-hidden
            `}
          >
            {/* PDF Content - Full height and width */}
            <div className={`
              w-full 
              h-full 
              ${isChatOpen ? 'p-4' : 'p-0'} 
              transition-all 
              duration-300
            `}>
              {renderFileContent()}
            </div>
          </div>

          {/* Bella Chat Panel - Slides in/out smoothly */}
          <div 
            className={`
              ${isChatOpen ? 'flex-[0_0_30%] opacity-100' : 'flex-[0_0_0%] opacity-0'} 
              transition-all 
              duration-300 
              ease-in-out 
              overflow-hidden 
              border-l 
              bg-gradient-to-b 
              from-pink-50 
              to-purple-50 
              dark:from-pink-950/20 
              dark:to-purple-950/20
            `}
          >
            {isChatOpen && (
              <div className="w-full h-full">
                <ChatInterface 
                  isOpen={true} 
                  onClose={() => setIsChatOpen(false)}
                  isEmbedded={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="flex sm:hidden gap-2 p-4 border-t bg-background">
          <Button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex-1 ${isChatOpen 
              ? 'bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white' 
              : 'bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white'
            }`}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {isChatOpen ? 'Hide Bella' : 'Ask Bella'}
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1">
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