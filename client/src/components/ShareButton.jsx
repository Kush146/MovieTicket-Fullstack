import React, { useState } from 'react'
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ShareButton = ({ title, url, description, image }) => {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + url : url
  const shareText = description || title

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = async (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)

    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
    }

    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    } else {
      // Fallback to copy if native share not available
      handleCopy()
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition text-sm font-medium"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {/* Dropdown menu for desktop */}
      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2 space-y-1">
          <button
            onClick={() => handleShare('facebook')}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-md transition text-sm"
          >
            <Facebook className="w-4 h-4 text-blue-500" />
            Facebook
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-md transition text-sm"
          >
            <Twitter className="w-4 h-4 text-blue-400" />
            Twitter
          </button>
          <button
            onClick={() => handleShare('whatsapp')}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-md transition text-sm"
          >
            <MessageCircle className="w-4 h-4 text-green-500" />
            WhatsApp
          </button>
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-md transition text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareButton

